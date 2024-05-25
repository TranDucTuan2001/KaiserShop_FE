import styled from "styled-components";
import { Input } from "antd";
export const WrapperInputStyle = styled(Input)`
  border-radius: 0;
  border-top: none;
  border-right: none;
  border-left: none;
  outline: none;
  &:focus {
    background-color: rgb(232, 240, 254);
  }
`;
