import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperChangePassword,
  WrapperContentProfile,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";
import { useDispatch } from "react-redux";
import { updateUser as updateUserAction } from "../../redux/slides/userSlide"; // đổi tên để tránh xung đột tên
import { LockFilled, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { getBase64 } from "../../utils";
import { WrapperTitle } from "../MyOrderPage/style";

import ModalComponent from "../../components/ModalComponent/ModalComponent";
const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isOpenModalUpdatePassword, setIsOpenModalUpdatePassword] =
    useState(false);
  const [updateForm] = Form.useForm();
  const [statePassword, setStatePassword] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const mutationUpdatePassword = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await UserService.updateUserPassword(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutation = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      await UserService.updateUser(id, rests, access_token);
    } catch (error) {
      throw error;
    }
  });
  const dispatch = useDispatch();

  const handleGetDetailUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUserAction({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
    setCity(user?.city);
  }, [user]);

  useEffect(() => {
    if (mutation.isSuccess) {
      message.success();
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (mutation.isError) {
      message.error();
    }
  }, [
    mutation.isSuccess,
    mutation.isError,
    handleGetDetailUser,
    user?.id,
    user?.access_token,
  ]);

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangePhone = (value) => setPhone(value);
  const handleOnChangeAddress = (value) => setAddress(value);
  const handleOnChangeCity = (value) => setCity(value);
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      city,
      access_token: user?.access_token,
    });
  };

  const handleChangePassword = () => {
    setIsOpenModalUpdatePassword(true);
  };
  const ChangePassword = () => {
    // console.log("statePassword", statePassword);
    // alert("ok");
    const { password, newPassword, confirmPassword } = statePassword;
    if (password && newPassword && confirmPassword) {
      mutationUpdatePassword.mutate({
        id: user?.id,
        access_token: user?.access_token,
        ...statePassword,
      });
    }
  };
  const handleCancelUpdate = useCallback(() => {
    updateForm.resetFields();
    setStatePassword({
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsOpenModalUpdatePassword(false);
  }, [updateForm]);
  useEffect(() => {
    if (
      mutationUpdatePassword.isSuccess &&
      mutationUpdatePassword.data?.status === "OK"
    ) {
      message.success(mutationUpdatePassword.data?.message);
      handleCancelUpdate();
    } else if (
      mutationUpdatePassword.isError ||
      mutationUpdatePassword.data?.status === "ERR"
    ) {
      message.error(mutationUpdatePassword.data?.message);
    }
  }, [
    handleCancelUpdate,
    mutationUpdatePassword.data?.message,
    mutationUpdatePassword.data?.status,
    mutationUpdatePassword.isError,
    mutationUpdatePassword.isSuccess,
  ]);

  const handleOnchangePassword = (e) => {
    setStatePassword({
      ...statePassword,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ background: "#efefef", with: "100%", height: "630px" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <WrapperTitle>Thông tin người dùng</WrapperTitle>
        <LoadingComponent isLoading={mutation.isPending}>
          <WrapperContentProfile>
            <WrapperInput>
              <WrapperLabel htmlFor="name">Tên</WrapperLabel>
              <InputFormComponent
                style={{ width: "300px" }}
                id="name"
                value={name}
                onChange={handleOnChangeName}
              ></InputFormComponent>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor="email">Email</WrapperLabel>
              <InputFormComponent
                style={{ width: "300px" }}
                id="email"
                value={email}
                onChange={handleOnChangeEmail}
              ></InputFormComponent>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor="phone">SĐT</WrapperLabel>
              <InputFormComponent
                style={{ width: "300px" }}
                id="phone"
                value={phone}
                onChange={handleOnChangePhone}
              ></InputFormComponent>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
              <InputFormComponent
                style={{ width: "300px" }}
                id="address"
                value={address}
                onChange={handleOnChangeAddress}
              ></InputFormComponent>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor="city">Thành phố</WrapperLabel>
              <InputFormComponent
                style={{ width: "300px" }}
                id="city"
                value={city}
                onChange={handleOnChangeCity}
              ></InputFormComponent>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select file</Button>
              </WrapperUploadFile>
              {avatar && (
                <img
                  src={avatar}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              )}
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{
                  height: "30px",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "2px 6px 6px",
                }}
                textButton={"Cập nhật"}
                styleTextButton={{
                  color: "rgb(26,148,255)",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperInput>
            <div style={{ borderTop: "1px solid rgb(229, 229, 229)" }}>
              <WrapperChangePassword>
                <div style={{ display: "flex", gap: "5px" }}>
                  <LockFilled /> <div>Đổi mật khẩu</div>
                </div>
                <ButtonComponent
                  onClick={handleChangePassword}
                  size={40}
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    borderRadius: "4px",
                    padding: "2px 6px 6px",
                  }}
                  textButton={"Cập nhật"}
                  styleTextButton={{
                    color: "rgb(26,148,255)",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                ></ButtonComponent>
              </WrapperChangePassword>
            </div>
          </WrapperContentProfile>
        </LoadingComponent>
      </div>
      <ModalComponent
        title="Cập nhật mật khẩu"
        open={isOpenModalUpdatePassword}
        okText=""
        onCancel={handleCancelUpdate}
        onOk={ChangePassword}
      >
        <LoadingComponent isLoading={mutationUpdatePassword.isPending}>
          <Form
            form={updateForm}
            name="updateForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, marginTop: "20px" }}
            initialValues={{ remember: false }}
            autoComplete="off"
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại!",
                },
              ]}
            >
              <Input.Password
                value={statePassword?.password}
                onChange={handleOnchangePassword}
                name="password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới!",
                },
              ]}
            >
              <Input.Password
                value={statePassword?.newPassword}
                onChange={handleOnchangePassword}
                name="newPassword"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận lại mật khẩu"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận lại mật khẩu!",
                },
              ]}
            >
              <Input.Password
                value={statePassword?.confirmPassword}
                onChange={handleOnchangePassword}
                name="confirmPassword"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            ></Form.Item>
          </Form>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default ProfilePage;
