import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;
`;

export const WrapperContainerRight = styled.div`
  width: 300px;
  background: linear-gradient(
    136deg,
    rgb(240, 248, 255) -1%,
    rgb(219, 238, 255) 85%
  );
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const WrapperText = styled.h1`
  color: rgb(56, 56, 61);
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 10px;
`;

export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: rgb(26, 148, 255);
  }
`;

export const WrapperTextBlue = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  font-weight: 500;
`;

export const WrapperSpanTextBlue = styled.span`
  color: rgb(120, 120, 120);
  font-size: 13px;
`; 