import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperImageStyle,
  WrapperPriceAfter,
  WrapperPriceBefore,
  WrapperStyleTextSell,
} from "./style";
import {
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const {
    countInStock,
    // description,
    image,
    name,
    price,
    rating,
    // type,
    discount,
    selled,
    id,
    afterPrice,
  } = props;
  const navigate = useNavigate();
  const handleDetaisProduct = (id) => {
    if (id) {
      navigate(`/product-details/${id}`);
    }
  };

  return (
    <WrapperCardStyle
      hoverable
      style={{
        width: 200,
      }}
      styles={{
        head: { width: "200px", height: "200px" },
        body: { padding: "10px" },
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetaisProduct(id)}
      disabled={countInStock === 0}
    >
      <WrapperImageStyle src={logo} />
      <div style={{ height: "40px" }}>
        <StyleNameProduct>{name}</StyleNameProduct>
      </div>
      <WrapperReportText>
        <span>
          <span style={{ marginRight: "4px" }}>{rating}</span>
          <StarFilled style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {selled || 0}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <WrapperPriceAfter style={{ marginRight: "8px" }}>{convertPrice(afterPrice)}</WrapperPriceAfter>
        <div style={{ display: "flex", gap: "4px", height: "18px" }}>
          {discount !== 0 && (
            <>
              <WrapperDiscountText>{`-${discount || 0}%`}</WrapperDiscountText>
              <WrapperPriceBefore>{convertPrice(price)}</WrapperPriceBefore>
            </>
          )}
        </div>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
