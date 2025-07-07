import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService";

const defaultUser = {
  username: "",
  first_name: "",
  name: "",
  birth_date: "",
  phone: "+7",
  email: "",
  department: "",
  position: "",
  password: "",
  status: "active",
  account_type: "user",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(defaultUser);

  const itemsPerPage = 10;
  const totalPages = Math.ceil((users?.length || 0) / itemsPerPage);
  const paginatedData = (users || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const data = Array.isArray(response) ? response : [];
      setUsers(data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      alert("Не удалось загрузить пользователей");
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.username || (!newUser.password && !newUser.id)) {
      alert("Пожалуйста, заполните как минимум Логин и Пароль для создания");
      return;
    }

    setLoading(true);
    try {
      if (newUser.id) {
        // Очистка пустых полей перед обновлением
        const cleanedUser = {};
        Object.keys(newUser).forEach((key) => {
          const value = newUser[key];
          if (value !== "" && value != null) {
            cleanedUser[key] = value;
          }
        });
        await updateUser(newUser.id, cleanedUser);
        alert("Пользователь успешно отредактирован");
      } else {
        await createUser(newUser);
        alert("Пользователь успешно создан");
      }
      setShowModal(false);
      fetchUsers();
      setNewUser(defaultUser);
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
      alert(`Ошибка: ${error?.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      id: user.id,
      username: user.username,
      first_name: user.first_name || "",
      name: user.name || "",
      birth_date: user.birth_date || "",
      phone: user.phone || "+7",
      email: user.email || "",
      department: user.department || "",
      position: user.position || "",
      password: "",
      status: user.status,
      account_type: user.account_type || "user",
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Удалить пользователя ${user.username}?`)) {
      try {
        await deleteUser(user.id);
        alert("Пользователь удален");
        fetchUsers();
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        alert("Не удалось удалить пользователя");
      }
    }
  };

  const columns = [
    { key: "username", label: "Логин" },
    { key: "first_name", label: "Имя" },
    { key: "name", label: "Фамилия" },
    {
      key: "birth_date",
      label: "Дата рождения",
      render: (value) => value ? new Date(value).toLocaleDateString("ru-RU") : "",
    },
    { key: "phone", label: "Телефон" },
    { key: "email", label: "Почта" },
    { key: "department", label: "Отдел" },
    { key: "position", label: "Должность" },
    {
      key: "account_type",
      label: "Тип учётной записи",
      render: (value) => (
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            value === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {value === "admin" ? "Администратор" : "Пользователь"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Статус",
      render: (value) => (
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active" ? "Активен" : "Уволен"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={() => {
          setNewUser(defaultUser);
          setShowModal(true);
        }}>
          Добавить пользователя
        </Button>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-grow overflow-y-auto">
          <Table
            data={paginatedData}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="border-t border-gray-200 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewUser(defaultUser);
        }}
        title={newUser.id ? "Редактировать пользователя" : "Добавить пользователя"}
      >
        <div className="flex flex-col gap-2">
          <input
            className="border p-2 rounded text-sm"
            placeholder="Логин"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Имя"
            value={newUser.first_name}
            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Фамилия"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            type="date"
            placeholder="Дата рождения"
            value={newUser.birth_date}
            onChange={(e) => setNewUser({ ...newUser, birth_date: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Телефон"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Почта"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Отдел"
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
          />
          <input
            className="border p-2 rounded text-sm"
            placeholder="Должность"
            value={newUser.position}
            onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
          />
          <select
            className="border p-2 rounded text-sm"
            value={newUser.account_type}
            onChange={(e) => setNewUser({ ...newUser, account_type: e.target.value })}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
          <input
            className="border p-2 rounded text-sm"
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="border p-2 rounded text-sm"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option value="active">Активен</option>
            <option value="inactive">Уволен</option>
          </select>
          <Button
            onClick={handleCreateUser}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;