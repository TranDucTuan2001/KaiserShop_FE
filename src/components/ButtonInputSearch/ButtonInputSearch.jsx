import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgrondColorInput = "#fff",
    backgrondColorButton = "rgb(13,92,182)",
    colorButton = "#fff",
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        variant={bordered ? "default" : "borderless"}
        style={{ backgroundColor: backgrondColorInput, borderRadius: 0 }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgrondColorButton,
          border: !bordered && "none",
          borderRadius: 0,
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textbutton}
        styleTextButton={{ color: colorButton }}
      />
    </div>
  );
};

export default ButtonInputSearch;
