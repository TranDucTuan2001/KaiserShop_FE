import React, { useState } from "react";
import {
  ProductOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Image, Menu } from "antd";
import { getItem } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUserComponent from "../../components/AdminUserComponent/AdminUserComponent";
import AdminProductComponent from "../../components/AdminProductComponent/AdminProductComponent";
import AdminOrderComponent from "../../components/AdminOrderComponent/AdminOrderComponent";
import GifHello from "../../assets/images/giphy.gif";
const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <ProductOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
    getItem("Cài đặt", "sub4", <SettingOutlined />),
  ];

  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUserComponent />;
      case "product":
        return <AdminProductComponent />;
      case "order":
        return <AdminOrderComponent />;
      default:
        return (
          <div
            style={{ height: "600px", display: "flex", alignItems: "center" }}
          >
            <Image src={GifHello} preview={false} alt="image-logo" />
            <h4 style={{ fontSize: "70px" }}>ADMIN DASHBOARD</h4>
          </div>
        );
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };
  return (
    <div>
      <HeaderComponent isHiddenSearch={true} isHiddenCard={true} />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
