import { css } from '@emotion/react';

export const globalStyles = css`
  html,
  body,
  #root {
    height: 100%;
    display: flow-root;
  }

  ::selection {
    background-color: rgba(79, 170, 245, 0.3);
  }

  .MuiDialog-root {
    .MuiDialog-container {
      align-items: flex-start;

      @media (min-width: 600px) {
        .MuiPaper-root {
          margin-top: 64px;
        }
      }
    }
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
  }
`;
