import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Table, Button, Pagination } from "antd";
import { Trash, Lock, Unlock, } from "lucide-react";

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [loading, setLoading] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

    useEffect(() => {
        loadAccounts();
    }, [currentPage, pageSize]);

    const loadAccounts = async () => {
        setLoading(true);
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {
            console.error("Token not found in localStorage");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/accounts/all`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm Authorization header với token
                },
                params: {
                    page: currentPage - 1,
                    size: pageSize,
                    sortBy: "accountId",
                    sortDir: "asc",
                },
            });

            setAccounts(response.data.content);
            setTotal(response.data.totalElements);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };

    const handleAccountAction = async (action: string, accountId: number) => {
        setLoading(true);
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        try {
            switch (action) {
                case "lock":
                    await axios.put(`/api/accounts/${accountId}/lock`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm Authorization header với token
                        },
                    });
                    break;
                case "unlock":
                    await axios.put(`/api/accounts/${accountId}/unlock`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm Authorization header với token
                        },
                    });
                    break;
                case "delete":
                    await axios.delete(`/api/accounts/${accountId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm Authorization header với token
                        },
                    });
                    break;
                default:
                    break;
            }
            loadAccounts();
        } catch (error) {
            toast.error("Lỗi khi thực hiện hành động");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "accountId",
            key: "accountId",
        },
        {
            title: "Tên người dùng",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (isActive ? "Hoạt động" : "Khoá"),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleAccountAction(record.isActive ? "lock" : "unlock", record.accountId)}
                        icon={record.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                        size="small"
                        danger={record.isActive}
                    />
                    <Button
                        onClick={() => handleAccountAction("delete", record.accountId)}
                        icon={<Trash size={18} />}
                        size="small"
                        danger
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <Table
                dataSource={accounts}
                columns={columns}
                rowKey="accountId"
                loading={loading}
                pagination={false}
                rowClassName={(record) =>
                    selectedAccount === record.accountId ? "bg-green-100" : "bg-white"
                }
                onRow={(record) => ({
                    onClick: () => setSelectedAccount(record.accountId),
                })}
            />
            <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["8"]}
            />
        </div>
    );
};

export default AccountList;
