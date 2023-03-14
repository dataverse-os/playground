import styled, { keyframes } from "styled-components";

const padding = '0 7.25rem'
export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderWrapper = styled.nav`
  height: 52px;
  background-color: white;
  padding: ${padding};
  // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const BodyWrapper = styled.div`
  padding: ${padding};  
  display: flex;
  flex-flow: column wrap;
  margin-top: 3.35rem;
  // TODO: handle dynamic height;
  height: fit-content;
  align-items: center;
`;

export const PostWrapper = styled.aside`
  flex: 1;
  align-items: flex-start;
  display: flex;
  flex-flow: column wrap;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;
  align-content: flex-start;
  justify-content: flex-start;
  max-width: 92.5rem;
  width: 100%;
  margin: 0;
  &::before,
  ::after {
    content: "";
    flex-basis: 100%;
    width: 0;
    order: 1;
  }
`;

export const DisplayPostWrapper = styled.aside`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;
  padding: 40px;
  border-right: 1px solid #f0efee;
`;
