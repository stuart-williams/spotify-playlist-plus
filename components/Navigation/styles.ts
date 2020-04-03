import css from "styled-jsx/css";

export default css`
  .Navigation,
  .Navigation :global(.bp3-tabs),
  .Navigation :global(.bp3-tab-panel) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .Navigation :global(.bp3-tab-panel) {
    overflow: hidden;
    margin: 0;
  }

  .Navigation :global(.bp3-tab-list) {
    padding: 10px;
  }
`;
