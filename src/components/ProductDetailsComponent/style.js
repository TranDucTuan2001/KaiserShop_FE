import styled from "styled-components";
import { Col, InputNumber } from "antd";
export const WrapperStyleImageSmall = styled.img`
  height: 64px;
  width: 64px;
`;
export const WrapperStyleColImage = styled(Col)`
  cursor: pointer;
  border: ${(props) => (props.active ? "2px solid blue" : "none")};
  box-shadow: ${(props) =>
    props.active ? "0 0 10px rgba(0, 0, 255, 0.5)" : "none"};
  flex-basis: unset;
  display: flex;
`;
export const WrapperStyleNameProduct = styled.h1`
  margin-top: 0px;
  color: rgb(39, 39, 42);
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  word-break: break-word;
  white-space: break-spaces;
`;
export const WrapperStyleTextSell = styled.span`
  color: rgb(120, 120, 120);
  font-size: 15px;
  line-height: 24px;
`;
export const WrapperPriceProduct = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
`;
export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
`;
export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.change-address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
`;
export const WrapperQuantityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  width: 120px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const WrapperInputNmber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
    border-top: none;
    border-bottom: none;
    border-radius: 0;
  }
  &.ant-input-number .ant-input-number-handler-wrap .ant-input-number-handler {
    display: none !important;
  }
`;

export const WrapperDiscount = styled.div`
  border: 1px solid rgb(194, 255, 255);
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  padding: 0px 4px;
  background: rgb(240, 248, 255);
  border-radius: 8px;
  color: rgb(39, 39, 42);
  width: fit-content;
  height: fit-content;
`;
export const WrapperDescription = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  color: rgb(39, 39, 42);
`;
export const WrapperDescriptionText = styled.p`
  color: rgba(0, 0, 0, 0.8);
  font-size: 13px;
  line-height: 1.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  max-height: ${(props) => (props.isExpanded ? 'none' : '100px')}; 
  position: relative;

  &:after {
    font-size: 13px;
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${(props) => (props.isExpanded ? '0' : '40px')}; /* Điều chỉnh chiều cao của lớp mờ */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }
`;

export const WrapperDescriptionArea = styled.div`
  margin-top: 20px;
  border-top: 1px solid rgb(229, 229, 229);
`;
export const ShowMoreButton = styled.button`
background-color: transparent;
border: none;
color: rgb(11, 116, 229);
font-style: normal;
cursor: pointer;
`;
