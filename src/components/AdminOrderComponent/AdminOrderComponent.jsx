import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../../components/InputComponent/InputComponent";

import { convertPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";

import LoadingComponent from "../LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";
import { useQuery } from "@tanstack/react-query";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Highlighter from "react-highlight-words";
import { orderContant } from "../../contant";
import PieChartComponent from "../PieChartComponent/PieChartComponent";
import { WrapperTitle } from "../../pages/MyOrderPage/style";

const AdminOrderComponent = () => {
  const user = useSelector((state) => state?.user);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState();
  const [rowSelected, setRowSelected] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [stateOrderDetails, setstateOrderDetails] = useState({
    orderId: "",
    isDelivered: "",
  });

  const [updateForm] = Form.useForm();

  const getAllOrders = async (access_token) => {
    const res = await OrderService.getAllOrder(access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(user?.access_token),
  });

  const { isLoading: isLoadingUsers, data: orders } = queryOrder;

  const mutationUpdate = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await OrderService.updateOrder(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDelete = useMutationHooks(async (data) => {
    try {
      const { id, access_token } = data;
      const res = await OrderService.deleteOrder(id, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDeleteMany = useMutationHooks(async (data) => {
    try {
      const { access_token, ...ids } = data;
      const res = await OrderService.deleteManyOrder(ids, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const fetchGetDetailsOrder = useCallback( async (rowSelected) => {
    const res = await OrderService.getDetailsOrder(
      user?.id,
      rowSelected,
      user?.access_token
    );
    if (res?.data) {
      setstateOrderDetails({
        orderId: res?.data?._id,
        isDelivered: res?.data?.isDelivered,
      });
    }
    setIsLoadingUpdate(false);
  },[user?.access_token, user?.id])

  useEffect(() => {
    updateForm.setFieldsValue(stateOrderDetails);
  }, [stateOrderDetails, updateForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsOrder(rowSelected);
    }
  }, [fetchGetDetailsOrder, rowSelected]);

  const handleDetailsOrder = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
    setIsOpenDrawer(true);
  };

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
          onClick={handleDetailsOrder}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDeleteManyOrder = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        access_token: user?.access_token,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      title: "Tên",
      dataIndex: "userName",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ/thành phố",
      dataIndex: "address",
      width: "130px",
      render: (text, record) => `${record.address}, ${record.city}`,
    },

    {
      title: "Sản phẩm",
      dataIndex: "itemOrder",
      width: "200px",
      render: (text) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {text.split("\n").map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{`• ${item.split(" x")[0]}`}</span>
              <span>{`x${item.split(" x")[1]}`}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (totalPrice) => convertPrice(totalPrice),
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
          return record.totalPrice >= 500000;
        } else if (value === "<=200.000") {
          return record.totalPrice <= 200000;
        } else if (value === "<=500.000") {
          return record.totalPrice <= 500000;
        } else if (value === ">=1m") {
          return record.totalPrice >= 1000000;
        } else if (value === ">=5m") {
          return record.totalPrice >= 5000000;
        } else {
          return record.totalPrice >= 10000000;
        }
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      width: "150px",
      filters: [
        {
          text: "Later money",
          value: "Thanh toán tiền mặt khi nhận hàng",
        },
        {
          text: "Paypal",
          value: "Thanh toán bằng paypal",
        },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "delivery",
      width: "120px",
      filters: [
        {
          text: "FAST",
          value: "FAST",
        },
        {
          text: "GO_JEK",
          value: "GO_JEK",
        },
      ],
      onFilter: (value, record) => record.delivery === value,
    },
    {
      title: "Đã giao hàng",
      dataIndex: "isDelivered",
      width: "100px",

      render: (isDelivered) => (isDelivered ? <div>✅</div> : <div>❌</div>),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isDelivered === value,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: renderAction,
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        address: order?.shippingAddress?.address,
        city: order?.shippingAddress?.city,
        phone: order?.shippingAddress?.phone,
        totalPrice: order?.totalPrice,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        delivery: orderContant.delivery[order?.delivery],
        isDelivered: order?.isDelivered,
        itemOrder: order?.orderItems
          .map((item) => `${item?.name} x${item?.amount}`)
          .join("\n"),
      };
    });

  useEffect(() => {
    if (
      mutationDeleteMany.isSuccess &&
      mutationDeleteMany.data?.status === "OK"
    ) {
      message.success(mutationDeleteMany.data?.message);
    } else if (mutationDeleteMany.data?.status === "ERR") {
      message.error(mutationDeleteMany.data?.message);
    }
  }, [
    mutationDeleteMany.data?.message,
    mutationDeleteMany.data?.status,
    mutationDeleteMany.isSuccess,
  ]);

  const handleCancelDelete = () => {
    setIsModalDelete(false);
  };
  const handleDeleteUser = () => {
    mutationDelete.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    updateForm.resetFields();
    setstateOrderDetails({
      orderId: "",
      isDelivered: "",
    });
  },[updateForm])

  // const handleOnchangeDetails = (e) => {
  //   setstateOrderDetails({
  //     ...stateOrderDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
        ...stateOrderDetails,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
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
  }, [mutationUpdate.isSuccess, mutationUpdate.isError, mutationUpdate.data?.status, mutationUpdate.data?.message, handleCloseDrawer]);

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
  }, [mutationDelete.isSuccess, mutationDelete.isError, mutationDelete.data?.status, mutationDelete.data?.message]);

  const handleOnchangeSelect = (value) => {
    setstateOrderDetails({
      ...stateOrderDetails,
      isDelivered: value,
    });
  };

  return (
    <div>
      <h3 style={{ color: "red", marginTop: 0, fontWeight: "200" }}>
        Nếu chưa có data vui lòng reload lại trang !
      </h3>
      <WrapperTitle>Quản lí đơn hàng</WrapperTitle>
      <div style={{ height: "200px", width: "250px", marginBottom: "25px" }}>
        <PieChartComponent data={orders?.data} />
        <span style={{ fontSize: "15px", fontFamily: "sans-serif" }}>
          Biểu đồ phương thức thanh toán
        </span>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyOrder}
          columns={columns}
          header="Danh sách đơn hàng"
          isLoading={isLoadingUsers}
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

      <DrawerComponent
        forceRender
        title="Cập nhật trạng thái đơn hàng"
        isOpen={isOpenDrawer}
        width="50%"
        onClose={() => {
          setIsOpenDrawer(false);
          setstateOrderDetails({
            orderId: "",
            isDelivered: "",
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
            initialValues={stateOrderDetails}
            onFinish={onUpdateUser}
            autoComplete="off"
          >
            <Form.Item label="ID đơn hàng" name="orderId">
              <InputComponent
                value={stateOrderDetails?.orderId}
                name="orderId"
              />
            </Form.Item>
            <Form.Item label="Đã giao hàng" name="isDelivered">
              <Select
                name={"type"}
                value={stateOrderDetails?.isDelivered}
                onChange={handleOnchangeSelect}
                options={[
                  {
                    value: "true",
                    label: "Yes",
                  },
                  {
                    value: "false",
                    label: "No",
                  },
                ]}
              />
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
        title="Xoá đơn hàng"
        open={isModalDelete}
        okText=""
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <LoadingComponent isLoading={mutationDelete.isPending}>
          <div>Bạn có chắc muốn xoá đơn hàng này không?</div>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default AdminOrderComponent;
