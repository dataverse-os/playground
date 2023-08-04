import React from "react";
import DisplayPostItem from "@/components/DisplayPost/DisplayPostItem";
import Comment from "@/components/Comment";
import Hint from "@/components/Comment/Hint";
import CommentEditor from "@/components/Comment/CommentEditor";
import Header from "@/layout/Header";
import { useParams } from "react-router-dom";
import { useStore } from "@dataverse/hooks";
import { Wrapper } from "./styled";

export default function PostDetail() {
  const { streamId } = useParams();
  const { state } = useStore();

  return (
    <Wrapper>
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <div className="post">
          <DisplayPostItem
            streamRecord={state.streamsMap[streamId!]}
            streamId={streamId!}
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
