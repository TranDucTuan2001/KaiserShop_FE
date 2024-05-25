import React, { useState, useEffect, useCallback } from "react";
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
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser as updateUserAction } from "../../redux/slides/userSlide"; // đổi tên để tránh xung đột tên

const SignInPage = () => {
  const location = useLocation();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess } = mutation;
  const navigate = useNavigate();
  const handleNavigateSigUp = () => {
    navigate("/sign-up");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleGetDetailUser = useCallback(
    async (id, token) => {
      const storage = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storage);
      const res = await UserService.getDetailsUser(id, token);
      dispatch(
        updateUserAction({
          ...res?.data,
          access_token: token,
          refreshToken: refreshToken,
        })
      );
    },
    [dispatch]
  );
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }

      message.success(data?.message);

      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );

      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
    } else if (data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [
    data?.access_token,
    data?.message,
    data?.refresh_token,
    data?.status,
    handleGetDetailUser,
    isSuccess,
    location?.state,
    navigate,
  ]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };
  const handleSigIn = () => {
    mutation.mutate({ email, password });
  };
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
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
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
              disabled={!email.length || !password.length}
              onClick={handleSigIn}
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 20px",
              }}
              textButton={"Đăng nhập"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </LoadingComponent>
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>{" "}
          </p>
          <p style={{ margin: 0 }}>
            <CreateAccout>Chưa có tài khoản?</CreateAccout>
            <WrapperTextLight onClick={handleNavigateSigUp}>
              Tạo tài khoản
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

export default SignInPage;
