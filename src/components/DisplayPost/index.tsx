import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useRef, useMemo, createRef, useState } from "react";
import { postSlice } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { useStream } from "@/hooks";
import { appName, appVersion } from "@/sdk";
import { Model, PostStream } from "@/types";
import app from "@/output/app.json"

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const postListLeft = postStreamList
    .map((post, index) => {
      if (index % 2 === 1) return post;
    })
    .filter((element) => {
      return element !== undefined;
    });
  const postListRight = postStreamList
    .map((post, index) => {
      if (index % 2 === 0) return post;
    })
    .filter((element) => {
      return element !== undefined;
    });
  const pkh = useSelector((state) => state.identity.pkh);
  const dispatch = useAppDispatch();
  const leftRef = useMemo(
    () =>
      Array(postStreamList.length)
        .fill(0)
        .map((i) => createRef<HTMLDivElement>()),
    [postStreamList]
  );
  const rightRef = useMemo(
    () =>
      Array(postStreamList.length)
        .fill(0)
        .map((i) => createRef<HTMLDivElement>()),
    [postStreamList]
  );

  const [postModel, setPostModel] = useState<Model>({
    modelName: "",
    modelId: "",
    isPublicDomain: false,
  });

  useEffect(() => {
    setPostModel(
      // app.models.find(
      //   (model) => model.name === `${app.createDapp.slug}_post`
      // ) as Model
      Object.values(app.models).find((model) => model.modelName === 'playground_post') as Model
    );
  }, []);

  const {
    loadStream
  } = useStream(appName);

  useEffect(() => {
    // dispatch(displayPostList());
    console.log("model inited, start to init stream list")
    initStreamList();
  }, [postModel]);
  
  const initStreamList = async () => {
    console.log("load with hooks, modelId:", postModel.modelId)
    const streams = await loadStream({pkh, modelId: postModel.modelId});
    console.log("load with hooks, streams:", streams)
    const streamList: PostStream[] = [];

    Object.entries(streams).forEach(([streamId, streamContent]) => {
      streamList.push({
        streamId,
        streamContent,
      });
    });
    console.log("pushed, streamList:", streamList)
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
  }

  return (
    <>
      <Wrapper>
        <PublishPost />
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
