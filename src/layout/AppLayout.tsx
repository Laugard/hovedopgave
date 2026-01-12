// src/layout/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        <TopBar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
