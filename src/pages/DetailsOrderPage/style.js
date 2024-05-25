import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WrapperInfoUser = styled.div`
  .name-info {
    margin-top: 8px;
    font-size: 13px;
    color: rgb(36, 36, 36);
    font-weight: bold;
    text-transform: uppercase;
  }
  .address-info,
  .phone-info,
  .delivery-info,
  .delivery-fee,
  .payment-info {
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    margin-top: 8px;
  }
  .name-delivery {
    color: rgb(234, 133, 0);
    font-weight: bold;
    text-transform: uppercase;
  }
  .status-payment {
    font-size: 13px;
    margin-top: 8px;
    color: rgb(234, 133, 0);
    font-weight: bold;
  }
`;
export const WrapperContainer = styled.div`
  width: 100%;
`;
export const WrapperLabel = styled.div`
  color: rgb(36, 36, 36);
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 15px;
`;
export const WrapperContentInfo = styled.div`
  height: 80px;
  width: 300px;

  padding: 10px;

  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 255, 255);

  border-radius: 6px;
`;

export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: flex-start;
  width: 670px;
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-size: 13px;
  font-weight: bold;
  &:last-child {
    color: red;
  }
`;
export const WrapperItemLabel = styled.div`
  width: 200px;
  font-size: 13px;
  &:last-child {
    font-weight: bold;
  }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
`;
export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-radius: 6px;
`;

export const NameProduct = styled.div`
  width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px;
  height: 70px;
  font-size: 13px;
`;
export const WrapperAllPriceInfo = styled.div`
  border-top: 1px solid rgb(229, 229, 229);
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
