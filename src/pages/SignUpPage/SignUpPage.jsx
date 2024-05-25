import React, { useState, useEffect } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

import {
  CreateAccout,
  Hello,
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperSpanTextBlue,
  WrapperText,
  WrapperTextBlue,
  WrapperTextLight,
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

const SignUpPage = () => {
  const mutation = useMutationHooks((data) => UserService.SignUpUser(data));
  const { data, isPending, isSuccess } = mutation;
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success(data?.message);
      navigate("/sign-in");
    } else if (data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [data?.message, data?.status, isSuccess, navigate]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSigUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53",
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
          <Hello>Xin chào</Hello>
          <WrapperText>Đăng nhập và tạo tài khoản</WrapperText>
          <InputFormComponent
            style={{ marginTop: "25px", marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? (
                <EyeFilled style={{ fontSize: "15px", marginTop: "4px" }} />
              ) : (
                <EyeInvisibleFilled
                  style={{ fontSize: "15px", marginTop: "4px" }}
                />
              )}
            </span>
            <InputFormComponent
              style={{ marginBottom: "10px" }}
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? (
                <EyeFilled style={{ fontSize: "15px", marginTop: "4px" }} />
              ) : (
                <EyeInvisibleFilled
                  style={{ fontSize: "15px", marginTop: "4px" }}
                />
              )}
            </span>
            <InputFormComponent
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
            />
          </div>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            {data?.status === "ERR" && (
              <span
                style={{
                  marginTop: "10px",
                  fontSize: "15px",
                  color: "red",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                }}
              >
                {data?.message}
              </span>
            )}
          </div>

          <LoadingComponent isLoading={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSigUp}
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 20px",
              }}
              textButton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </LoadingComponent>

          <p>
            <CreateAccout> Bạn đã có tài khoản? </CreateAccout>
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
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
          ></Image>
          <WrapperTextBlue>Mua sắm tại Kaiser Shop</WrapperTextBlue>
          <WrapperSpanTextBlue>Siêu ưu đãi mỗi ngày</WrapperSpanTextBlue>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
