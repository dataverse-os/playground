import styled from "styled-components";

export const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* cursor: pointer; */
`;

export const Secret = styled.div`
  width: 60px;
  height: 60px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 30px;
`;

export const Image = styled.img<{ imgCount: number }>`
  width: ${props => 100 / props.imgCount}%;
  max-height: 20rem;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem;
`;

export const ImageWrapperGrid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  align-content: space-evenly;
  gap: 0.75rem;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
  cursor: pointer;
`;
