import React from "react";
import { Modal } from "antd";

const ModalComponent = ({
  title = "modal",
  isOpen = false,
  children,
  ...rests
}) => {
  return (
    <Modal title={title} open={isOpen} {...rests}>
      {children}
    </Modal>
  );
};

export default ModalComponent;
