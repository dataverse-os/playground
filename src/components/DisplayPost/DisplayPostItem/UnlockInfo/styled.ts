import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-items: center;
  .lock {
    width: 30px;
    margin-right: 5px;
    cursor: pointer;
  }
`;

export const DatatokenInfoWrapper = styled.div`
  text-align: center;
  .currency {
    margin-left: 5px;
  }

  .boughtNum,
  .collectLimit,
  .Sold {
    font-size: 14px;
  }
  .Sold {
    margin-left: 5px;
  }
`;
