import React from "react";
import { Button } from "antd";
const ButtonComponent = ({
  size,
  styleButton,
  styleTextButton,
  textButton,
  disabled,
  ...rests
}) => {
  return (
    <Button
      size={size}
      style={{
        ...styleButton,
        background: disabled ? "#ccc" : styleButton.background,
        cursor:disabled ? "not-allowed" : "pointer"
      }}
      {...rests}
    >
      <span style={styleTextButton}> {textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
