import './css/Turtle.css';
import React from 'react';
import { Link } from 'react-router-dom';

function WhereLink(props) {
    return(
        
        <Link to={props.to}>
            <div className={props.className}>
                <img src={props.src} className='Where_Link' alt={props.alt}></img>
                <p className='Where_Link_Text'>{props.text}</p>
            </div>
        </Link>

        
    )
}

export default function Turtle() {
    return(
        <div>
            <div className='menu'>
                <p className='pageName'>거북이 수족관</p>
                <p className='logOut'>로그아웃</p>
                <div className='Turtle_Background'>
                    <img src='/Road.png' className='Road' alt='SeaRoad'/>
                    <WhereLink className='UnderTheSea_LinkContainer' to='/DeepSea' src='/UnderTheSea_Link.png' alt='DeepSea' text='바닷속 마을' />
                    <WhereLink className='Forest_LinkContainer' to='/Forest' src='/Forest_Link.png' alt='Forest' text='숲속 마을' />
                    <WhereLink className='Sky_LinkContainer' to='/Sky' src='/Sky_Link.png' alt='Cloud' text='구름 마을' />
                    <WhereLink className='Space_LinkContainer' to='/Space' src='/Space_Link.png' alt='Space' text='우주 마을' />
                    
                </div>  
            </div>
        </div>
    )
}

