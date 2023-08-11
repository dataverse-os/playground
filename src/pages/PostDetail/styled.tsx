import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .header {
    margin: 0 7.25rem;
    height: 52px;
  }

  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }

  .post {
    @media (max-width: 1200px) {
      width: 60vw;
    }
    @media (max-width: 768px) {
      width: 80vw;
    }
    width: 40vw;
    min-width: 540px;
  }
`;
