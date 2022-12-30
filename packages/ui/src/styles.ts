import { css } from '@emotion/react';

export const globalStyles = css`
  html,
  body,
  #root {
    height: 100%;
  }

  ::selection {
    background-color: rgba(79, 170, 245, 0.3);
  }

  .MuiDialog-root {
    .MuiDialog-container {
      align-items: flex-start;

      .MuiPaper-root {
        margin-top: 64px;
      }
    }
  }
`;
