import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useMemo, useContext, useState } from "react";
import { postSlice } from "@/state/post/slice";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { useStream } from "@/hooks";
// import { appName, appVersion } from "@/sdk";
import { Model, PostStream } from "@/types";
import { Context } from "@/context";
import { decode, detectDataverseExtension } from "@/utils";
import { ceramic } from "@/sdk";
import { IndexFileContentType, StructuredFiles } from "@dataverse/runtime-connector";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const { postModel, indexFilesModel, appVersion } = useContext(Context);
  const [hasExtension, setHasExtension] = useState<boolean>();
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const postListLeft = useMemo(() => {
    return postStreamList
      .map((post, index) => {
        if (index % 2 === 1) return post;
      })
      .filter((element) => {
        return element !== undefined;
      });
  }, [postStreamList]);
  const postListRight = useMemo(() => {
    return postStreamList
      .map((post, index) => {
        if (index % 2 === 0) return post;
      })
      .filter((element) => {
        return element !== undefined;
      });
  }, [postStreamList]);
  const dispatch = useAppDispatch();

  const { 
    streamRecord, 
    setStreamRecord,
    loadStream, 
    createPublicStream, 
    createPayableStream 
  } = useStream();

  useEffect(()=>{
    detectDataverseExtension().then((res)=>{
      setHasExtension(res);
    })
  }, [])

  useEffect(() => {
    if(postModel) {
      if(hasExtension === true) {
        loadStream({ modelId: postModel.stream_id });
      } else if(hasExtension === false) {
        loadStreamByCeramic();
      }
    }
  }, [postModel, hasExtension]);

  useEffect(() => {
    const streamList: PostStream[] = [];
    Object.entries(streamRecord).forEach(([streamId, streamContent]) => {
      streamList.push({
        streamId,
        streamContent,
      });
    });
    const sortedList = streamList
      .filter(
        (el) =>
          el.streamContent.content?.appVersion === appVersion &&
          (el.streamContent.content.text ||
            (el.streamContent.content.images &&
              el.streamContent.content.images?.length > 0) ||
            (el.streamContent.content.videos &&
              el.streamContent.content.videos?.length > 0))
      )
      .sort(
        (a, b) =>
          Date.parse(b.streamContent.createdAt) -
          Date.parse(a.streamContent.createdAt)
      );
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }, [streamRecord]);

  const loadStreamByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.stream_id
    );
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.stream_id
    );

    const structuredFiles = {} as StructuredFiles;
    Object.entries(indexedFilesStreams).forEach(([indexFileId, indexFile]) => {
      structuredFiles[indexFileId] = {
        indexFileId,
        ...indexFile,
        comment: decode(indexFile.comment),
        ...(indexFile.relation && {
          relation: decode(indexFile.relation),
        }),
        ...(indexFile.additional && {
          additional: decode(indexFile.additional),
        }),
        ...(indexFile.decryptionConditions && {
          decryptionConditions: decode(indexFile.decryptionConditions),
        }),
      };
    });

    Object.values(structuredFiles).forEach((structuredFile) => {
      const { contentId, contentType, controller } = structuredFile;
      if (
        postStreams[contentId] &&
        postStreams[contentId].controller === controller
      ) {
        postStreams[contentId] = {
          ...(!(contentType in IndexFileContentType) &&
            postStreams[contentId] && {
            content: postStreams[contentId],
          }),
          ...structuredFile,
        };
      }
    });

    setStreamRecord(postStreams);
  }

  return (
    <>
      <Wrapper>
        <PublishPost
          createPublicStream={createPublicStream}
          createPayableStream={createPayableStream}
          loadStream={loadStream}
        />
        {postListLeft.map((postStream, index) => (
          <DisplayPostItem
            postStream={postStream!}
            key={postStream!.streamId}
          />
        ))}
      </Wrapper>
      <Wrapper>
        {postListRight.map((postStream, index) => (
          <DisplayPostItem
            postStream={postStream!}
            key={postStream!.streamId}
          />
        ))}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
