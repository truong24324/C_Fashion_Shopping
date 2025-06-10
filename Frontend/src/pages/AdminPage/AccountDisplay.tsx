import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Switch,
  Pagination,
  Spin,
  Modal,
  Form,
  Button,
  Popconfirm,
  Select,
  Space,InputNumber
} from "antd";
import { SearchOutlined, PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
const roles = [
  { label: "Super Admin", value: "Super_Admin" },
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Customer", value: "Customer" },
];

const selectRole = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
]

const AccountDisplay = () => {
  const [role, setRole] = useState("Customer");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [autoCount, setAutoCount] = useState(5); // số lượng mặc định
  const [autoRole, setAutoRole] = useState("Admin"); // vai trò mặc định
  const [generatedAccountsPreview, setGeneratedAccountsPreview] = useState([]);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/accounts/by-role?role=${role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tải tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (accountId: number) => {
    try {
      await axios.patch(`/api/accounts/${accountId}/lock`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Khóa/mở khóa tài khoản thành công!");
      setData((prev) =>
        prev.map((item) =>
          item.accountId === accountId ? { ...item, locked: !item.locked } : item
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const toggleActive = async (accountId: number) => {
    try {
      await axios.patch(`/api/accounts/${accountId}/active`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Cập nhật trạng thái hoạt động thành công!");
      setData((prev) =>
        prev.map((item) =>
          item.accountId === accountId ? { ...item, active: !item.active } : item
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const deleteAccount = async (accountId: number) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Xóa tài khoản thành công!");
      setData((prev) => prev.filter((item) => item.accountId !== accountId));
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData((prev) =>
        prev.map((item) =>
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

  const showDetails = (record: any) => {
    setDetailData(record);
    setShowDetailModal(true);
  };

  const [bulkMode, setBulkMode] = useState<"json" | "form" | "auto">("json");
  type AccountFormFields = {
    userCode: string;
    email: string;
    phone: string;
    password: string;
    roleName: string;
  };

  const [formAccounts, setFormAccounts] = useState<AccountFormFields[]>([
    { userCode: "", email: "", phone: "", password: "", roleName: "Customer" },
  ]);
  const handleFormAccountChange = (
    index: number,
    field: keyof AccountFormFields,
    value: string
  ) => {
    const updated = [...formAccounts];
    updated[index][field] = value;
    setFormAccounts(updated);
  };

  const addFormAccount = () => {
    setFormAccounts([
      ...formAccounts,
      { userCode: "", email: "", phone: "", password: "", roleName: "Customer" },
    ]);
  };

  const handleBulkCreate = async () => {
    try {
      let accounts = [];

      if (bulkMode === "json") {
        const parsed = JSON.parse(jsonInput);
        if (!Array.isArray(parsed)) {
          setJsonError("Dữ liệu phải là một mảng JSON!");
          return;
        }
        accounts = parsed;
      } else if (bulkMode === "auto") {
        accounts = Array.from({ length: autoCount }, (_, index) => {
          const randomStr = Math.random().toString(36).substring(2, 8);
          const userCode = `user_${randomStr}_${index}`;
          return {
            userCode,
            email: `${userCode}@example.com`,
            phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
            password: "123456",
            roleName: autoRole,
          };
        });
      } else {
        // mode form
        accounts = formAccounts;
      }

      // Gọi API tạo tài khoản hàng loạt
      await axios.post("/api/accounts/bulk-create", accounts, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Tạo tài khoản hàng loạt thành công!");
      setShowBulkModal(false);
      setJsonInput("");
      setFormAccounts([{ userCode: "", email: "", phone: "", password: "", roleName: "Customer" }]);
      fetchData();

    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setJsonError("JSON không hợp lệ!");
      } else {
        toast.error(err.response?.data?.message || "Lỗi khi tạo tài khoản!");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "accountId",
    },
    {
      title: "Tên",
      dataIndex: "userCode",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Kích hoạt",
      dataIndex: "active",
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          checkedChildren="Kích hoạt"
          unCheckedChildren="Không kích hoạt"
          onChange={() => toggleActive(record.accountId)}
        />
      ),
    },
    {
      title: "Bị khóa",
      dataIndex: "locked",
      render: (locked: boolean, record: any) => (
        <Switch
          checked={locked}
          checkedChildren="Đã khóa"
          unCheckedChildren="Đang mở khóa"
          onChange={() => toggleLock(record.accountId)}
        />
      ),
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
      ),
    },
  ];

  const filteredData = data.filter((item) =>
    [item.userCode, item.email, item.phone].some((field) =>
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
        <div className="flex space-x-3">
          <Input
            placeholder="Tìm theo tên..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowBulkModal(true)}
          >
            Tạo nhiều tài khoản
          </Button>
        </div>
      </div>

      <div className="border rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={filteredData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
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
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
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

      <Modal
        open={showBulkModal}
        onCancel={() => setShowBulkModal(false)}
        onOk={handleBulkCreate}
        title="Tạo tài khoản hàng loạt"
        okText="Tạo"
        cancelText="Hủy"
        width={bulkMode === "form" ? 800 : undefined}
      >
        <div className="flex justify-between mb-3">
          <p className="font-semibold">Chọn chế độ nhập</p>
          <div className="space-x-2">
            <Button
              type={bulkMode === "json" ? "primary" : "default"}
              onClick={() => setBulkMode("json")}
            >
              Nhập JSON
            </Button>
            <Button
              type={bulkMode === "form" ? "primary" : "default"}
              onClick={() => setBulkMode("form")}
            >
              Nhập Form
            </Button>
            <Button
              type={bulkMode === "auto" ? "primary" : "default"}
              onClick={() => setBulkMode("auto")}
            >
              Tạo ngẫu nhiên
            </Button>
          </div>
        </div>

        {/* --- AUTO MODE --- */}
        {bulkMode === "auto" && (
          <Form layout="vertical">
            <Form.Item label="Số lượng tài khoản muốn tạo">
              <InputNumber
                min={1}
                value={autoCount}
                onChange={(value) => {
                  if (typeof value === "number" && !isNaN(value)) {
                    setAutoCount(value);
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="Vai trò">
              <Select
                style={{ width: 200 }}
                value={autoRole}
                onChange={setAutoRole}
                options={[
                  { label: "Admin", value: "Admin" },
                  { label: "Manager", value: "Manager" },
                ]}
              />
            </Form.Item>
            {generatedAccountsPreview.length > 0 && (
              <Form.Item label="Xem trước danh sách tài khoản">
                <pre className="bg-gray-100 p-2 rounded max-h-64 overflow-auto text-xs">
                  {JSON.stringify(generatedAccountsPreview, null, 2)}
                </pre>
              </Form.Item>
            )}
          </Form>
        )}

        {/* --- JSON MODE --- */}
        {bulkMode === "json" && (
          <Form layout="vertical">
            <Form.Item label="Dán JSON danh sách tài khoản">
              <Input.TextArea
                rows={10}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError("");
                }}
                placeholder='[{"userCode": "john", "email": "...", "phone": "...", "password": "...", "role": "Customer"}, ...]'
              />
              {jsonError && <p className="text-red-500 mt-1">{jsonError}</p>}
            </Form.Item>
          </Form>
        )}

        {/* --- FORM MODE --- */}
        {bulkMode === "form" && (
          <Form layout="vertical">
            {formAccounts.map((acc, index) => (
              <Space key={index} className="mb-2" wrap>
                <Form.Item label="User Code">
                  <Input
                    value={acc.userCode}
                    onChange={(e) => handleFormAccountChange(index, "userCode", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    value={acc.email}
                    onChange={(e) => handleFormAccountChange(index, "email", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Phone">
                  <Input
                    value={acc.phone}
                    onChange={(e) => handleFormAccountChange(index, "phone", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Password">
                  <Input
                    value={acc.password}
                    onChange={(e) => handleFormAccountChange(index, "password", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Role">
                  <Select
                    style={{ width: 120 }}
                    value={acc.roleName}
                    onChange={(value) => handleFormAccountChange(index, "roleName", value)}
                    options={selectRole}
                  />
                </Form.Item>
              </Space>
            ))}
            <Button icon={<PlusCircleOutlined />} onClick={addFormAccount}>
              Thêm dòng mới
            </Button>
          </Form>
        )}
      </Modal>


    </div>
  );
};

export default AccountDisplay;
