import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
  WrapperTotal,
  WrapperInputNumber,
  WrapperBody,
  WrapperTextPrice,
  WrapperChange,
  WrapperTextShip,
} from "./style";
import {
  DeleteOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as message from "../../components/MesageComponent/MesageComponent";

import { Image, Form } from "antd";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { increaseAmount as increaseAmountAction } from "../../redux/slides/orderSlide";
import { decreaseAmount as decreaseAmountAction } from "../../redux/slides/orderSlide";
import { removeOrderProduct as removeOrderProductAction } from "../../redux/slides/orderSlide";
import { removeAllProduct as removeAllProductAction } from "../../redux/slides/orderSlide";
import { selectedOrder as selectedOrderAction } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";

import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { updateUser as updateUserAction } from "../../redux/slides/userSlide";
import { useLocation, useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import { WrapperTitle } from "../MyOrderPage/style";
import { WrapperAddress, WrapperLocation } from "../PaymentPage/style";
import ship from "../../assets/images/ship.png";
const OrderPage = () => {
  const navigate = useNavigate();

  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const order = useSelector((state) => state?.order);

  const user = useSelector((state) => state?.user);
  const location = useLocation();
  const [updateForm] = Form.useForm();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const mutationUpdate = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await UserService.updateUser(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCount = (type, idProduct, limited, count) => {
    if (type === "increase") {
      if (limited) {
        message.error(`Số lượng trong kho chỉ còn: ${count}`);
      } else {
        dispatch(increaseAmountAction({ idProduct }));
      }
    } else {
      dispatch(decreaseAmountAction({ idProduct }));
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProductAction({ idProduct }));
  };
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllProductAction({ listChecked }));
    }
  };
  const handleGetDetailUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUserAction({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );
  useEffect(() => {
    if (mutationUpdate.isSuccess) {
      message.success();
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (mutationUpdate.isError) {
      message.error();
    }
  }, [
    mutationUpdate.isSuccess,
    mutationUpdate.isError,
    handleGetDetailUser,
    user?.id,
    user?.access_token,
  ]);

  useEffect(() => {
    dispatch(selectedOrderAction({ listChecked }));
  }, [dispatch, listChecked]);

  useEffect(() => {
    updateForm.setFieldValue(stateUserDetails);
  }, [updateForm, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
      updateForm.setFieldsValue({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
      });
    }
  }, [isOpenModalUpdateInfo, updateForm, user]);

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return (
        total + (cur?.price - (cur?.price * cur?.discount) / 100) * cur?.amount
      );
    }, 0);
    return result;
  }, [order]);

  const handleChangeAdress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 20000;
    } else if (priceMemo >= 500000) {
      return 0;
    } else if (order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 30000;
    }
  }, [priceMemo, order?.orderItemsSelected?.length]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(deliveryPriceMemo);
  }, [priceMemo, deliveryPriceMemo]);

  const handleAddCart = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm !");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };
  const handleCancelUpdate = () => {
    updateForm.resetFields();
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          access_token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const itemsDelivery = [
    {
      title: "30.000 VND",
      description: "Đơn hàng dưới 200.000 VND",
    },
    {
      title: "20.000 VND",
      description: "Đơn hàng từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "0 VND",
      description: "Đơn hàng trên 500.000 VND",
    },
  ];

  return (
    <div style={{ background: "#efefef", with: "100%" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <WrapperTitle>Giỏ hàng</WrapperTitle>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeaderDilivery>
              <div
                style={{ display: "flex", alignItems: "center"}}
              >
                <WrapperTextShip>Phí giao hàng</WrapperTextShip>
                <img src={ship} width={40} alt="Logo" />
              </div>

              <StepComponent
                items={itemsDelivery}
                current={
                  deliveryPriceMemo === 20000
                    ? 2
                    : deliveryPriceMemo === 30000
                    ? 1
                    : order?.orderItemsSelected?.length === 0
                    ? 0
                    : 3
                }
              ></StepComponent>
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></CustomCheckbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CustomCheckbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></CustomCheckbox>
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
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#242424",
                        width: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${convertPrice(order?.price)}`}{" "}
                      {order?.discount !== 0 && (
                        <span
                          style={{ color: "red" }}
                        >{` (-${order?.discount})%`}</span>
                      )}
                    </div>
                    <div
                      style={{
                        width: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (order?.amount > 1) {
                              handleChangeCount("decrease", order?.product);
                            }
                          }}
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          min={1}
                          max={order?.countInStock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order?.countInStock,
                              order?.countInStock
                            )
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                    </div>
                    <div
                      style={{
                        width: 165,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
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

                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteOrder(order?.product)}
                    />
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div>
                  <WrapperLocation>
                    {" "}
                    <EnvironmentOutlined /> Giao đến:{" "}
                  </WrapperLocation>
                  {user?.address && (
                    <WrapperAddress>{`${user?.address}, ${user?.city}`}</WrapperAddress>
                  )}
                  {user?.address ? (
                    <WrapperChange onClick={handleChangeAdress}>
                      Thay đổi
                    </WrapperChange>
                  ) : (
                    <WrapperChange onClick={handleChangeAdress}>
                      Cập nhật
                    </WrapperChange>
                  )}
                </div>
              </WrapperInfo>
              <WrapperBody>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(deliveryPriceMemo)}
                  </span>
                </div>
              </WrapperBody>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {totalPriceMemo === 0 ? (
                      <WrapperTextPrice>
                        Vui lòng chọn sản phẩm
                      </WrapperTextPrice>
                    ) : (
                      convertPrice(totalPriceMemo)
                    )}
                  </div>
                  <div style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </div>
                </div>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCart()}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Mua hàng"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
            <div style={{ height: "300px" }}></div>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        okText=""
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <LoadingComponent isLoading={mutationUpdate.isPending}>
          <Form
            form={updateForm}
            name="updateProductForm"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            initialValues={stateUserDetails}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: false, message: "Please input your Name!" }]}
            >
              <InputComponent
                value={stateUserDetails?.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="SĐT"
              name="phone"
              rules={[{ required: false, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUserDetails?.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: false,
                  message: "Please input your address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[
                {
                  required: false,
                  message: "Please input your city!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.city}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
          </Form>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
