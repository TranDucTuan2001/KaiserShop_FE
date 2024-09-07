import React from "react";
// import logoShop from "../../assets/images/slime.gif";
// import animate from "../../assets/images/dragon.webp";
import { useNavigate } from "react-router-dom";
// import { Image } from "antd";
import { WrapperTextHeader } from "./style";

const LogoComponent = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      {/* <Image src={logoShop} preview={false} width={30} alt="image-logo" /> */}
     
      <WrapperTextHeader>KAISERSHOP.COM</WrapperTextHeader>
      
      {/* <WrapperAnimateStyle src={animate} /> */}
    </div>
  );
};

export default LogoComponent;
