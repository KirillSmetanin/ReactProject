import React, { useEffect, useState } from 'react';
import './Auf.css';
import 'aos/dist/aos.css';
import {ButtonVariant1, ButtonVariant2} from '../props/props'
import { loginUser } from '../js/aufForm.js';

export const Auf = ({ className, ...props }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="aufContainer">
            <div className="frame-125">
                <div className="div">Авторизация</div>
            </div>
            <div className="contener-6">
                <img className="frame-140" src="contener-60.png" />
                <div className="frame-142">
                <div className="frame-56">
                    <div className="frame-49">
                    <img src="Frame49.png"></img>
                    </div>
                    <div className="div2">Получите наши эксклюзивные возможности</div>
                    <div className="div3">
                    С возвращением! Войдите в свой аккаунт, чтобы продолжить работу с финансированием, консультациями и поддержкой ваших социальных инициатив.
                    </div>
                    <form onSubmit={(event) => loginUser(event, { email, password })} className={`form`}>
                        <input className="formGroup" placeholder='Почта'
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input className="formGroup" placeholder='Пароль'
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <ButtonVariant1 text="Вход"/>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
};