import axios from 'axios';

// Функция для получения токена из localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Функция для создания конфига запроса с авторизацией
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Функция для загрузки данных
export const fetchData = async (table, setData) => {
  try {
    const response = await axios.get(
      `/api/admin/${table.toLowerCase()}`,
      getAuthConfig()
    );
    setData(response.data);
  } catch (error) {
    console.error(`Ошибка при загрузке данных из таблицы ${table}:`, error);
    if (error.response?.status === 401) {
      // Перенаправляем на страницу входа при ошибке авторизации
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || 'Не удалось загрузить данные.');
  }
};

// Функция для добавления данных
export const addData = async (table, data, fetchCallback) => {
  try {
    await axios.post(
      `/api/admin/${table.toLowerCase()}`,
      data,
      getAuthConfig()
    );
    fetchCallback(); // Обновляем данные после добавления
  } catch (error) {
    console.error(`Ошибка при добавлении данных в таблицу ${table}:`, error);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || 'Не удалось добавить данные.');
  }
};

// Функция для удаления данных
export const deleteData = async (table, id, fetchCallback) => {
  try {
    await axios.delete(
      `/api/admin/${table.toLowerCase()}/${id}`,
      getAuthConfig()
    );
    fetchCallback(); // Обновляем данные после удаления
  } catch (error) {
    console.error(`Ошибка при удалении данных из таблицы ${table}:`, error);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || 'Не удалось удалить данные.');
  }
};

// Функция для обработки изменений в форме
export const handleInputChange = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// Функция для переключения таблиц
export const switchTable = (table, setTable, fetchCallback) => {
  setTable(table);
  fetchCallback();
};

// Функция для получения структуры таблиц
export const fetchTableStructure = async () => {
  try {
    const response = await axios.get('/api/tables', getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении структуры таблиц:', error);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || 'Не удалось загрузить структуру таблиц.');
  }
};

// Функция для обработки ошибок авторизации
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Добавляем перехватчик для ошибок авторизации
axios.interceptors.response.use(
  response => response,
  handleAuthError
);