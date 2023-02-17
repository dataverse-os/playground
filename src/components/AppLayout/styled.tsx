import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderWrapper = styled.nav`
  height: 52px;
  padding: 0 10px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`;

export const BodyWrapper = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: row;
`;

export const PublishPostWrapper = styled.aside`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;
  padding: 40px;
  border-right: 1px solid #f0efee;
  box-shadow: 1px 2px 12px rgba(40, 54, 61, 0.08);
`;

export const DisplayPostWrapper = styled.aside`
  position: relative;
  flex: 1;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;
  padding: 40px;
  border-right: 1px solid #f0efee;
  box-shadow: 1px 2px 12px rgba(40, 54, 61, 0.08);
`;
