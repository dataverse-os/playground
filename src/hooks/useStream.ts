import { useState, useContext } from "react";
import {
  FileType,
  Currency,
  WALLET,
  StreamContent,
} from "@dataverse/dataverse-connector";
import { Context } from "../context";
import { Model, StreamsRecord } from "../types";
import { getAddressFromDid } from "../utils";

export function useStream() {
  const { dataverseConnector, output } = useContext(Context);
  const [pkh, setPkh] = useState<string>();
  const [streamsRecord, setStreamsRecord] = useState<StreamsRecord>({});

  const checkCapability = async () => {
    const res = await dataverseConnector.checkCapability();
    return res;
  };

  const createCapability = async (wallet?: WALLET) => {
    const currentPkh = await dataverseConnector.createCapability({
      wallet,
      app: output.createDapp.name,
    });

    setPkh(currentPkh);
    return currentPkh;
  };

  const loadStreams = async ({
    pkh,
    modelId,
  }: {
    pkh?: string;
    modelId: string;
  }) => {
    let streams;
    if (pkh) {
      streams = await dataverseConnector.loadStreamsBy({
        modelId,
        pkh,
      });
    } else {
      streams = await dataverseConnector.loadStreamsBy({
        modelId,
      });
    }
    console.log("streams loaded:", streams)
    setStreamsRecord(streams);
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
    const encrypted = {} as any;
    if (stream && Object.keys(stream).length > 0) {
      Object.keys(stream).forEach((key) => {
        encrypted[key] = false;
      });
    }

    const inputStreamContent = {
      ...stream,
      ...(!model.isPublicDomain &&
        stream && {
          encrypted: JSON.stringify(encrypted),
        }),
    };
    const { pkh, modelId, streamId, streamContent } =
      await dataverseConnector.createStream({
        modelId: model.stream_id,
        streamContent: inputStreamContent,
      });

    if (streamContent) {
      return _updateStreamRecord({
        pkh,
        modelId,
        streamId,
        streamContent,
      });
    } else {
      throw "Failed to create stream";
    }
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
    const inputStreamContent = {
      ...stream,
      ...(stream && {
        encrypted: JSON.stringify(encrypted),
      }),
    };
    const { pkh, modelId, streamId, streamContent } =
      await dataverseConnector.createStream({
        modelId: model.stream_id,
        streamContent: inputStreamContent,
      });

    if (streamContent) {
      return {
        streamId,
        app: output.createDapp.name,
        pkh,
        modelId,
        streamContent,
      };
    } else {
      throw "Failed to create stream";
    }
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

    const { modelId, streamId, streamContent } = await createEncryptedStream({
      model,
      stream,
      encrypted,
    });

    return monetizeStream({
      pkh,
      modelId,
      lensNickName,
      streamId,
      streamContent,
      profileId,
      currency,
      amount,
      collectLimit,
    });
  };

  const monetizeStream = async ({
    pkh,
    modelId,
    streamId,
    lensNickName,
    profileId,
    streamContent,
    currency,
    amount,
    collectLimit,
  }: {
    pkh: string;
    modelId: string;
    streamId: string;
    lensNickName?: string;
    streamContent?: StreamContent;
    profileId?: string;
    currency: Currency;
    amount: number;
    collectLimit: number;
  }) => {
    try {
      if (!profileId) {
        profileId = await _getProfileId({ pkh, lensNickName });
      }
      if (!streamContent) {
        streamContent = streamsRecord[streamId].streamContent;
      }
      const { streamContent: updatedStreamContent } =
        await dataverseConnector.monetizeFile({
          streamId,
          indexFileId: streamContent.file.indexFileId,
          datatokenVars: {
            profileId,
            currency,
            amount,
            collectLimit,
          },
        });
      if (updatedStreamContent) {
        return _updateStreamRecord({
          pkh,
          modelId,
          streamId,
          streamContent: updatedStreamContent,
        });
      } else {
        throw "Failed to monetize file";
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateStream = async ({
    model,
    streamId,
    stream,
    encrypted,
  }: {
    model: Model;
    streamId: string;
    stream: object;
    encrypted?: object;
  }) => {
    try {
      const fileType = streamsRecord[streamId]?.streamContent.fileType;
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
      const inputStreamContent: StreamContent = {
        ...stream,
        encrypted: JSON.stringify(encrypted),
      };

      const { streamContent } = await dataverseConnector.updateStream({
        streamId,
        streamContent: inputStreamContent,
        syncImmediately: true,
      });

      return _updateStreamRecord({
        streamId,
        streamContent: streamContent,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const unlockStream = async (streamId: string) => {
    try {
      const { streamContent } = await dataverseConnector.unlock({
        streamId,
      });

      if (streamContent) {
        return _updateStreamRecord({
          streamId,
          streamContent,
        });
      } else {
        throw "Fail to unlock stream";
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const _getProfileId = async ({
    pkh,
    lensNickName,
  }: {
    pkh: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await dataverseConnector.getProfiles(
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
      profileId = await dataverseConnector.createProfile(lensNickName);
    }
    return profileId;
  };

  const _updateStreamRecord = ({
    pkh,
    modelId,
    streamId,
    streamContent,
  }: {
    pkh?: string;
    modelId?: string;
    streamId: string;
    streamContent: StreamContent;
  }) => {
    const streamsRecordCopy = JSON.parse(
      JSON.stringify(streamsRecord)
    ) as StreamsRecord;

    console.log(
      "Before update, streamsRecordCopy[streamId]:",
      streamsRecordCopy[streamId]
    );
    if (pkh && modelId) {
      streamsRecordCopy[streamId] = {
        app: output.createDapp.name,
        pkh,
        modelId,
        streamContent,
      };
    } else {
      streamsRecordCopy[streamId] = {
        ...streamsRecordCopy[streamId],
        streamContent,
      };
    }
    console.log(
      "After update, streamsRecordCopy[streamId]:",
      streamsRecordCopy[streamId]
    );
    setStreamsRecord(streamsRecordCopy);

    return {
      streamId,
      app: streamsRecordCopy[streamId].app,
      pkh: pkh || streamsRecordCopy[streamId].pkh,
      modelId: modelId || streamsRecordCopy[streamId].modelId,
      streamContent,
    };
  };

  return {
    pkh,
    streamsRecord,
    setStreamsRecord,
    checkCapability,
    createCapability,
    loadStreams,
    createPublicStream,
    createEncryptedStream,
    createPayableStream,
    monetizeStream,
    unlockStream,
    updateStream,
  };
}
