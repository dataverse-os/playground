import React from "react";

import { NotFoundWrapper } from "./styled";

export default function NotFound() {
  return (
    <NotFoundWrapper>
      <div className='error-code'>404</div>
      <div className='error-message'>Page not found</div>
    </NotFoundWrapper>
  );
}
