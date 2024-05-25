import React, { useMemo, useState } from "react";
import { Table, Button, Form } from "antd";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Excel } from "antd-table-saveas-excel";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";

import * as message from "../MesageComponent/MesageComponent";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
    header,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const [rowSelectedKey, setRowSelectedKey] = useState([]);
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "Action");
    return arr;
  }, [columns]);

  const [createForm] = Form.useForm();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys);
    },
  };
  const handleOnChange = (e) => {
    setFileName(e.target.value);
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey);
    setRowSelectedKey([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    createForm.resetFields();
  };

  const handleOnSubmit = () => {
    if (fileName.trim() !== "") {
      exportExcel(fileName);
      message.success("Xuất file thành công");
      setIsModalOpen(false);
      setFileName("");
      createForm.resetFields();
    } else {
      message.error("Vui lòng nhập tên file");
    }
  };

  const exportExcel = (fileName) => {
    const excel = new Excel();
    excel
      .addSheet("sheet 1")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs(fileName + ".xlsx");
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Export Excel</Button>

      <LoadingComponent isLoading={isLoading}>
        {rowSelectedKey.length > 0 && (
          <div
            style={{
              borderRadius: "6px",
              background: "red",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "10px",
              padding: "10px",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
            onClick={handleDeleteAll}
          >
            Xoá tất cả
          </div>
        )}

        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          title={() => header}
          bordered
          {...props}
        />
      </LoadingComponent>
      <ModalComponent
        title="Lưu file"
        open={isModalOpen}
        okText=""
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={createForm}
          name="createProductForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600, marginTop: "20px" }}
          initialValues={{ remember: false }}
          onFinish={handleOnSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="File name"
            name="name"
            rules={[{ required: true, message: "Please input your File name" }]}
          >
            <InputComponent
              value={fileName}
              onChange={handleOnChange}
              name="email"
              placeholder="Enter your File name"
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
      </ModalComponent>
    </div>
  );
};
export default TableComponent;
