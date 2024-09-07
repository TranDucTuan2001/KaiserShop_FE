import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  width: 80%;
  padding: 10px 0;
  background-color: rgb(26, 148, 255);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  height: 70px;
`;
export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
`;
export const WrapperLogo = styled.div`
  width: fit-content;
  border: 2px solid #fff;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
`;
export const WrapperHeaderAccout = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`;
export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
`;
export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    color: rgb(26, 148, 255);
  }
`;
export const WrapperAnimateStyle = styled.img`
  bottom: -22px;
  left: -69px;
  position: absolute;
  height: 79px;
`;


