import React from 'react';
import './css/Membership.css';
import { Link } from 'react-router-dom';

export default function Membership() {
    return (
        <div>
            <Link to='/Home'><img className='CIAELogo' src='/CIAE로고 2.png' alt='CIAE'/></Link>
            <div className='JoinWon'>
                <p className='SetNickname'> 1. 닉네임을 설정해주세요 </p>
                <form>
                    <input className='NameAndPassword' type='' />
                </form>
                <button className=''/>
            </div>
        </div>
    )
}
