import React, { forwardRef } from "react";
import { Input } from "antd";

const InputComponent = forwardRef(({ size, placeholder, bordered, style, ...rests }, ref) => {
  return (
    <Input
      ref={ref}
      size={size}
      placeholder={placeholder}
      variant={bordered}
      style={style}
      {...rests}
    />
  );
});

export default InputComponent;
