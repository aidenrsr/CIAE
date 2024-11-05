import './css/Home.css';
import React from 'react';
import { Link } from 'react-router-dom';  // Link 컴포넌트 가져오기


export default function Home() {
    return (
        <div>
            <div className='menu'>
                <p className='helloWorld'>안녕하세요, <br/>
                    저희는 CIAE입니다.</p>
                <p className='pageName'>홈 화면</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
            </div>
        </div>
    );
}