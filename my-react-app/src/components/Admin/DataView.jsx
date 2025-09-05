import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import { fetchData, fetchTableStructure, deleteData } from '../js/admin';
import styles from './dataView.module.css';

export const DataView = () => {
  const [tables, setTables] = useState({}); // Хранит структуру всех таблиц
  const [currentTable, setCurrentTable] = useState(''); // Текущая выбранная таблица
  const [data, setData] = useState([]); // Данные текущей таблицы
  const [errorMessage, setErrorMessage] = useState('');

  // Загружаем структуру таблиц при загрузке компонента
  useEffect(() => {
    fetchTableStructure()
      .then((data) => {
        setTables(data);
        const firstTable = Object.keys(data)[0]; // Устанавливаем первую таблицу по умолчанию
        setCurrentTable(firstTable);
      })
      .catch((error) => setErrorMessage(error.message));
  }, []);

  // Загружаем данные текущей таблицы при её изменении
  useEffect(() => {
    if (currentTable) {
      setData([]); // Очищаем данные перед загрузкой новых
      fetchData(currentTable, setData).catch((error) => setErrorMessage(error.message));
    }
  }, [currentTable]);

  const handleDelete = async (id) => {
    try {
      await deleteData(currentTable, id, () => fetchData(currentTable, setData));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles['data-view-container']}>
      <header className={styles['header']}>
        <h1>Просмотр данных</h1>
        <div className={styles['table-switch']}>
          {Object.keys(tables).map((table) => (
            <button
              key={table}
              className={currentTable === table ? styles['active'] : ''}
              onClick={() => setCurrentTable(table)}
            >
              {table}
            </button>
          ))}
        </div>
      </header>

      <main className={styles['main-content']}>
        {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}

        <table className={styles['table']}>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id || item.wish_id || item.project_id || item.user_id}>
                {Object.values(item).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
                <td>
                  <button
                    className={styles['delete-btn']}
                    onClick={() => handleDelete(item.id || item.wish_id || item.project_id || item.user_id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Link to="/admin">
        <button className={styles['secondary-btn']}>Перейти к просмотру данных</button>
      </Link>
    </div>
  );
};