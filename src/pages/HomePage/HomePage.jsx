import React, { useEffect, useState } from "react";

import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/b2.jpg";
import slider2 from "../../assets/images/slider2i.png";
import slider3 from "../../assets/images/slider3i.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useDebounceHook } from "../../hooks/useDebounceHook";
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const [typeProducts, setTypeProducts] = useState([]);
  const searchDebounce = useDebounceHook(searchProduct, 1000);
  const [activeType, setActiveType] = useState(null);
  const [limit, setLimit] = useState(12);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);

    return res;
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }

    return res;
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  const handleNavigateType = (type) => {
    setActiveType(type);
  };

  const {
    isPending,
    data: products,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (prev) => prev,
  });

  return (
    <LoadingComponent isLoading={isPending}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
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
      </div>
      <div
        id="container"
        style={{
          backgroundColor: "#efefef",
          padding: "0 120px",
          height: "100%",
        }}
      >
        <div
          className="body"
          style={{ width: "100%", backgroundColor: "#efefef" }}
        >
          <div
            id="container"
            style={{ height: "100%", width: "1270px", margin: "0 auto" }}
          >
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
            <WrapperProduct>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProduct>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <WrapperButtonMore
                textButton={isPlaceholderData ? "Đang tải..." : "Xem thêm"}
                type="outline"
                styleButton={{
                  border: "1px solid rgb(11,116,229)",
                  color: `${
                    products?.total === products?.data?.length ||
                    products?.totalPage === 1
                      ? "#ccc"
                      : "rgb(11,116,229)"
                  }`,
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  pointerEvents:
                    isPlaceholderData ||
                    products?.total === products?.data?.length ||
                    products?.totalPage === 1
                      ? "none"
                      : "auto",
                }}
                disabled={
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                }
                styleTextButton={{
                  fontWeight: 500,
                  color:
                    (products?.total === products?.data?.length ||
                      products?.totalPage === 1) &&
                    "#fff",
                }}
                onClick={() => {
                  if (
                    !(
                      products?.total === products?.data?.length ||
                      products?.totalPage === 1
                    )
                  ) {
                    setLimit((prev) => prev + 6);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </LoadingComponent>
  );
};

export default HomePage;
