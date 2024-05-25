import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Space, Select } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { WrapperUploadFile } from "../../pages/ProfilePage/style";
import { convertPrice, getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Highlighter from "react-highlight-words";
import { WrapperTitle } from "../../pages/MyOrderPage/style";

const AdminProductComponent = () => {
  const user = useSelector((state) => state?.user);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState();
  const [typeSelect, setTypeSelect] = useState("");
  const [rowSelected, setRowSelected] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    countInStock: "",
    type: "",
    discount: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    countInStock: "",
    type: "",
    discount: "",
  });

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const mutation = useMutationHooks(async (data) => {
    try {
      const {
        name,
        price,
        description,
        rating,
        image,
        countInStock,
        type,
        discount,
      } = data;
      const res = await ProductService.createProduct({
        name,
        price,
        description,
        rating,
        image,
        countInStock,
        type,
        discount,
      });
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationUpdate = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await ProductService.updateProduct(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDelete = useMutationHooks(async (data) => {
    try {
      const { id, access_token } = data;
      const res = await ProductService.deleteProduct(id, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDeleteMany = useMutationHooks(async (data) => {
    try {
      const { access_token, ...ids } = data;
      const res = await ProductService.deleteManyProduct(ids, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        countInStock: res?.data?.countInStock,
        type: res?.data?.type,
        discount: res?.data?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    updateForm.setFieldsValue(stateProductDetails);
  }, [stateProductDetails, updateForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
    setIsOpenDrawer(true);
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    return res;
  };
  const queyProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const { isLoading: isLoadingProducts, data: products } = queyProduct;

  const renderAction = () => {
    return (
      <div style={{ display: "flex", gap: "5px" }}>
        <Button
          shape="circle"
          onClick={() => setIsModalDelete(true)}
          icon={<DeleteTwoTone twoToneColor="red" />}
        />
        <Button
          shape="circle"
          icon={<EditTwoTone />}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        access_token: user?.access_token,
      },
      {
        onSettled: () => {
          queyProduct.refetch();
        },
      }
    );
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: 300,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      width: 220,
      render: (price) => convertPrice(price),

      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: "500.000 VND trở lên",
          value: ">=500.000",
        },
        {
          text: "500.000 VND xuống",
          value: "<=500.000",
        },
        {
          text: "200.000 VND trở xuống",
          value: "<=200.000",
        },
        {
          text: "1 triệu trở lên",
          value: ">=1m",
        },
        {
          text: "5 triệu trở lên",
          value: ">=5m",
        },
        {
          text: "10 triệu trở lên",
          value: ">=10m",
        },
      ],

      onFilter: (value, record) => {
        if (value === ">=500.000") {
          return record.price >= 500000;
        } else if (value === "<=200.000") {
          return record.price <= 200000;
        } else if (value === "<=500.000") {
          return record.price <= 500000;
        } else if (value === ">=1m") {
          return record.price >= 1000000;
        } else if (value === ">=5m") {
          return record.price >= 5000000;
        } else {
          return record.price >= 10000000;
        }
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      width: 130,

      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">=3",
          value: ">=",
        },
        {
          text: "<=3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 3;
        }
        return record.rating <= 3;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (discount) => (discount ? `${discount}%` : ""),
      sorter: (a, b) => a.discount - b.discount,
      filters: [
        {
          text: "từ 10% trở lên",
          value: ">=10",
        },
        {
          text: "từ 10% trở xuống",
          value: "<=10",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=10") {
          return record.discount >= 10;
        } else if (value === "<=10") {
          return record.discount <= 10;
        }
      },
    },

    {
      title: "Loại",
      dataIndex: "type",
      width: 250,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: renderAction,
    },
  ];
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  useEffect(() => {
    if (
      mutationDeleteMany.isSuccess &&
      mutationDeleteMany.data?.status === "OK"
    ) {
      message.success(mutationDeleteMany.data?.message);
    } else if (
      mutationDeleteMany.isError ||
      mutationDeleteMany.data?.status === "ERR"
    ) {
      message.error(mutationDeleteMany.data?.message);
    }
  }, [
    mutationDeleteMany.data?.message,
    mutationDeleteMany.data?.status,
    mutationDeleteMany.isError,
    mutationDeleteMany.isSuccess,
  ]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setTypeSelect("");
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      countInStock: "",
      type: "",
      discount: "",
    });
    createForm.resetFields();
  }, [createForm]);
  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status === "OK") {
      message.success(mutation.data?.message);
      handleCancel();
    } else if (mutation.data?.status === "ERR") {
      message.error(mutation.data?.message);
    }
  }, [
    handleCancel,
    mutation.data?.message,
    mutation.data?.status,
    mutation.isSuccess,
  ]);
  const handleCancelDelete = () => {
    setIsModalDelete(false);
  };
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
      },
      {
        onSettled: () => {
          queyProduct.refetch();
        },
      }
    );
  };
  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    updateForm.resetFields();
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      countInStock: "",
      type: "",
      discount: "",
    });
  }, [updateForm]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
    createForm.resetFields(); // Reset form fields
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      countInStock: "",
      type: "",
      discount: "",
    });
  };
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queyProduct.refetch();
      },
    });
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchangeSelect = (value) => {
    if (value !== "add_type") {
      setStateProduct({
        ...stateProduct,
        type: value,
      });
    } else {
      setTypeSelect(value);
    }
  };
  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queyProduct.refetch();
        },
      }
    );
  };
  useEffect(() => {
    if (mutationUpdate.isSuccess && mutationUpdate.data?.status === "OK") {
      message.success(mutationUpdate.data?.message);
      handleCloseDrawer();
    } else if (
      mutationUpdate.isError ||
      mutationUpdate.data?.status === "ERR"
    ) {
      message.error(mutationUpdate.data?.message);
    }
  }, [
    mutationUpdate.isSuccess,
    mutationUpdate.isError,
    mutationUpdate.data?.status,
    mutationUpdate.data?.message,
    handleCloseDrawer,
  ]);

  useEffect(() => {
    if (mutationDelete.isSuccess && mutationDelete.data?.status === "OK") {
      message.success(mutationDelete.data?.message);
      handleCancelDelete();
    } else if (
      mutationDelete.isError ||
      mutationDelete.data?.status === "ERR"
    ) {
      message.error(mutationDelete.data?.message);
    }
  }, [
    mutationDelete.isSuccess,
    mutationDelete.isError,
    mutationDelete.data?.status,
    mutationDelete.data?.message,
  ]);

  return (
    <div>
      <WrapperTitle>Quản lí sản phẩm</WrapperTitle>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => handleOpenModal()}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
          columns={columns}
          header="Danh sách sản phẩm"
          isLoading={isLoadingProducts}
          data={dataTable}
          pagination={{
            pageSize: 6,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <ModalComponent
        title="Tạo sản phẩm"
        open={isModalOpen}
        okText=""
        onCancel={handleCancel}
        footer={null}
      >
        <LoadingComponent isLoading={mutation.isPending}>
          <Form
            form={createForm}
            name="createProductForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: false }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <InputComponent
                value={stateProduct?.name}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your Type!",
                },
              ]}
            >
              <Select
                name={typeSelect === "add_type" ? "type" : ""}
                value={stateProduct?.type}
                onChange={handleOnchangeSelect}
                // style={{ width: 120 }}
                options={renderOptions(typeProduct?.data?.data)}
              ></Select>
              {typeSelect === "add_type" && (
                <InputComponent
                  value={stateProduct?.type}
                  onChange={handleOnchange}
                  name={typeSelect === "add_type" ? "type" : ""}
                />
              )}
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your countInStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct?.countInStock}
                onChange={handleOnchange}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct?.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct?.discount}
                onChange={handleOnchange}
                name="discount"
              />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <InputComponent
                value={stateProduct?.description}
                onChange={handleOnchange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct?.rating}
                onChange={handleOnchange}
                placeholder="tối đa 5"
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Ảnh"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image!",
                },
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select file</Button>
                </WrapperUploadFile>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </ModalComponent>
      <DrawerComponent
        forceRender 
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        width="50%"
        onClose={() => {
          setIsOpenDrawer(false);
          setStateProductDetails({
            name: "",
            price: "",
            description: "",
            rating: "",
            image: "",
            countInStock: "",
            type: "",
            discount: "",
          });
        }}
      >
        <LoadingComponent
          isLoading={isLoadingUpdate || mutationUpdate.isPending}
        >
          <Form
            form={updateForm}
            name="updateProductForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={stateProductDetails}
            onFinish={onUpdateProduct}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <InputComponent
                value={stateProductDetails?.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your Type!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails?.type}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your countInStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails?.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails?.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails?.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <InputComponent
                value={stateProductDetails?.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails?.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Ảnh"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image!",
                },
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnChangeAvatarDetails}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select file</Button>
                </WrapperUploadFile>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </DrawerComponent>
      <ModalComponent
        title="Xoá sản phẩm"
        open={isModalDelete}
        okText=""
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <LoadingComponent isLoading={mutationDelete.isPending}>
          <div>Bạn có chắc muốn xoá sản phẩm này không?</div>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default AdminProductComponent;
