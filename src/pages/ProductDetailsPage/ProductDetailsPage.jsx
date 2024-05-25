import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "antd";
import { BreadcrumbItem } from "./style";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ background: "#efefef", width: "100%" }}>
      <div
        style={{
          height: "100%",
          padding: "0 120px",
          margin: "0 auto",
          background: "#efefef",
          width: "1270",
        }}
      >
        <Breadcrumb
        style={{padding:'5px 0px'}}
          items={[
            {
              title: (
                <BreadcrumbItem onClick={() => navigate("/")}>
                  Trang chủ
                </BreadcrumbItem>
              ),
            },
            {
              title: "Chi tiết sản phẩm",
            },
          ]}
        />
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
