import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import { addData, handleInputChange, switchTable, fetchTableStructure } from '../js/admin';
import styles from './admin.module.css';
import { Editor } from '@tinymce/tinymce-react';

export const Admin = () => {
  const [currentTable, setCurrentTable] = useState('');
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [tables, setTables] = useState({}); // Хранит структуру таблиц
  const editorRef = useRef(null); // Реф для TinyMCE

  useEffect(() => {
    // Загружаем структуру таблиц при загрузке компонента
    fetchTableStructure()
      .then((data) => {
        setTables(data);
        const firstTable = Object.keys(data)[0]; // Устанавливаем первую таблицу по умолчанию
        setCurrentTable(firstTable);
      })
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Получаем контент из редактора
    const content = editorRef.current ? editorRef.current.getContent() : '';

    try {
      await addData(currentTable, { ...formData, content }, () => {});
      setFormData({});
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const renderFormFields = () => {
    if (!currentTable || !tables[currentTable]) return null;

    return tables[currentTable].map((field) => {
      const { column, type } = field;

      // Пропускаем системные поля, если нужно
      if (['id', 'created_at', 'updated_at'].includes(column)) return null;

      if (column === 'content') {
        // Если это поле для текста, используем TinyMCE
        return (
          <div key={column}>
            <label>{column}</label>
            <Editor
              apiKey="55jph7t58axoi1jainy1onksuizxa6ttcd6l5omm3jiigf1m"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue=""
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                  'image', // Плагин для изображений
                  'table', // Плагин для таблиц
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | image | table | help',
                images_upload_url: '/api/upload-image', // URL для загрузки изображений
                automatic_uploads: true,
                file_picker_types: 'image',
                file_picker_callback: (cb, value, meta) => {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');
                  input.onchange = async () => {
                    const file = input.files[0];
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('/api/upload-image', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await response.json();
                    cb(data.location, { title: file.name });
                  };
                  input.click();
                },
              }}
            />
          </div>
        );
      }

      return (
        <div key={column}>
          <label>{column}</label>
          {type === 'text' || type === 'character varying' ? (
            <input
              type="text"
              name={column}
              placeholder={column}
              value={formData[column] || ''}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          ) : type === 'integer' || type === 'numeric' ? (
            <input
              type="number"
              name={column}
              placeholder={column}
              value={formData[column] || ''}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          ) : type === 'boolean' ? (
            <select
              name={column}
              value={formData[column] || 'false'}
              onChange={(e) => handleInputChange(e, setFormData)}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            <input
              type="text"
              name={column}
              placeholder={column}
              value={formData[column] || ''}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className={styles['admin-container']}>
      <header className={styles['admin-header']}>
        <h1>Административная панель</h1>
        <div className={styles['user-info']}>
          <span>Администратор</span>
          <button id="logout-btn" className={styles['logout-btn']}>Выйти</button>
          {/* Кнопка для перехода на страницу DataView */}
          <Link to="/admin/data-view">
            <button className={styles['secondary-btn']}>Перейти к просмотру данных</button>
          </Link>
        </div>
      </header>

      <div className={styles['admin-content']}>
        <aside className={styles['sidebar']}>
          <nav>
            <ul className={styles['menu']}>
              {Object.keys(tables).map((table) => (
                <li
                  key={table}
                  className={`${styles['menu-item']} ${currentTable === table ? styles['active'] : ''}`}
                  onClick={() => switchTable(table, setCurrentTable, () => {})}
                >
                  {table}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className={styles['main-content']}>
          <h2>Добавление записи в таблицу: {currentTable}</h2>

          <form onSubmit={handleFormSubmit} className={styles['form']}>
            {renderFormFields()}
            <button type="submit" className={styles['primary-btn']}>Добавить запись</button>
          </form>

          {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
        </main>
      </div>
    </div>
  );
};