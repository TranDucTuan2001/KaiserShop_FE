import React, { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

import { convertPrice } from "../../utils";
import { Image } from "antd";
import { WrapperInfo, WrapperItemOrder, WrapperMyItemOrder } from "./style";
import { WrapperContainer } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { WrapperFooterItem, WrapperListOrder } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MesageComponent/MesageComponent";
import { ExceptionOutlined } from "@ant-design/icons";

const MyOrderPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location;

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res;
  };
  const queyOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
  });

  const { isLoading, data } = queyOrder;

  const dataOrder = data?.data;
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        userId: state?.id,
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, userId, orderItems } = data;
    const res = OrderService.cancelsOrder(userId, id, token, orderItems);
    return res;
  });

  const handleCanceOrder = (order) => {
    mutation.mutate(
      {
        userId: state?.id,
        id: order?._id,
        token: state?.token,
        orderItems: order?.orderItems,
      },
      {
        onSuccess: () => {
          queyOrder.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status === "OK") {
      message.success(mutation.data?.message);
    } else if (mutation.isError || mutation.data?.status === "ERR") {
      message.error(mutation.data?.message);
    }
  }, [
    mutation.data?.message,
    mutation.data?.status,
    mutation.isError,
    mutation.isSuccess,
  ]);

  const renderProduct = (dataOrder) => {
    return dataOrder?.map((order) => {
      return (
        <WrapperItemOrder key={order?._id}>
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
              width: 350,
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
                (order?.price - (order?.price * order?.discount) / 100) *
                  order?.amount
              )}
            </span>
          </div>
        </WrapperItemOrder>
      );
    });
  };

  return (
    <LoadingComponent isLoading={isLoading || mutation.isPending}>
      <div style={{ background: "#efefef", width: "100%" }}>
        <WrapperContainer>
          <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
            <h2
              style={{ fontSize: "18px", marginTop: "0", paddingTop: "15px" }}
            >
              Đơn hàng của tôi
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "15px",
              }}
            >
              {dataOrder && dataOrder.length > 0 ? (
                <WrapperListOrder>
                  {dataOrder.map((order) => (
                    <WrapperMyItemOrder key={order?._id}>
                      <WrapperInfo>
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          Trạng thái
                        </span>
                        <div>
                          <span style={{ color: "rgb(255, 66, 78)" }}>
                            Giao hàng:{" "}
                          </span>
                          <span
                            style={{
                              color: "rgb(90, 32, 193)",
                              fontWeight: "bold",
                            }}
                          >
                            {order.isDelivered
                              ? "Đã giao hàng"
                              : "Chưa giao hàng"}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "rgb(255, 66, 78)" }}>
                            Thanh toán:{" "}
                          </span>
                          <span
                            style={{
                              color: "rgb(90, 32, 193)",
                              fontWeight: "bold",
                            }}
                          >
                            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                      </WrapperInfo>
                      <div>{renderProduct(order?.orderItems)}</div>
                      <WrapperFooterItem>
                        <div>
                          <span
                            style={{
                              color: "rgb(36, 36, 36)",
                              fontSize: "13px",
                            }}
                          >
                            Phí giao hàng:{" "}
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "rgb(255, 66, 78)",
                            }}
                          >
                            {convertPrice(order?.shippingPrice)}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{
                              color: "rgb(36, 36, 36)",
                              fontSize: "15px",
                              fontWeight: 700,
                            }}
                          >
                            Tổng tiền:{" "}
                          </span>
                          <span
                            style={{
                              fontSize: "15px",
                              color: "rgb(255, 66, 78)",
                              fontWeight: 700,
                            }}
                          >
                            {convertPrice(order?.totalPrice)}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <ButtonComponent
                            onClick={() => handleCanceOrder(order)}
                            size={40}
                            styleButton={{
                              height: "36px",
                              border: "1px solid #9255FD",
                              borderRadius: "4px",
                            }}
                            textButton={"Hủy đơn hàng"}
                            styleTextButton={{
                              color: "#9255FD",
                              fontSize: "14px",
                            }}
                          />
                          <ButtonComponent
                            onClick={() => handleDetailsOrder(order?._id)}
                            size={40}
                            styleButton={{
                              height: "36px",
                              border: "1px solid #9255FD",
                              borderRadius: "4px",
                            }}
                            textButton={"Xem chi tiết"}
                            styleTextButton={{
                              color: "#9255FD",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                      </WrapperFooterItem>
                    </WrapperMyItemOrder>
                  ))}
                </WrapperListOrder>
              ) : (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <h3 style={{ fontSize: "25px" }}>
                    <ExceptionOutlined />
                    Đơn hàng trống
                  </h3>
                </div>
              )}
            </div>
          </div>
        </WrapperContainer>
      </div>
    </LoadingComponent>
  );
};

export default MyOrderPage;
