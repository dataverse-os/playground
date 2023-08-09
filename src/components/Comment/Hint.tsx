import React from "react";
import styled from "styled-components";
import { FiMessageSquare } from "react-icons/fi";

interface HintProps {
  text: string;
}

const HintWrapper = styled.div`
  display: flex;
  margin: 0.35rem;
  flex-direction: row;
  align-items: center;
  color: gray;
`;

const HintIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const HintText = styled.div`
  font-size: 0.8em;
`;

const Hint: React.FC<HintProps> = ({ text }) => {
  return (
    <HintWrapper>
      <HintIcon>
        <FiMessageSquare />
      </HintIcon>
      <HintText>{text}</HintText>
    </HintWrapper>
  );
};

export default Hint;
