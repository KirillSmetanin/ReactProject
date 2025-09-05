import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        // Удаление данных из localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = 'http://localhost:5000/login';
    };

    useEffect(() => {
        const checkAdmin = async () => {
        try {
            const response = await axios.get('/api/auth/check-admin', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            });
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            setIsAdmin(false);
        }
        };

        checkAdmin();
    }, []);

    return (
        <header className="header">
            <div className="logo-container">
                <img className="header-icon" src="/Logo.svg" alt="Логотип" />
            </div>
            <div className="namelogo">ПоддержиГероев.рф</div>
            <nav className="header-menu">
                <a href="/" className="menu-item">Главная</a>
                <a href="/sbor" className="menu-item">Краудфандинг</a>
                <a href="/kp" className="menu-item">Образование</a>
                <a href="/wishes" className="menu-item">Пожелания</a>
                {userId && <a href="/create" className="menu-item">Создать стартап</a>}
                {!userId && <a href="/register" className="menu-item">Регистрация</a>} 
                {!userId && <a href="/login" className="menu-item">Авторизация</a>} 
                {isAdmin && (
                    <>
                        <Link to="/admin" className="menu-item">Админка</Link>
                        <Link to="/admin/data-view" className="menu-item">Данные</Link>
                    </>
                )}
                {userId && <a href="/profile" className="menu-item">Профиль</a>}
                {userId && (
                    <button onClick={handleLogout} className="menu-item">
                        Выйти
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
