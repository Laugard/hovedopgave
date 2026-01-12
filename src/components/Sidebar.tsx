// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">B</div>
        <div>
          <div className="sidebar__title">Bilka Guide</div>
          <div className="sidebar__sub">Intern platform</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink className={({ isActive }) => "navitem" + (isActive ? " navitem--active" : "")} to="/app">
          Forside
        </NavLink>
        <NavLink className={({ isActive }) => "navitem" + (isActive ? " navitem--active" : "")} to="/app/guides">
          Guides
        </NavLink>
        <NavLink
          className={({ isActive }) => "navitem" + (isActive ? " navitem--active" : "")}
          to="/app/feedback"
        >
          Forslag & feedback
        </NavLink>
        <NavLink className={({ isActive }) => "navitem" + (isActive ? " navitem--active" : "")} to="/app/admin">
          Admin
        </NavLink>
      </nav>

      <div className="sidebar__tip">
        Tip: Alt indhold er beskyttet bag login.
      </div>
    </aside>
  );
}
