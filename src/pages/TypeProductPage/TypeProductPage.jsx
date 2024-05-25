import React, { useCallback, useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Row, Pagination } from "antd";
import { WrapperNavbar, WrapperProduct } from "./style";
import * as ProductService from "../../services/ProductService";
import { useLocation } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import { useDebounceHook } from "../../hooks/useDebounceHook";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounceHook(searchProduct, 500);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 5,
    total: 1,
  });
  const [totalPage, setTotalPage] = useState();
  const fetchProdctType = useCallback(async (type, page = 0, limit = 10) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductType(type, page, limit);
      if (res?.status === "OK") {
        setProducts(res?.data);
        setTotalPage(res?.totalPage);
        setPanigate((prev) => ({ ...prev, total: res?.totalPage }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProdctTypePage = useCallback(async (type, page, limit) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductType(type, page, limit);
      if (res?.status === "OK") {
        setProducts(res?.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location?.state) {
      fetchProdctType(location?.state);
    }
  }, [fetchProdctType, location?.state]);

  const onPageChange = (page, pageSize) => {
    fetchProdctTypePage(location?.state, page - 1, panigate?.limit);
  };

  return (
    <LoadingComponent isLoading={loading}>
      <div style={{ background: "#f5f5fa", width: "100%" }}>
        <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
          <Row
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              paddingBottom: "20px",
              height: "calc(100% - 20px)",
            }}
          >
            <WrapperNavbar span={4}>
              <NavbarComponent />
            </WrapperNavbar>

            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProduct>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return true;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        ?.includes(searchDebounce?.toLowerCase())
                    ) {
                      return true;
                    }
                    return false;
                  })
                  ?.map((product) => {
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
              <Pagination
                pageSize={1}
                defaultCurrent={panigate.page + 1}
                total={totalPage}
                onChange={onPageChange}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </LoadingComponent>
  );
};

export default TypeProductPage;
