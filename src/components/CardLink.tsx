// src/components/CardLink.tsx
import React from "react";
import { Link } from "react-router-dom";

export function CardLink(props: {
  title: string;
  description?: string;
  to: string;
  rightTag?: string;
  actions?: React.ReactNode;
}) {
  const { title, description, to, rightTag, actions } = props;

  return (
    <div className="card">
      <div className="card__body">
        <div className="card__top">
          <div className="card__title">{title}</div>
          {rightTag ? <div className="pill">{rightTag}</div> : null}
        </div>
        {description ? <div className="card__desc">{description}</div> : null}
        <div className="card__actions">
          <Link className="btn btn--primary" to={to}>
            Åbn
          </Link>
          {actions}
        </div>
      </div>
    </div>
  );
}
