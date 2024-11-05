import './css/Village.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Village() {
    return (
        <div className='menu'>
            <p className='pageName'>거북이 마을</p>
            <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
        </div>
    )
}
