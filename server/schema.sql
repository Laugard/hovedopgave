-- Bilka HowTo Guide - PostgreSQL schema

CREATE TABLE IF NOT EXISTS payroll_allowlist (
  id              SERIAL PRIMARY KEY,
  payroll_number  VARCHAR(32) UNIQUE NOT NULL,
  role            VARCHAR(16) NOT NULL DEFAULT 'EMPLOYEE', -- EMPLOYEE | APPROVER | ADMIN
  is_approved     BOOLEAN NOT NULL DEFAULT false,
  is_activated    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  payroll_number  VARCHAR(32) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            VARCHAR(16) NOT NULL DEFAULT 'EMPLOYEE',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id        SERIAL PRIMARY KEY,
  slug      VARCHAR(64) UNIQUE NOT NULL,
  title     VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id           SERIAL PRIMARY KEY,
  category_id  INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  slug         VARCHAR(128) NOT NULL,
  title        VARCHAR(256) NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS guide_versions (
  id            SERIAL PRIMARY KEY,
  guide_id      INT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  version_no    INT NOT NULL,
  quick_answer  TEXT NOT NULL DEFAULT '',
  steps         TEXT NOT NULL DEFAULT '',
  troubleshooting TEXT NOT NULL DEFAULT '',
  escalation    TEXT NOT NULL DEFAULT '',
  created_by    INT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(guide_id, version_no)
);

CREATE TABLE IF NOT EXISTS tags (
  id     SERIAL PRIMARY KEY,
  slug   VARCHAR(64) UNIQUE NOT NULL,
  title  VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS guide_tags (
  guide_id INT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  tag_id   INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, tag_id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id        SERIAL PRIMARY KEY,
  guide_id  INT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message   TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suggestions (
  id        SERIAL PRIMARY KEY,
  guide_id  INT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title     VARCHAR(256) NOT NULL,
  proposed_changes TEXT NOT NULL,
  status    VARCHAR(16) NOT NULL DEFAULT 'OPEN', -- OPEN | APPROVED | REJECTED
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approvals (
  id            SERIAL PRIMARY KEY,
  suggestion_id INT UNIQUE NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
  approver_user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  decision      VARCHAR(16) NOT NULL, -- APPROVED | REJECTED
  comment       TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
