import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Space, Input, Select } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { WrapperUploadFile } from "../../pages/ProfilePage/style";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import * as message from "../../components/MesageComponent/MesageComponent";
import { useQuery } from "@tanstack/react-query";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Highlighter from "react-highlight-words";
import { WrapperTitle } from "../../pages/MyOrderPage/style";

const AdminUserComponent = () => {
  const user = useSelector((state) => state?.user);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState();
  const [rowSelected, setRowSelected] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [stateUser, setStateUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: "",
    avatar: "",
    city: "",
  });

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const getAllUsers = async (access_token) => {
    const res = await UserService.getAllUser(access_token);

    return res;
  };

  const queyUser = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(user?.access_token),
  });

  const { isLoading: isLoadingUsers, data: users } = queyUser;
  const mutation = useMutationHooks(async (data) => {
    try {
      const { email, password, confirmPassword } = data;
      const res = await UserService.SignUpUser({
        email,
        password,
        confirmPassword,
      });
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationUpdate = useMutationHooks(async (data) => {
    try {
      const { id, access_token, ...rests } = data;
      const res = await UserService.updateUser(id, rests, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDelete = useMutationHooks(async (data) => {
    try {
      const { id, access_token } = data;
      const res = await UserService.deleteUser(id, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const mutationDeleteMany = useMutationHooks(async (data) => {
    try {
      const { access_token, ...ids } = data;
      const res = await UserService.deleteManyUser(ids, access_token);
      return res;
    } catch (error) {
      throw error;
    }
  });

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        address: res?.data?.address,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        city: res?.data?.city,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      updateForm.setFieldsValue(stateUserDetails);
    }
  }, [isModalOpen, stateUserDetails, updateForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsUser = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
      setIsOpenDrawer(true);
    }
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
          onClick={handleDetailsUser}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        access_token: user?.access_token,
      },
      {
        onSettled: () => {
          queyUser.refetch();
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
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
      dataIndex: "name",
      width: 200,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      width: 250,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 230,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      width: 230,
      ...getColumnSearchProps("city"),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 200,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      width: 150,

      render: (isAdmin) => (isAdmin ? <div>✅</div> : <div>❌</div>),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: renderAction,
    },
  ];
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return { ...user, key: user._id };
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
    setStateUser({
      email: "",
      password: "",
      confirmPassword: "",
    });
    createForm.resetFields();
  }, [createForm]);

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status === "OK") {
      message.success(mutation.data?.message);
      handleCancel();
    } else if (mutation.isError || mutation.data?.status === "ERR") {
      message.error(mutation.data?.message);
    }
  }, [
    handleCancel,
    mutation.data?.message,
    mutation.data?.status,
    mutation.isError,
    mutation.isSuccess,
  ]);

  const handleOnchangeSelect = (value) => {
    setStateUserDetails({
      ...stateUserDetails,
      isAdmin: value,
    });
  };

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
          queyUser.refetch();
        },
      }
    );
  };
  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    updateForm.resetFields();
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      isAdmin: "",
      avatar: "",
      city: "",
    });
  }, [updateForm]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
    createForm.resetFields();
    setStateUser({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  const onFinish = () => {
    mutation.mutate(stateUser, {
      onSettled: () => {
        queyUser.refetch();
      },
    });
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };
  const handleOnchange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queyUser.refetch();
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
      <h3 style={{ color: "red", marginTop: 0, fontWeight: "200" }}>
        Nếu chưa có data vui lòng reload lại trang !
      </h3>
      <WrapperTitle>Quản lí người dùng</WrapperTitle>
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
          handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          header="Danh sách người dùng"
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
      <ModalComponent
        title="Tạo người dùng"
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
            style={{ maxWidth: 600, marginTop: "20px" }}
            initialValues={{ remember: false }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUser?.email}
                onChange={handleOnchange}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                value={stateUser?.password}
                onChange={handleOnchange}
                name="password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Pass"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your confirmPassword!",
                },
              ]}
            >
              <Input.Password
                value={stateUser?.confirmPassword}
                onChange={handleOnchange}
                name="confirmPassword"
                autoComplete="new-password"
              />
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
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        width="50%"
        onClose={() => {
          setIsOpenDrawer(false);
          setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            address: "",
            isAdmin: "",
            avatar: "",
            city: "",
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
            initialValues={stateUserDetails}
            onFinish={onUpdateUser}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: false, message: "Please input your Name!" }]}
            >
              <InputComponent
                value={stateUserDetails?.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: false,
                  message: "Please input your email!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.email}
                onChange={handleOnchangeDetails}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="SĐT"
              name="phone"
              rules={[{ required: false, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUserDetails?.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: false,
                  message: "Please input your address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[
                {
                  required: false,
                  message: "Please input your city!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.city}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Admin access"
              name="isAdmin"
              rules={[
                {
                  required: true,
                  message: "Please input value true or false!",
                },
              ]}
            >
              <Select
                name={"type"}
                value={stateUserDetails?.isAdmin}
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
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: false,
                  message: "Please input your avatar!",
                },
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnChangeAvatarDetails}
                  maxCount={2}
                >
                  <Button icon={<UploadOutlined />}>Select file</Button>
                </WrapperUploadFile>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
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
        title="Xoá người dùng"
        open={isModalDelete}
        okText=""
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <LoadingComponent isLoading={mutationDelete.isPending}>
          <div>Bạn có chắc muốn xoá người dùng này không?</div>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default AdminUserComponent;
