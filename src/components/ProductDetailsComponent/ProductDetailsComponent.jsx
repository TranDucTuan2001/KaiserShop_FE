import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Image, Form } from "antd";

import { useDispatch } from "react-redux";
import { addOrderProduct as addOrderProductAction } from "../../redux/slides/orderSlide"; // đổi tên để tránh xung đột tên
import HotDeal from "../../assets/images/hot.png";
import Genuine from "../../assets/images/yes.png";
import Change from "../../assets/images/back.png";
// import ImageProductSmall from "../../assets/images/testimg.jpg";
import {
  WrapperAddressProduct,
  WrapperDiscount,
  WrapperInputNmber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import {
  PlusOutlined,
  MinusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Rate } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { convertPrice, initFacebookSDK } from "../../utils";
import * as message from "../../components/MesageComponent/MesageComponent";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { updateUser as updateUserAction } from "../../redux/slides/userSlide";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperAddress, WrapperLocation } from "../../pages/PaymentPage/style";
import { WrapperChange } from "../../pages/OrderPage/style";

const ProductDetailsComponent = ({ idProduct }) => {
  
  const location = useLocation();
  const dispatch = useDispatch();
  const [updateForm] = Form.useForm();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const user = useSelector((state) => state?.user);
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
  const handleChangeAdress = () => {
    setIsOpenModalUpdateInfo(true);
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

  const navigate = useNavigate();
  const order = useSelector((state) => state?.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [numProduct, setNumProduct] = useState(1);

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited && !errorLimitOrder) {
        setNumProduct(numProduct + 1);
      } else {
        message.error("Vượt quá số lượng sản phẩm này trong kho !");
      }
    } else {
      if (numProduct > 1) {
        setNumProduct(numProduct - 1);
      }
    }
  };
  useEffect(() => {
    initFacebookSDK();
  });
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];

    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isPending, data: productDetais } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  const orderRedux = order?.orderItems?.find(
    (item) => item.product === productDetais?._id
  );
  useEffect(() => {
    if (productDetais?.countInStock === 0) {
      setOutOfStock(true);
    }
  }, [orderRedux, productDetais?.countInStock]);
  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetais?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
      !orderRedux
    ) {
      setErrorLimitOrder(false);
    } else {
      setErrorLimitOrder(true);
    }
  }, [numProduct, order?.orderItems, productDetais?._id]);
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetais?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
        (!orderRedux && productDetais?.countInStock > 0)
      ) {
        dispatch(
          addOrderProductAction({
            orderItem: {
              name: productDetais?.name,
              amount: numProduct,
              image: productDetais?.image,
              price: productDetais?.price,
              product: productDetais?._id,
              discount: productDetais?.discount,
              countInStock: productDetais?.countInStock,
            },
          })
        );
        message.success("Đã thêm vào giỏ hàng");
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const smallImages = [productDetais?.image,productDetais?.image1,productDetais?.image2,productDetais?.image3].filter(Boolean);;
  useEffect(() => {
    if (productDetais?.image) {
      setSelectedImage(productDetais?.image);
    }
  }, [productDetais]);
  const handleImageClick = (src, index) => {
    setSelectedImage(src);
    setActiveIndex(index);
  };

  return (
    <LoadingComponent isLoading={isPending}>
      <Row
        style={{
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={selectedImage}
            alt="image product"
            preview={false}
          />
             <Row style={{ paddingTop: "10px", display: 'flex', gap: '10px' }}>
        {smallImages.map((image, index) => (
          <WrapperStyleColImage
            key={index}
            span={4}
            active={index === activeIndex ? 'true' : undefined}

            onClick={() => handleImageClick(image, index)}
          >
            <WrapperStyleImageSmall
              src={image}
              alt={`image small ${index + 1}`}
            />
          </WrapperStyleColImage>
        ))}
      </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <img
              style={{ height: "23px", margin: "0", opacity: "1" }}
              src={Genuine}
              alt="Description"
            />
            <img
              style={{ height: "23px", margin: "0", opacity: "1" }}
              src={Change}
              alt="Description"
            />
          </div>
          <WrapperStyleNameProduct>
            {productDetais?.name}
          </WrapperStyleNameProduct>
          <div>
            <span style={{ fontSize: "16px" }}>{productDetais?.rating} </span>
            <Rate
              style={{ fontSize: "15px" }}
              allowHalf
              disabled
              value={productDetais?.rating}
            />
            <WrapperStyleTextSell>
              {" "}
              | Đã bán {productDetais?.selled}
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetais?.price ?? 0)}
            </WrapperPriceTextProduct>
            {productDetais?.discount !== 0 && (
              <WrapperDiscount>{`-${
                productDetais?.discount ?? 0
              }%`}</WrapperDiscount>
            )}
            <img
              style={{ height: "25px", margin: "10px", opacity: "1" }}
              src={HotDeal}
              alt="Description"
            />
          </WrapperPriceProduct>
          
            <WrapperAddressProduct>
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
            </WrapperAddressProduct>
       

          <LikeButtonComponent
            dataHref={
              process.env.REACT_APP_IS_LOCAL === "true"
                ? "https://developers.facebook.com/docs/plugins/"
                : window.location.href
            }
          ></LikeButtonComponent>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQuantityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => !outOfStock && handleChangeCount("decrease")}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>

              <WrapperInputNmber
                onChange={onChange}
                value={numProduct}
                defaultValue={1}
                max={productDetais?.countInStock}
                min={1}
                size="small"
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  !outOfStock &&
                  handleChangeCount(
                    "increase",
                    numProduct === productDetais?.countInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQuantityProduct>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div>
              <ButtonComponent
                size={40}
                disabled={outOfStock || errorLimitOrder}
                styleButton={{
                  background: "rgb(255,57,69)",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                  pointerEvents:
                    outOfStock || errorLimitOrder ? "none" : "auto",
                }}
                onClick={handleAddOrderProduct}
                textButton={"Chọn mua"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
              {outOfStock && (
                <div style={{ color: "red" }}>Sản phẩm này đã hết hàng !</div>
              )}
              {errorLimitOrder && (
                <div style={{ color: "red" }}>Không đủ hàng !</div>
              )}
            </div>
            <div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "#fff",
                  height: "48px",
                  width: "220px",
                  border: "1px solid rgb(13,92,182)",
                  borderRadius: "4px",
                }}
                textButton={"Mua trả sau"}
                styleTextButton={{ color: "rgb(13,92,182)", fontSize: "15px" }}
              ></ButtonComponent>
            </div>
          </div>
        </Col>
        <CommentComponent
          dataHref={
            process.env.REACT_APP_IS_LOCAL === "true"
              ? "https://developers.facebook.com/docs/plugins/comments#configurator"
              : window.location.href
          }
          width="1270"
        />
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
      </Row>
    </LoadingComponent>
  );
};

export default ProductDetailsComponent;
