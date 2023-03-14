import styled from "styled-components";

export const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
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

export const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 1.25rem;
`;

export const ImageGrid = styled.div`
  display: grid;
  width: 320px;
  height: 320px;
  justify-content: space-evenly;
  align-content: space-evenly;
  grid-template-columns: repeat(2, 150px);
  grid-template-rows: repeat(2, 150px);
  border: 1px solid red;
`
