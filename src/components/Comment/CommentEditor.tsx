import React, { useState } from "react";
import styled from "styled-components";

interface CommentEditorProps {
  onSubmit: (content: string) => void;
}

const EditorWrapper = styled.div`
  margin: 0.35rem;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 0 16px 16px;
  padding-bottom: 10px;
  /* max-width: calc(100% - 3.35rem); */
`;

const EditorForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const EditorTextarea = styled.textarea`
  resize: none;
  height: 60px;
  margin: 10px 0;
  border: 0px;
  font-size: 15px;
  font-family: Poppins;
`;

const EditorButton = styled.button`
  width: 120px;
  height: 32px;
  background-color: #007aff;
  color: white;
  font-size: 15px;
  font-family: Poppins-SemiBold;
  border-radius: 8px;
  border: 0px;
  margin-left: auto;
`;

const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(content);
    setContent("");
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  return (
    <EditorWrapper>
      <EditorForm onSubmit={handleSubmit}>
        <EditorTextarea
          value={content}
          onChange={handleContentChange}
          placeholder="Leave your comment here."
        />
        <EditorButton type="submit">Submit</EditorButton>
      </EditorForm>
    </EditorWrapper>
  );
};

export default CommentEditor;
