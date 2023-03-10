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
  height: calc(100% - 3.35rem);
  display: flex;
  flex-direction: row;
  margin-top: 3.35rem;
`;

export const PublishPostWrapper = styled.aside`
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;
  justify-content: space-between;
  max-width: 100%;
  margin: 0;
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
