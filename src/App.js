import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Turtle from './components/Turtle';
import Learning from './components/Learning';
import Bookshelf from './components/Bookshelf';
import Home from './components/Home';
import Login from './components/Login';  // Import Login component

// 공통적인 List 컴포넌트
function List(props) {
  return (
    <li className={props.thing}>
      <Link to={props.route}>{props.name}</Link>
    </li>
  );
}

// 로고 컴포넌트
function Logo() {
  return (
    <li>
      <a href='/Home'><img className='logo' src='/CIAE로고 2.png' alt='logo' /></a>
    </li>
  );
}

function App() {
  // 현재 경로 확인
  const location = useLocation();
  
  // Learning 페이지나 Login 페이지에서 네비게이션을 숨김
  const isNavigationVisible = !(location.pathname === '/Learning' || location.pathname === '/Login');

  return (
      <div>
        {isNavigationVisible && (
          <nav>
            <ul className='navAll'>
              <Logo />
              <List route='/Bookshelf' name='내 서재' thing='bookshelf' />
              <List route='/Turtle' name='거북이 수족관' thing='turtle' />
              <List route='/Learning' name='독서 시작하기' thing='learning' />
            </ul>
          </nav>
        )}

        {/* 페이지별 라우팅 설정 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Bookshelf" element={<Bookshelf />} />
          <Route path="/Turtle" element={<Turtle />} />
          <Route path="/Learning" element={<Learning />} /> {/* Learning에서 네비게이션 바 숨김 */}
          <Route path="/Login" element={<Login />} />  {/* Add route for Login */}
        </Routes>
      </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}