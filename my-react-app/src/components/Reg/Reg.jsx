import React, { useEffect, useState } from 'react';
import './Reg.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ButtonVariant1 } from '../props/props';
import { handleSubmit } from '../js/regForm.js';

export const Reg = ({ className, ...props }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className="regContainer">
            <div className="frame-125">
                <div className="div">Регистрация</div>
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
                    Подпишитесь на доступ к уникальным возможностям нашей платформы, включая различные варианты финансирования ваших инициатив и профессиональные консультации. Заполните регистрационную форму, чтобы присоединиться к сообществу социальной поддержки!
                    </div>
                    <form 
                        onSubmit={(event) => handleSubmit(event, { username, email, password, confirmPassword })} 
                        className="form" 
                        autoComplete="off" // Отключение автозаполнения для всей формы
                    >
                        <input 
                            className="formGroup" 
                            placeholder="Почта"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="nope" // Используем нестандартное значение
                            required
                        />
                        <input 
                            className="formGroup" 
                            placeholder="Имя"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="nope" // Используем нестандартное значение
                            required
                        />
                        <input 
                            className="formGroup" 
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password" // Рекомендуемое значение для паролей
                            required
                        />
                        <input 
                            className="formGroup" 
                            placeholder="Подтвердить пароль"
                            type="password"
                            id="confirm_password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password" // Рекомендуемое значение для паролей
                            required
                        />
                        <ButtonVariant1 text="Регистрация" />
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
};
