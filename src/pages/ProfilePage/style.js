import styled from "styled-components";
import { Upload } from "antd";

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 30px;
  background-color: #fff;
  box-shadow: 0 12px 12px #ccc;
`;

export const WrapperLabel = styled.label`
  color: #000;
  font-size: 12px;
  line-height: 30px;
  font-weight: 600;
  width: 80px;
  text-align: left;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list-item-container {
    display: none;
  }
`;

export const WrapperChangePassword = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin: 0px 0px 0px 6px;
  color: rgb(128, 128, 137);
  display:flex;
  align-items: center;
  gap:10px;
  padding:20px 20px 0px 20px;
`;
