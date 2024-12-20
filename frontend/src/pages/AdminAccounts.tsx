import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentListing from "@/components/StudentListing";

interface Account {
  id: number;
  email: string;
  role: string;
}

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<{
    email: string;
    role: string;
    password: string;
  }>({
    email: "",
    role: "",
    password: "",
  });
  const [editAccount, setEditAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/accounts",
        newAccount
      );
      setAccounts([...accounts, response.data]);
      setIsModalOpen(false);
      setNewAccount({ email: "", role: "", password: "" });
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/accounts/${id}`);
      setAccounts(accounts.filter((account) => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!editAccount) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/accounts/${editAccount.id}`,
        editAccount
      );
      setAccounts(
        accounts.map((account) =>
          account.id === editAccount.id ? response.data : account
        )
      );
      setEditAccount(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const openEditModal = (account: Account) => {
    setEditAccount(account);
    setIsModalOpen(true);
  };

  // Function to sort accounts by role
  const sortByRole = () => {
    const sorted = [...accounts].sort((a, b) => a.role.localeCompare(b.role));
    setAccounts(sorted);
  };

  return (
    <>
      <div className="nav">
        <AdminSidebar />
      </div>
      <AdminHeader />
      <div className="main container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Accounts</h1>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              onClick={sortByRole}
            >
              Sort by Role
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add Account
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {account.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {account.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {account.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    onClick={() => openEditModal(account)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogTitle>
              {editAccount ? "Update Account" : "Add New Account"}
            </DialogTitle>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editAccount ? editAccount.email : newAccount.email}
                onChange={(e) =>
                  editAccount
                    ? setEditAccount({ ...editAccount, email: e.target.value })
                    : setNewAccount({ ...newAccount, email: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={editAccount ? editAccount.role : newAccount.role}
                onChange={(e) =>
                  editAccount
                    ? setEditAccount({ ...editAccount, role: e.target.value })
                    : setNewAccount({ ...newAccount, role: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {!editAccount && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditAccount(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editAccount ? handleUpdateAccount : handleAddAccount}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                {editAccount ? "Update" : "Add"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <StudentListing />
    </>
  );
};

export default AdminAccounts;
