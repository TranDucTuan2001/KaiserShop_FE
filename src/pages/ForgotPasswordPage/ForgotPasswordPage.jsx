import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
  WrapperTextLight,
  WrapperTextBlue,
  WrapperSpanTextBlue,
} from "./style";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogin from "../../assets/images/logo-login.png";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.forgotPassword(data));
  const { data, isPending, isSuccess } = mutation;

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleForgotPassword = () => {
    mutation.mutate({ email });
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success(data?.message);
    } else if (data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [data?.message, data?.status, isSuccess]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <WrapperText>Quên mật khẩu</WrapperText>
          <WrapperTextLight style={{ marginBottom: "20px" }}>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </WrapperTextLight>
          <InputFormComponent
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          <LoadingComponent isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length}
              onClick={handleForgotPassword}
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 20px",
              }}
              textButton={"Gửi liên kết đặt lại mật khẩu"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
          </LoadingComponent>
          <p style={{ margin: 0 }}>
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Quay lại đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogin}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <WrapperTextBlue>Mua sắm tại Kaiser Shop</WrapperTextBlue>
          <WrapperSpanTextBlue>Siêu ưu đãi mỗi ngày</WrapperSpanTextBlue>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
