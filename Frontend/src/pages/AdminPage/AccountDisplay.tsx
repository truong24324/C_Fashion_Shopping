import { useState, useEffect } from "react";
import { Table, Input, Switch, Pagination, Spin, Modal, Form, Button, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";

const roles = [
  { label: "Super Admin", value: "Super_Admin" },
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Customer", value: "Customer" }
];

const AccountDisplay = () => {
  const [role, setRole] = useState("Customer");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/accounts/by-role?role=${role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setData(response.data.data || []);
      setTotalItems((response.data.data || []).length);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tải tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (accountId: number) => {
    try {
      await axios.patch(`/api/accounts/${accountId}/lock`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Khóa/mở khóa tài khoản thành công!");
      setData((prevData) =>
        prevData.map((item) =>
          item.accountId === accountId
            ? { ...item, locked: !item.locked }
            : item
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const toggleActive = async (accountId: number) => {
    try {
      await axios.patch(`/api/accounts/${accountId}/active`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Cập nhật trạng thái hoạt động thành công!");
      setData((prevData) =>
        prevData.map((item) =>
          item.accountId === accountId
            ? { ...item, active: !item.active }
            : item
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const deleteAccount = async (accountId: number) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Xóa tài khoản thành công!");
      setData((prevData) => prevData.filter((item) => item.accountId !== accountId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa!");
    }
  };

  const promoteAccount = async (accountId: number) => {
    try {
      const response = await axios.patch(
        `/api/accounts/${accountId}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.accountId === accountId
            ? { ...item, role: response.data.role }
            : item
        )
      );
      toast.success(response.data.message || "Đã nâng cấp quyền tài khoản!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi nâng cấp tài khoản!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "accountId"
    },
    {
      title: "Tên",
      dataIndex: "userCode"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Điện thoại",
      dataIndex: "phone"
    },
    {
      title: "Kích hoạt",
      dataIndex: "active",
      render: (active: boolean, record: any) => (
        <Switch checked={active} onChange={() => toggleActive(record.accountId)} />
      )
    },
    {
      title: "Bị khóa",
      dataIndex: "locked",
      render: (locked: boolean, record: any) => (
        <Switch checked={locked} onChange={() => toggleLock(record.accountId)} />
      )
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <div className="space-x-2">
          <Button onClick={() => showDetails(record)}>🔍 Xem</Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => deleteAccount(record.accountId)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>🗑️ Xóa</Button>
          </Popconfirm>

          <Popconfirm
            title="Bạn có muốn nâng cấp vai trò của tài khoản này không?"
            onConfirm={() => promoteAccount(record.accountId)}
            okText="Nâng cấp"
            cancelText="Hủy"
          >
            <Button type="primary">⬆️ Nâng cấp</Button>
          </Popconfirm>
        </div>
      )
    }

  ];

  const showDetails = (record: any) => {
    setDetailData(record);
    setShowModal(true);
  };

  const filteredData = data.filter((item) =>
    [item.userCode, item.email, item.phone]
      .some((field) =>
        (field || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="p-4 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${role === r.value
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Input
          placeholder="Tìm theo tên..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-4 py-2 rounded-lg border"
        />
      </div>

      <div className="border rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            pagination={false}
            rowKey="accountId"
          />
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Chi tiết tài khoản"
        footer={null}
      >
        {detailData ? (
          <Form layout="vertical">
            {Object.entries(detailData).map(([key, value]) => (
              <Form.Item label={key} key={key}>
                <Input value={String(value ?? "")} readOnly />
              </Form.Item>
            ))}
          </Form>
        ) : (
          <Spin />
        )}
      </Modal>
    </div>
  );
};

export default AccountDisplay;
