import React from 'react';
import ReactDOM from 'react-dom/client'; // Обратите внимание на импорт
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Создаем корень
root.render(<App />);