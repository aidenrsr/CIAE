import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Turtle from './components/Turtle';
import Learning from './components/Learning';
import Bookshelf from './components/Bookshelf';
import Home from './components/Home';
import Login from './components/Login';  // Import Login component
import DeepSea from './components/TurtleVillage/DeepSea';  // Add this import
import Space from './components/TurtleVillage/Space';  // Add this import
import Sky from './components/TurtleVillage/Sky';  // Add this import
import Forest from './components/TurtleVillage/Forest';  // Add this import
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
  
  // Update this condition to include DeepSea
  const hideBackgroundPaths = ['/Learning', '/Login'];
  const hideNavPaths = ['/Learning', '/Login'];
  const showNav = !hideNavPaths.includes(location.pathname);
  const showBackground = !hideBackgroundPaths.includes(location.pathname);
  return (
      <div>
        {showBackground && (
          <div className='Main'>
            <img src='/MainBackground.png' className='MainBackground' alt='MainBackground'/>
            {showNav && (
            <nav>
              <ul className='navAll'>
                <Logo />
                <List route='/Bookshelf' name='내 서재' thing='bookshelf' />
                <List route='/Turtle' name='거북이 미니게임' thing='turtle' />
                <List route='/Learning' name='독서 시작하기' thing='learning' />
              </ul>
            </nav>
        )}
          </div>)}
        {/* 페이지별 라우팅 설정 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Bookshelf" element={<Bookshelf />} />
          <Route path="/Turtle" element={<Turtle />} />
          <Route path="/Learning" element={<Learning />} /> {/* Learning에서 네비게이션 바 숨김 */}
          <Route path="/Login" element={<Login />} />  {/* Add route for Login */}
          <Route path="/DeepSea" element={<DeepSea />} />  {/* Add this route */}
          <Route path="/Space" element={<Space />} />  {/* Add this route */}
          <Route path="/Sky" element={<Sky />} />  {/* Add this route */}
          <Route path="/Forest" element={<Forest />} />  {/* Add this route */}
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