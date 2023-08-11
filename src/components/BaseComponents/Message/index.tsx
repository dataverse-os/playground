import React from "react";

import { Message } from "@arco-design/web-react";
import { IconArrowRight } from "@arco-design/web-react/icon";

export function installDataverseMessage() {
  Message.info({
    content: (
      <>
        Please install Dataverse Extension.
        <a
          href={`${process.env.DATAVERSE_GOOGLE_STORE}`}
          target='_blank'
          style={{ marginLeft: "5px", color: "black" }}
          rel='noreferrer'
        >
          <span style={{ textDecoration: "underline" }}>
            Download from Google Store.
          </span>
          <IconArrowRight
            style={{
              color: "black",
              transform: "rotate(-45deg)",
            }}
          />
        </a>
      </>
    ),
  });
}
