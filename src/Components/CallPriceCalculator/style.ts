import styled from "styled-components";

export const Container = styled.form`
  display: flex;
  margin-bottom: 2em;

  > * {
    margin-right: 1em;

    &:last-child {
      margin-right: 0;
    }
  }
`;
