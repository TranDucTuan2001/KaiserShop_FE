import React, { useEffect, useState } from "react";
// import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue, WrapperTypeProduct } from "./style";
// import { Checkbox, Rate } from "antd";
import { WrapperLableText, WrapperTypeProduct } from "./style";
import * as ProductService from "../../services/ProductService";
import TypeProduct from "../TypeProduct/TypeProduct";

const NavbarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  const handleNavigateType = (type) => {
    setActiveType(type);
  };

  // const renderContent = (type, options) => {
  //   switch (type) {
  //     case "text":
  //       return options.map((options) => {
  //         return <WrapperTextValue>{options}</WrapperTextValue>;
  //       });
  //     case "checkbox":
  //       return (
  //         <Checkbox.Group
  //           style={{
  //             width: "100%",
  //             display: "flex",
  //             flexDirection: "column",
  //             gap: "12px",
  //           }}
  //           onChange={onchange}
  //         >
  //           {options.map((options) => {
  //             return (
  //               <Checkbox style={{ marginLeft: 0 }} value={options.value}>
  //                 {options.lable}
  //               </Checkbox>
  //             );
  //           })}
  //         </Checkbox.Group>
  //       );
  //     case "star":
  //       return options.map((options) => {
  //         return (
  //           <div style={{ display: "flex", gap: "4px" }}>
  //             <Rate
  //               style={{ fontSize: "12px" }}
  //               disabled
  //               defaultValue={options}
  //             />
  //             <span>{`từ ${options} sao`}</span>
  //           </div>
  //         );
  //       });
  //       case "price":
  //       return options.map((options) => {
  //         return (
  //          <WrapperTextPrice>{options}</WrapperTextPrice>
  //         );
  //       });

  //     default:
  //       return {};
  //   }
  // };
  return (
    <div>
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperTypeProduct>
        {typeProducts.map((item) => {
          return (
            <TypeProduct
              key={item}
              name={item}
              isActive={activeType === item}
              onNavigate={handleNavigateType}
            />
          );
        })}
      </WrapperTypeProduct>
      {/* <WrapperContent>
        {renderContent("checkbox", [
          { value: "a", lable: "A" },
          { value: "b", lable: "B" },
        ])}
      </WrapperContent>
      <WrapperContent>{renderContent("star", [3, 4, 5])}</WrapperContent>
      <WrapperContent>{renderContent("price", ['dưới 40.000','trên 50.000'])}</WrapperContent> */}
    </div>
  );
};

export default NavbarComponent;
