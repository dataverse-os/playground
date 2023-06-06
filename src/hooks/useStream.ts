import { useState, useContext } from "react";
import {
  FileType,
  Currency,
  MirrorFile,
  CRYPTO_WALLET,
  StreamContent
} from "@dataverse/runtime-connector";
import { Context } from "../main";
import { Model } from "../types";
import { getAddressFromDid } from "../utils/didAndAddress";

export function useStream(appName: string, wallet?: CRYPTO_WALLET) {
  const { runtimeConnector } = useContext(Context);
  const [pkh, setPkh] = useState("");
  const [streamRecord, setStreamRecord] = useState<Record<string, MirrorFile>>(
    {}
  );

  const checkCapability = async () => {
    const res = await runtimeConnector.checkCapability(appName);
    return res;
  };

  const createCapability = async () => {
    const currentPkh = await runtimeConnector.createCapability({
      wallet,
      app: appName,
    });

    setPkh(currentPkh);
    return currentPkh;
  };

  const loadStream = async ({
    pkh,
    modelId,
  }: {
    pkh?: string;
    modelId: string;
  }) => {
    let streams;
    if (pkh) {
      streams = await runtimeConnector.loadStreamsBy({
        modelId,
        pkh,
      });
    } else {
      streams = await runtimeConnector.loadStreamsBy({
        modelId,
      });
    }
    setStreamRecord(streams);
    return streams;
  };

  const createPublicStream = async ({
    model,
    stream,
  }: {
    pkh: string;
    model: Model;
    stream?: object;
  }) => {
    console.log("model:", model);
    console.log("stream:", stream);
    let encrypted = {} as any;
    if (stream && Object.keys(stream).length > 0) {
      Object.keys(stream).forEach((key) => {
        encrypted[key] = false;
      });
    }

    const streamContent = {
      ...stream,
      ...(!model.isPublicDomain &&
        stream && {
          encrypted: JSON.stringify(encrypted),
        }),
    };
    const { newFile, existingFile } = await runtimeConnector.createStream({
      modelId: model.modelId,
      streamContent,
    });

    if (!newFile && !existingFile) {
      throw "Failed to create stream";
    }
    (existingFile || newFile)!.content = streamContent;

    const streamObject = {
      stream: (existingFile || newFile)!,
      streamId: (existingFile || newFile)!.contentId!,
    };

    _updateStreamRecord(streamObject);

    return streamObject;
  };

  const createEncryptedStream = async ({
    model,
    stream,
    encrypted,
  }: {
    model: Model;
    stream: object;
    encrypted: object;
  }) => {
    const streamContent = {
      ...stream,
      ...(stream && {
        encrypted: JSON.stringify(encrypted),
      }),
    };
    const { newFile } = await runtimeConnector.createStream({
      modelId: model.modelId,
      streamContent,
    });

    if (!newFile) {
      throw "Failed to create content";
    }

    newFile.content = streamContent;

    const streamObject = {
      stream: newFile,
      streamId: newFile.contentId!,
    };

    _updateStreamRecord(streamObject);

    return streamObject;
  };

  const createPayableStream = async ({
    pkh,
    model,
    profileId,
    stream,
    lensNickName,
    currency,
    amount,
    collectLimit,
    encrypted,
  }: {
    pkh: string;
    model: Model;
    profileId?: string;
    stream: object;
    lensNickName?: string;
    currency: Currency;
    amount: number;
    collectLimit: number;
    encrypted: object;
  }) => {
    if (!profileId) {
      profileId = await _getProfileId({ pkh, lensNickName });
    }

    const res = await createEncryptedStream({
      model,
      stream,
      encrypted,
    });

    console.log("createEncryptedStream res:", res);

    res.stream.content = stream;

    return monetizeStream({
      pkh,
      model,
      lensNickName,
      streamId: res.streamId,
      mirrorFile: res.stream,
      profileId,
      encrypted,
      currency,
      amount,
      collectLimit,
    });
  };

  const monetizeStream = async ({
    pkh,
    model,
    streamId,
    lensNickName,
    profileId,
    mirrorFile,
    encrypted,
    currency,
    amount,
    collectLimit,
  }: {
    pkh: string;
    model: Model;
    streamId: string;
    lensNickName?: string;
    mirrorFile?: MirrorFile;
    profileId?: string;
    encrypted: object;
    currency: Currency;
    amount: number;
    collectLimit: number;
  }) => {
    if (!profileId) {
      profileId = await _getProfileId({ pkh, lensNickName });
    }
    if (!mirrorFile) {
      mirrorFile = streamRecord[streamId];
    }

    let streamContent: StreamContent;
    let currentFile: MirrorFile;

    try {
      const res = await runtimeConnector.monetizeFile({
        app: appName,
        streamId,
        indexFileId: mirrorFile.indexFileId,
        datatokenVars: {
          profileId,
          currency,
          amount,
          collectLimit,
        },
      });
      streamContent = res.streamContent!;
      currentFile = res.currentFile;
    } catch (error: any) {
      console.log(error);
      throw error;
    }

    (mirrorFile.content as { encrypted: string }).encrypted =
      JSON.stringify(encrypted);
    (mirrorFile.content as { updatedAt: string }).updatedAt =
      new Date().toISOString();

    await runtimeConnector.updateStream({
      app: appName,
      streamId,
      streamContent,
      syncImmediately: true,
    });

    return {
      streamId,
      content: await _reloadStreamRecord({
        pkh,
        modelId: model.modelId,
        streamId,
      }),
    };
  };

  const updateStream = async ({
    pkh,
    model,
    streamId,
    stream,
    encrypted,
  }: {
    pkh: string;
    model: Model;
    streamId: string;
    stream: object;
    encrypted?: object;
  }) => {
    const fileType = streamRecord[streamId]?.fileType;

    if (
      !model.isPublicDomain &&
      stream &&
      encrypted &&
      fileType === FileType.Public
    ) {
      for (let key in encrypted) {
        (encrypted as any)[key] = false;
      }
    }
    const streamContent: StreamContent = {
      ...stream,
      encrypted: JSON.stringify(encrypted),
    };

    await runtimeConnector.updateStream({
      app: appName,
      streamId,
      streamContent,
      syncImmediately: true,
    });

    return {
      streamId,
      stream: await _reloadStreamRecord({
        pkh,
        modelId: model.modelId,
        streamId,
      }),
    };
  };

  const unlockStream = async (streamId: string) => {
    let stream = streamRecord[streamId];

    const res = await runtimeConnector.unlock({
      app: appName,
      streamId,
    });

    stream = res;

    const streamObject = {
      streamId: stream.contentId!,
      stream,
    };

    return {
      streamId,
      stream: _updateStreamRecord(streamObject),
    };
  };

  const _getProfileId = async ({
    pkh,
    lensNickName,
  }: {
    pkh: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await runtimeConnector.getProfiles(
      getAddressFromDid(pkh)
    );

    let profileId;
    if (lensProfiles?.[0]?.id) {
      profileId = lensProfiles?.[0]?.id;
    } else {
      if (!lensNickName) {
        throw "Please pass in lensNickName";
      }
      if (!/^[\da-z]{5,26}$/.test(lensNickName) || lensNickName.length > 26) {
        throw "Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length";
      }
      profileId = await runtimeConnector.createProfile(lensNickName);
    }

    return profileId;
  };

  const _reloadStreamRecord = async ({
    pkh,
    modelId,
    streamId,
  }: {
    pkh: string;
    modelId: string;
    streamId: string;
  }) => {
    const streamRecord = await loadStream({ pkh, modelId });

    setStreamRecord(streamRecord);

    return streamRecord[streamId];
  };

  const _updateStreamRecord = ({
    streamId,
    stream,
  }: {
    streamId: string;
    stream: MirrorFile | object;
  }) => {
    const streamRecordCopy = JSON.parse(JSON.stringify(streamRecord)) as Record<
      string,
      MirrorFile
    >;

    streamRecordCopy[streamId] = stream as MirrorFile;

    setStreamRecord(streamRecordCopy);

    return streamRecordCopy[streamId];
  };

  return {
    pkh,
    streamRecord,
    checkCapability,
    createCapability,
    loadStream,
    createPublicStream,
    createEncryptedStream,
    createPayableStream,
    monetizeStream,
    unlockStream,
    updateStream,
  };
}
