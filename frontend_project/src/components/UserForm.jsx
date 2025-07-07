import React from "react";
import { Button } from "../components/ui/button";

export default function UserForm({ onSubmit, onCancel, initialData = {} }) {
  const [username, setUsername] = React.useState(initialData.username || "");
  const [fullName, setFullName] = React.useState(initialData.full_name || "");
  const [status, setStatus] = React.useState(initialData.status || "active");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, full_name: fullName, status });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="ФИО"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="active">Активен</option>
        <option value="inactive">Неактивен</option>
      </select>
      <div className="flex gap-2">
        <Button type="submit">Сохранить</Button>
        <Button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
          Отмена
        </Button>
      </div>
    </form>
  );
}