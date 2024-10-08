DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS user_point;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS book_page;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,  -- Optional, as OAuth may not require a username
  email TEXT UNIQUE NOT NULL,  -- OAuth usually provides an email
  password TEXT,  -- Optional for OAuth users
  oauth_provider TEXT,  -- Name of the OAuth provider (e.g., Google, Facebook)
  oauth_user_id TEXT UNIQUE,  -- OAuth provider's unique user ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE badges (
  badge_id SERIAL PRIMARY KEY,
  badge_name TEXT NOT NULL,
  badge_image TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE user_point (
  user_id INTEGER REFERENCES users(user_id),
  points INTEGER NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE user_badges (
  user_id INTEGER REFERENCES users(user_id),
  badge_id INTEGER REFERENCES badges(badge_id),
  PRIMARY KEY (user_id, badge_id)  -- Composite primary key
);

CREATE TABLE book (
  book_id SERIAL PRIMARY KEY,
  book_name TEXT NOT NULL,
  book_author TEXT NOT NULL,
  book_page_num INTEGER NOT NULL,
  content TEXT NOT NULL,
  date_added DATE DEFAULT CURRENT_DATE
);

CREATE TABLE book_page (
  book_id INTEGER REFERENCES book(book_id),
  page_num INTEGER NOT NULL,
  page_text TEXT NOT NULL,
  page_pdf TEXT NOT NULL,
  PRIMARY KEY (book_id, page_num)  -- Composite primary key
);
