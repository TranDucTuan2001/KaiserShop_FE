import styled from "styled-components";
import { Card } from "antd";
export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & .ant-card-cover > * {
    height: 200px;
    width: 200px;
  }
  position: relative;
  cursor: pointer;

  /* Lớp phủ màu xám khi disabled */
  &::before {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: -1px;
    left: -1px;
    width: 101%;
    height: 101%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
    display: ${(props) =>
      props.disabled ? "block" : "none"}; /* Điều chỉnh hiển thị của lớp phủ */
  }

  /* Dòng chữ "Hết hàng" màu đỏ */
  &::after {
    content: "Hết hàng";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: red;
    font-size: 18px;
    font-weight: bold;
    z-index: 2;
    display: ${(props) =>
      props.disabled ? "block" : "none"}; /* Điều chỉnh hiển thị của dòng chữ */
  }

  & .ant-card-cover > * {
    height: 200px;
    width: 200px;
  }
`;
export const WrapperImageStyle = styled.img`
  top: -1px;
  left: -1px;
  border-top-left-radius: 8px;
  position: absolute;
  height: 14px;
  width: 68px;
`;
export const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Số dòng tối đa */
  -webkit-box-orient: vertical;
  white-space: normal;
`;
export const WrapperReportText = styled.div`
  font-size: 11px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin: 6px 0 0;
  gap: 5px;
`;
export const WrapperPriceText = styled.div`
  font-size: 16px;
  color: rgb(255, 66, 78);
  font-weight: 500;
`;
export const WrapperDiscountText = styled.span`
  display: flex;
  padding: 0px 4px;
  align-items: flex-start;
  border-radius: 8px;
  background: var(--Alias-Theme-Variant, #f5f5fa);
  color: var(--Alias-Primary---On-Theme, #27272a);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  width: fit-content;
  height: fit-content;
`;
export const WrapperStyleTextSell = styled.span`
  color: rgb(120, 120, 120);
  font-size: 15px;
  line-height: 24px;
`;

export const WrapperPriceBefore = styled.span`
  color: var(--Alias-Secondary---On-Theme, #808089);
  font-family: Inter;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  text-decoration-line: line-through;
`;
