import React, { useEffect, useMemo } from "react";

import { FileType } from "@dataverse/dataverse-connector";
import { useApp, useAction, useFeeds, useStore } from "@dataverse/hooks";
import { detectDataverseExtension } from "@dataverse/utils";

import DisplayPostItem from "./DisplayPostItem";
import LoadingPostItem from "./LoadingPostItem";
import { Wrapper } from "./styled";

import PublishPost from "@/components/PublishPost";
import { usePlaygroundStore } from "@/context";
import { ceramic } from "@/sdk";
import { StreamRecordMap } from "@/types";

const DisplayPost = () => {
  const {
    modelParser,
    appVersion,
    sortedStreamIds,
    setIsDataverseExtension,
    setSortedStreamIds,
    setIsConnecting,
  } = usePlaygroundStore();
  const postModel = useMemo(() => {
    return modelParser.getModelByName("post");
  }, []);
  const indexFilesModel = useMemo(() => {
    return modelParser.getModelByName("indexFiles");
  }, []);

  const { filesMap } = useStore();
  const { actionLoadFiles } = useAction();
  const { loadFeeds } = useFeeds();

  const { connectApp } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
    onPending: () => {
      setIsConnecting(true);
    },
    onError: () => {
      setIsConnecting(false);
    },
    onSuccess: () => {
      setIsConnecting(false);
    },
  });

  useEffect(() => {
    detectDataverseExtension().then(res => {
      setIsDataverseExtension(res);
      if (res === true) {
        console.log("load with extension");
        loadFeeds(postModel.streams[postModel.streams.length - 1].modelId);
      } else if (res === false) {
        console.log("load with ceramic");
        loadFeedsByCeramic();
      }
    });
  }, []);

  useEffect(() => {
    if (filesMap) {
      const _sortedStreamIds = Object.keys(filesMap)
        .filter(
          el =>
            filesMap[el].pkh &&
            filesMap[el].fileContent.content.appVersion === appVersion &&
            filesMap[el].fileContent.file &&
            filesMap[el].fileContent.file.fileType !==
              FileType.PrivateFileType &&
            (filesMap[el].fileContent.file.fileType !==
              FileType.PayableFileType ||
              filesMap[el].fileContent.file.accessControl?.monetizationProvider
                ?.datatokenId),
        )
        .sort(
          (a, b) =>
            Date.parse(filesMap[b].fileContent.content.createdAt) -
            Date.parse(filesMap[a].fileContent.content.createdAt),
        );

      setSortedStreamIds(_sortedStreamIds);
      // console.log(filesMap);
    }
  }, [filesMap]);

  const loadFeedsByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.streams[postModel.streams.length - 1].modelId,
    );
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.streams[postModel.streams.length - 1].modelId,
    );
    const ceramicStreamsRecordMap: StreamRecordMap = {};
    Object.entries(postStreams).forEach(([streamId, content]) => {
      ceramicStreamsRecordMap[streamId] = {
        appId: modelParser.appId,
        modelId: postModel.streams[postModel.streams.length - 1].modelId,
        pkh: content.controller,
        fileContent: {
          content,
        },
      };
    });

    Object.values(indexedFilesStreams).forEach(file => {
      if (ceramicStreamsRecordMap[file.contentId]) {
        ceramicStreamsRecordMap[file.contentId].fileContent.file = file;
      }
    });

    actionLoadFiles(ceramicStreamsRecordMap);
  };

  return (
    <>
      <Wrapper>
        <PublishPost
          modelId={postModel.streams[postModel.streams.length - 1].modelId}
          connectApp={connectApp}
        />
        {!filesMap ? (
          <>
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
          </>
        ) : (
          sortedStreamIds.map((streamId, index) =>
            index % 2 == 1 ? (
              <DisplayPostItem
                fileId={streamId}
                key={streamId}
                connectApp={connectApp}
              />
            ) : undefined,
          )
        )}
      </Wrapper>
      <Wrapper>
        {!filesMap ? (
          <>
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
          </>
        ) : (
          sortedStreamIds.map((streamId, index) =>
            index % 2 == 0 ? (
              <DisplayPostItem
                fileId={streamId}
                key={streamId}
                connectApp={connectApp}
              />
            ) : undefined,
          )
        )}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
