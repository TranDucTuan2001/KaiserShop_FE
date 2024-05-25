import React from "react";
import { Drawer } from "antd";
const DrawerComponent = ({
  title = "Drawer",
  placement = "right",
  children,
  onClose,
  isOpen = false,
  ...rests
}) => {
  return (
    <div>
      <Drawer
        title={title}
        placement={placement}
        onClose={onClose}
        open={isOpen}
        {...rests}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
