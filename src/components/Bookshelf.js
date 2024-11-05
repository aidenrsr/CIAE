import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Bookshelf.css";

function Books(props) {
  return (
    <li className="booklist">
      <a href={props.href}>
        <img className="booksImg" src={props.src} alt={props.bookName} />
      </a>
      <p>책 이름: {props.bookName}</p>
      <p>책 길이: {props.pageNum}</p>
    </li>
  );
}

function Yet() {
  return <li className="yet" />;
}

export default function Bookshelf() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div className="menu">
        <p className="pageName">내 서재</p>
        <p className="logOut">로그아웃</p>
        <ul className="bookStorage1">
          {books.map((book, index) => (
            <Books
              key={index}
              src="/"
              bookName={book[0]}
              pageNum={book[1]}
              href="/Learning"
            />
          ))}
          <Yet />
          <Yet />
          <Yet />
        </ul>
        <ul className="bookStorage2">
          <Yet />
          <Yet />
          <Yet />
          <Yet />
        </ul>
      </div>
    </div>
  );
}
