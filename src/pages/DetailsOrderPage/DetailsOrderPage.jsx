import React from "react";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import {
  NameProduct,
  WrapperAllPrice,
  WrapperAllPriceInfo,
  WrapperContainer,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfo,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";
import { Image } from "antd";
import { convertPrice } from "../../utils";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { orderContant } from "../../contant";
import { WrapperTitle } from "../MyOrderPage/style";

const DetailsOrderPage = () => {
  const params = useParams();
  const { id } = params;

  const location = useLocation();
  const { state } = location;

  const fetchDetaisOrder = async () => {
    const res = await OrderService.getDetailsOrder(
      state?.userId,
      id,
      state?.token
    );
    return res.data;
  };
  const queyOrder = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetaisOrder,
  });

  const { isLoading, data } = queyOrder;
  return (
    <div style={{ width: "100%", background: "#efefef" }}>
      <LoadingComponent isLoading={isLoading}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <WrapperTitle>Chi tiết đơn hàng</WrapperTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "15px",
            }}
          >
            <WrapperContainer>
              <WrapperInfo>
                <WrapperHeaderUser>
                  <WrapperInfoUser>
                    <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                    <WrapperContentInfo>
                      <div className="name-info">
                        {data?.shippingAddress?.fullName}
                      </div>
                      <div className="address-info">
                        <span>Địa chỉ: </span>{" "}
                        {data?.shippingAddress?.address ||
                        data?.shippingAddress?.city
                          ? `${data?.shippingAddress?.address} - ${data?.shippingAddress?.city}`
                          : "loading..."}
                      </div>
                      <div className="phone-info">
                        <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                      </div>
                    </WrapperContentInfo>
                  </WrapperInfoUser>
                  <WrapperInfoUser>
                    <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                    <WrapperContentInfo>
                      <div className="delivery-info">
                        <span className="name-delivery">
                          {" "}
                          {orderContant.delivery[data?.delivery]}
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </div>
                      <div className="delivery-fee">
                        <span>Phí giao hàng: </span>{" "}
                        {convertPrice(data?.shippingPrice ?? 0)}
                      </div>
                      <div className="status-payment">
                        {data?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}
                      </div>
                    </WrapperContentInfo>
                  </WrapperInfoUser>
                  <WrapperInfoUser>
                    <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                    <WrapperContentInfo>
                      <div className="payment-info">
                        {orderContant.payment[data?.paymentMethod]}
                      </div>
                      <div className="status-payment">
                        {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                      </div>
                    </WrapperContentInfo>
                  </WrapperInfoUser>
                </WrapperHeaderUser>
                <WrapperStyleContent>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ width: "670px", fontSize: "13px" }}>
                      Sản phẩm
                    </div>
                    <WrapperItemLabel>Đơn giá</WrapperItemLabel>
                    <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                    <WrapperItemLabel>Số lượng</WrapperItemLabel>
                    <WrapperItemLabel>Thành tiền</WrapperItemLabel>
                  </div>
                  {data?.orderItems?.map((order) => {
                    return (
                      <WrapperProduct>
                        <WrapperNameProduct>
                          <Image
                            src={order?.image}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              border: "1px solid rgb(238, 238, 238)",
                              padding: "2px",
                            }}
                          />
                          <NameProduct>{order?.name}</NameProduct>
                        </WrapperNameProduct>
                        <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                        <WrapperItem>{order?.discount}%</WrapperItem>
                        <WrapperItem>{order?.amount}</WrapperItem>
                        <WrapperItem>
                          {convertPrice(
                            (order?.price -
                              (order?.price * order?.discount) / 100) *
                              order?.amount
                          )}
                        </WrapperItem>
                      </WrapperProduct>
                    );
                  })}

                  <WrapperAllPriceInfo>
                    <WrapperAllPrice>
                      <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                      <WrapperItem>
                        {convertPrice(data?.itemsPrice ?? 0)}
                      </WrapperItem>
                    </WrapperAllPrice>
                    <WrapperAllPrice>
                      <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                      <WrapperItem>
                        {convertPrice(data?.shippingPrice ?? 0)}
                      </WrapperItem>
                    </WrapperAllPrice>
                    <WrapperAllPrice>
                      <WrapperItemLabel
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        Tổng cộng
                      </WrapperItemLabel>
                      <WrapperItem>
                        <WrapperItem style={{ fontSize: "15px" }}>
                          {convertPrice(data?.totalPrice ?? 0)}
                        </WrapperItem>
                      </WrapperItem>
                    </WrapperAllPrice>
                  </WrapperAllPriceInfo>
                </WrapperStyleContent>
              </WrapperInfo>
            </WrapperContainer>
            <div style={{ height: "600px" }}></div>
          </div>
        </div>
      </LoadingComponent>
    </div>
  );
};

export default DetailsOrderPage;
