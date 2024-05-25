import React, { useEffect } from "react";
import {
  WrapperInfo,
  WrapperContainer,
  Lable,
  WrapperValue,
  WrapperItemOrder,
} from "./style";
import * as message from "../../components/MesageComponent/MesageComponent";
import { Image } from "antd";
import { convertPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";

const OrderSuccessPage = () => {
  const location = useLocation();
  const { state } = location;

  const mutationAddOrder = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await OrderService.createOrder(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });
  useEffect(() => {
    if (mutationAddOrder.isSuccess && mutationAddOrder.data?.status === "OK") {
      message.success(mutationAddOrder.data?.message);
    } else if (
      mutationAddOrder.isError ||
      mutationAddOrder.data?.status === "ERR"
    ) {
      message.error(mutationAddOrder.data?.message);
    }
  }, [
    mutationAddOrder.isSuccess,
    mutationAddOrder.isError,
    mutationAddOrder.data?.status,
    mutationAddOrder.data?.message,
  ]);

  return (
    <div style={{ background: "#efefef", width: "100%" }}>
      <LoadingComponent isLoading={mutationAddOrder.isPending}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "18px", marginTop: "0", paddingTop: "15px" }}>
            Đơn đặt hàng thành công
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "15px",
            }}
          >
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức giao hàng</Lable>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state?.delivery]}
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                {state?.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div
                        style={{
                          width: "390px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Image
                          preview={false}
                          src={order?.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />

                        <div
                          style={{
                            fontSize: "13px",
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#242424",
                          width: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Đơn giá: {`${convertPrice(order?.price)}`}</span>

                        {order?.discount !== 0 && (
                          <span
                            style={{ color: "red" }}
                          >{` (-${order?.discount})%`}</span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#242424",
                          width: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Số lượng: x{`${order?.amount}`}</span>
                      </div>

                      <div
                        style={{
                          width: 165,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ color: "#242424", fontSize: "13px" }}>
                          Thành tiền:{" "}
                        </span>
                        <span
                          style={{
                            color: "rgb(255, 66, 78)",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {convertPrice(
                            (order?.price -
                              (order?.price * order?.discount) / 100) *
                              order?.amount
                          )}
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <span style={{ fontSize: "13px" }}>
                    Phí giao hàng:{" "}
                    {state?.deliveryPriceMemo
                      ? convertPrice(state?.deliveryPriceMemo)
                      : 0}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "red",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    Tổng tiền:{" "}
                    {state?.totalPriceMemo
                      ? convertPrice(state.totalPriceMemo)
                      : 0}
                  </span>
                </div>
              </WrapperInfo>
            </WrapperContainer>
          </div>
        </div>
      </LoadingComponent>
    </div>
  );
};

export default OrderSuccessPage;
