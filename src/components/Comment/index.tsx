import React from "react";

import { FaThumbsUp, FaShare, FaComment } from "react-icons/fa";
import styled from "styled-components";

interface CommentProps {
  author: string;
  content: string;
  avatar?: string;
  userId: string;
}

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border: 1px solid gray;
  padding: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const CommentContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const Author = styled.div`
  font-weight: bold;
  margin-right: 5px;
`;

const UserId = styled.div`
  font-size: 0.8em;
  color: gray;
`;

const Content = styled.div`
  white-space: pre-wrap;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

const Comment: React.FC<CommentProps> = ({
  author,
  content,
  avatar,
  userId,
}) => {
  return (
    <CommentWrapper>
      {avatar && <Avatar src={avatar} />}
      <CommentContentWrapper>
        <AuthorWrapper>
          <Author>{author}</Author>
          <UserId>{userId}</UserId>
        </AuthorWrapper>
        <Content>{content}</Content>
        <IconWrapper>
          <Icon>
            <FaThumbsUp />
          </Icon>
          <Icon>
            <FaShare />
          </Icon>
          <Icon>
            <FaComment />
          </Icon>
        </IconWrapper>
      </CommentContentWrapper>
    </CommentWrapper>
  );
};

export default Comment;
