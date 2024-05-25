import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  WrapperInfo,
  WrapperLeft,
  WrapperRight,
  WrapperTotal,
  Lable,
  WrapperRadio,
  WrapperInfoDown,
  WrapperLocation,
  WrapperAddress,
} from "./style";
import * as message from "../../components/MesageComponent/MesageComponent";
import { Form, Radio } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { updateUser as updateUserAction } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import { removeAllProduct as removeAllProductAction } from "../../redux/slides/orderSlide";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../../services/PaymentService";
import { WrapperTitle } from "../MyOrderPage/style";
import ship from "../../assets/images/ship.png";
import { EnvironmentOutlined } from "@ant-design/icons";
const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);

  const order = useSelector((state) => state?.order);
  const user = useSelector((state) => state?.user);

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [sdkReady, setSdkReady] = useState(false);
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
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });

      dispatch(removeAllProductAction({ listChecked: arrayOrdered }));
      message.success(mutationAddOrder.data?.message);
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
          deliveryPriceMemo: deliveryPriceMemo,
        },
      });
    } else if (
      mutationUpdate.isError ||
      mutationAddOrder.data?.status === "ERR"
    ) {
      message.error(mutationAddOrder.data?.message);
    }
  }, [mutationAddOrder.isSuccess, mutationAddOrder.isError]);

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
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
    if (delivery === "gojek" && priceMemo < 200000) {
      return 25000;
    } else if (
      delivery === "gojek" &&
      priceMemo >= 200000 &&
      priceMemo < 500000
    ) {
      return 15000;
    } else if (priceMemo >= 200000 && priceMemo < 500000) {
      return 20000;
    } else if (priceMemo >= 500000) {
      return 0;
    } else if (order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 30000;
    }
  }, [priceMemo, delivery, order?.orderItemsSelected?.length]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(deliveryPriceMemo);
  }, [priceMemo, deliveryPriceMemo]);

  const dolaPrice = (totalPriceMemo / 25000).toFixed(2);
  const handlePayment = (e) => {
    setPayment(e.target.value);
  };
  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        id: user?.id,
        access_token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        delivery: delivery,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
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
  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      id: user?.id,
      access_token: user?.access_token,
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      city: user?.city,
      phone: user?.phone,
      delivery: delivery,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details?.update_time,
      email: user?.email,
    });
  };

  return (
    <div style={{ background: "#efefef", with: "100%", height: "100vh" }}>
      <LoadingComponent isLoading={mutationAddOrder.isPending}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <WrapperTitle>Thanh toán</WrapperTitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}>
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        FAST
                      </span>{" "}
                      Giao hàng tiết kiệm
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <img src={ship} width={40} alt="Logo" />
                        <span>Giao hàng từ 3-5 ngày</span>
                      </div>
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GO_JEK
                      </span>{" "}
                      Giao hàng tiết kiệm
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <img src={ship} width={40} alt="Logo" />
                        <span>Giao hàng từ 5 ngày</span>
                      </div>
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfoDown>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">
                      Thanh toán tiền mặt khi nhận hàng
                    </Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfoDown>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <div>
                    <WrapperLocation>
                      {" "}
                      <EnvironmentOutlined /> Giao đến:{" "}
                    </WrapperLocation>
                    <WrapperAddress>{`${user?.address}, ${user?.city}`}</WrapperAddress>
                    <span
                      onClick={handleChangeAdress}
                      style={{
                        color: "rgb(10, 104, 255)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Thay đổi
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
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
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === "paypal" && sdkReady ? (
                <div style={{ width: "100%" }}>
                  <PayPalButton
                    amount={dolaPrice}
                    // amount="0.01"
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("err");
                    }}
                  />
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    background: "rgb(255, 57, 69)",
                    height: "48px",
                    width: "100%",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textButton={"Đặt hàng"}
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                ></ButtonComponent>
              )}
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
              // onFinish={onUpdateUser}
              autoComplete="off"
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[
                  { required: false, message: "Please input your Name!" },
                ]}
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
                rules={[
                  { required: false, message: "Please input your phone!" },
                ]}
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
      </LoadingComponent>
    </div>
  );
};

export default PaymentPage;
