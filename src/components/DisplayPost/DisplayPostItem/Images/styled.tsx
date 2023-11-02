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

export const NftLockedInfo = styled.div`
  width: 100%;
  height: 100%;
  padding: 13px;
  display: flex;
  flex-direction: column;
  background: #00000066;
  border-radius: 10px;
  backdrop-filter: blur(4px);

  .locked-icon {
    padding: 7px 0 17px;
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 26px;
      height: 26px;
    }
  }

  .info-card {
    padding: 8px 15px;
    background: #ffffffb2;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-family: Lato-SemiBold;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      letter-spacing: 0px;
      text-align: center;
      color: #f33a2b;
    }
  }
`;
