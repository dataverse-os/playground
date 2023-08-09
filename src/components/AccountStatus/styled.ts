import styled, { FlattenSimpleInterpolation } from "styled-components";

export const Wrapper = styled.div<{ cssStyles?: FlattenSimpleInterpolation }>`
  display: flex;
  justify-items: center;
  width: 100%;
  height: 2rem;
  ${props => props.cssStyles}
`;

export const Avatar = styled.img`
  height: 1.85rem;
  width: 1.85rem;
`;

export const Name = styled.div`
  font-family: Poppins-SemiBold;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.85rem;
  margin-left: 0.57rem;
  color: #000000;
`;
