import React from "react";
import { Spin } from "antd";
const LoadingComponent = ({ children, isLoading, delay = 200 }) => {
  return (
    <Spin spinning={isLoading} delay={delay}>
      {children}
    </Spin>
  );
};

export default LoadingComponent;
