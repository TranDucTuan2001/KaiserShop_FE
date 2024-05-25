import styled from "styled-components";

export const WrapperUp = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-bottom: 40px;
`;
export const WrapperDown = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  border-top: 1px solid rgb(229, 229, 229);
  padding-top: 25px;
`;
export const WrapperItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
`;
export const WrapperText = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: rgb(56, 56, 61);
  margin-bottom: 12px;
  margin-top: 0px;
`;

export const WrapperTextBody = styled.div`
  cursor: pointer;
  color: rgb(128, 128, 137);
  &:hover {
    color: blue;
  }
  padding: 5px 0px;
`;
