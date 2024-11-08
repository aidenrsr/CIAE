import './css/Recommend.css';
import React from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Link } from 'react-router-dom';

// 버튼 컴포넌트 정의
function Button({ name, src, alt, onClick }) {
    return <Link to='/Learning'><img src={src} className={name} alt={alt} onClick={onClick} /></Link>; // 이미지 버튼 생성
}

// PDF 문서 보기 및 탐색을 위한 컴포넌트
function Reading() {
    return (
        <>  
            <Link to='/Home'><img className='CIAELogo' src='/CIAE로고 2.png' alt='CIAE'/></Link>
            <div className='RecommendBar'>
                <p className='NewBookMent'>다른 책을 읽고 싶다면?</p>
                <div className='RecommendBook1'/>
                <div className='RecommendBook2'/>
                <div className='RecommendBook3'/>
            </div>
            <div className='MainBook'/>
            <p className='Irecommend'>읽을 만한 책을 추천해줄게요!</p>
            <Button
                name='Reading'
                src='/Reading.png'
                alt="Left navigation button"// 왼쪽 화살표 버튼으로 이전 페이지로 이동
            />
        </>
    );
}


export default function Learning() {
    return (
        <div>
                <Reading />
        </div>
    );
}


