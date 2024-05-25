import styled from "styled-components";
import { Col, InputNumber } from "antd";
export const WrapperStyleImageSmall = styled.img`
  height: 64px;
  width: 64px;
`;
export const WrapperStyleColImage = styled(Col)`
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
