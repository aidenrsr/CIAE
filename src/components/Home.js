import './css/Home.css';
import React from 'react';
import { Link } from 'react-router-dom';  // Link 컴포넌트 가져오기

function HomeComponent(props) {
    return(
        <Link to={props.to}>
            <section className={props.className}>
                <img src={props.src} className={props.classNameOfImage} alt={props.alt}></img>
                <p className={props.classNameOfText}>{props.text}</p>
            </section>
        </Link>       
    )
}

export default function Home() {
    return (
        <div>
            <div className='menu'>
                <p className='helloWorld'>안녕하세요, <br/>
                    저희는 CIAE입니다.</p>
                <p className='pageName'>홈 화면</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <article>
                    <HomeComponent 
                        to='Introduce'
                        className='Introduce'
                        classNameOfImage='IntroduceImage'
                        src='/Soju.jpeg'
                        classNameOfText='IntroduceText'
                        text='팀 CIAE(Cognitive Insight and Advancement for Empathy)는 통합디자인학과 이슬기, 
                        교육학과 이지혜, 컴퓨터과학과 류성로, 그리고 인공지능학과 김도혁, 안민용, 정대철로 구성된 팀입니다. 
                        이들은 ADHD를 가진 십대 청소년의 독해력과 공감 능력을 향상시키기 위한 프로그램을 개발하고 있습니다.'
                    />
                    <HomeComponent
                        to='Project'
                        className='Project'
                        classNameOfImage='ProjectImage'
                        src='/Project.jpeg'
                        classNameOfText='ProjectText'
                        text='우리의 프로그램 설명'
                    />
                    <HomeComponent
                        to='Project2'
                        className='Project2'
                        classNameOfImage='ProjectImage2'
                        src='/Project.jpeg'
                        classNameOfText='ProjectText2'
                        text='우리의 프로그램 설명'
                    />
                </article>
            </div>
        </div>
    );
}