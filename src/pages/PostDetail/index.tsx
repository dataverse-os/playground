import React from "react";
import DisplayPostItem from "@/components/DisplayPost/DisplayPostItem";
import styled from "styled-components";
import Comment from "@/components/Comment";
import Hint from "@/components/Comment/Hint";
import CommentEditor from "@/components/Comment/CommentEditor";
import Header from "@/components/AppLayout/Header";
import { useSelector } from "@/state/hook";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .header {
    margin: 0 20px;
  }

  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }

  .post {
    @media (max-width: 1200px) {
      width: 60vw;
    }
    @media (max-width: 768px) {
      width: 80vw;
    }
    width: 40vw;
    min-width: 540px;
  }
`;

export default function PostDetail() {
  // const streamId =
  //   "kjzl6kcym7w8y8tsf43pvswchf4dbdoevtr3swmt28m4vrwqa8pi49yhly4ga3b";
  const { streamId } = useParams();
  const postStreamList = useSelector((state) => state.post.postStreamList);
  console.log({ postStreamList });
  const postStream = postStreamList.find((postStream) => {
    console.log({ streamId });
    return postStream.streamId === streamId;
  });
  console.log({ postStream });
  return (
    <Wrapper>
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <div className="post">
          <DisplayPostItem
            postStream={postStream!}
            key={postStream!.streamId}
          />
          <div className="comment-list">
            <CommentEditor onSubmit={(content) => console.log(content)} />
            <Hint text="Be the first one to comment" />
            {/* <Comment
              author="Alice"
              userId="alice"
              content="This is a great article!"
              avatar="https://robohash.org/1"
            />
            <Comment
              author="Alice"
              userId="alice"
              content="This is a great article!"
              avatar="https://robohash.org/2"
            /> */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
