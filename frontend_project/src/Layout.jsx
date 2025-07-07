import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#E7E7E7]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 mt-2 mb-2 mx-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}