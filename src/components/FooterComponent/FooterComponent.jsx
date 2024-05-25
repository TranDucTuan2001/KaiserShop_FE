import React from "react";
import {
  WrapperDown,
  WrapperItem,
  WrapperText,
  WrapperTextBody,
  WrapperUp,
} from "./style";
import LogoComponent from "../LogoComponent/LogoComponent";
import { Button } from "antd";
import {
  FacebookFilled,
  GithubFilled,
  TikTokFilled,
  WeiboCircleFilled,
} from "@ant-design/icons";
import card from "../../assets/images/card.png";
import card1 from "../../assets/images/card1.png";
import card2 from "../../assets/images/card2.png";
import { Footer } from "antd/es/layout/layout";

const FooterComponent = () => {
  return (
    <Footer>
      <WrapperUp>
        <WrapperItem>
          <LogoComponent />
          <div
            style={{
              color: "rgb(128, 128, 137)",
              fontSize: "16px",
              marginBottom: "30px",
              lineHeight: "1.5",
            }}
          >
            Với hàng triệu sản phẩm từ các thương hiệu uy tín và dịch vụ giao
            hàng siêu tốc FAST, KaiserShop mang đến trải nghiệm mua sắm online
            tuyệt vời.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="https://www.facebook.com/profile.php?id=100025992548168">
              <Button shape="circle" icon={<FacebookFilled />} />
            </a>
            <a href="https://github.com/TranDucTuan2001">
              <Button shape="circle" icon={<GithubFilled />} />
            </a>

            <a href="https://weibo.com/u/7458481921">
              <Button shape="circle" icon={<WeiboCircleFilled />} />
            </a>
            <a href="https://www.tiktok.com/@kaiser_tuan">
              <Button shape="circle" icon={<TikTokFilled />} />
            </a>
          </div>
        </WrapperItem>
        <WrapperItem>
          <WrapperText>Về KaiserShop</WrapperText>
          <WrapperTextBody>Giới thiệu KaiserShop</WrapperTextBody>
          <WrapperTextBody>KaiserShop Blog</WrapperTextBody>
          <WrapperTextBody>Chính sách bảo mật thanh toán</WrapperTextBody>
          <WrapperTextBody>
            Chính sách bảo mật thông tin cá nhân
          </WrapperTextBody>
          <WrapperTextBody>Chính sách giải quyết khiếu nại</WrapperTextBody>
          <WrapperTextBody>Điều khoản sử dụng</WrapperTextBody>
          <WrapperTextBody>Điều kiện vận chuyển</WrapperTextBody>
        </WrapperItem>
        <WrapperItem>
          <WrapperText>Hỗ trợ khách hàng</WrapperText>
          <WrapperTextBody>Các câu hỏi thường gặp</WrapperTextBody>
          <WrapperTextBody>Gửi yêu cầu hỗ trợ</WrapperTextBody>
          <WrapperTextBody>Hướng dẫn đặt hàng</WrapperTextBody>
          <WrapperTextBody>Phương thức vận chuyển</WrapperTextBody>
          <WrapperTextBody>Chính sách đổi trả</WrapperTextBody>
          <WrapperTextBody>Email: tranductuan291018@gmail.com</WrapperTextBody>
        </WrapperItem>
        <WrapperItem>
          <WrapperText>Phương thức thanh toán</WrapperText>
          <div style={{ display: "flex", gap: "10px" }}>
            <img src={card} width={40} alt="Logo" />
            <img src={card1} width={40} alt="Logo" />
            <img src={card2} width={40} alt="Logo" />
          </div>
        </WrapperItem>
      </WrapperUp>
      <WrapperDown>
        <div style={{ textAlign: "center" }}>
          © Copyright 2024, All Rights Reserved by KaiserTuan
        </div>
      </WrapperDown>
    </Footer>
  );
};

export default FooterComponent;
