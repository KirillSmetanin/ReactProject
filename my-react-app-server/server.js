require('dotenv').config(); // Подключение dotenv
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express(); // Создаём экземпляр приложения
const PORT = process.env.PORT || 3001;

app.use(cors()); // Подключаем CORS после создания экземпляра приложения

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Обслуживание папки uploads как статической

app.use((req, res, next) => {
  console.log(`Получен запрос: ${req.method} ${req.url}`);
  next();
});

// Подключение к базе данных
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to database');
  }
});

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Используйте свой почтовый сервис
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Настройка multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для сохранения изображений
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла до 5 МБ
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Недопустимый тип файла'));
    }
    cb(null, true);
  },
});

function generateToken(email, userId, role) {
  const secret = process.env.JWT_SECRET; // Используем секретный ключ из .env
  const token = jwt.sign({ email, userId, role }, secret);
  return token;
}

// Добавляем middleware для проверки JWT и роли
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'Администратор') {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  next();
};

app.post('/api/register', async (req, res) => {
  console.log('Данные тела запроса:', req.body);

  const { username, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send("Пароли не совпадают");
  }

  const existingUser = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

  if (existingUser.rows.length > 0) {
    return res.status(400).send("Пользователь с таким email уже существует");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(200).send("Регистрация успешна!");
  } catch (error) {
    console.error('Ошибка при выполнении запроса к базе данных:', error);
    res.status(500).send("Ошибка регистрации пользователя");
  }
});

app.get('/api/auth/check-admin', authenticateJWT, checkAdmin, (req, res) => {
  res.json({ isAdmin: true });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя в базе данных по email
    const query = 'SELECT * FROM Users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).send('Пользователь с таким email не найден');
    }

    const user = result.rows[0];

    // Сравнение паролей
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      // Генерация токена на основе email и id пользователя
      const token = generateToken(email, user.user_id, user.role);
      // Отправка токена и id пользователя клиенту
      res.send({ token, userId: user.user_id, role: user.role });
    } else {
      // Неверный пароль
      res.status(401).send('Неверный пароль');
    }
  } catch (error) {
    console.error('Ошибка при входе в аккаунт:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.post('/api/projects', upload.single('photo'), async (req, res) => {
  const {
    user_id,
    name,
    shortdescription,
    description,
    goal_amount,
    raised_amount,
    end_date,
    category,
    news
  } = req.body;
  const photo = req.file ? req.file.filename : null;
  const status = 'Активно';
  const currentDateTime = new Date().toISOString();

  try {
    const query = `
      INSERT INTO Projects (
        user_id, title, shortdescription, content, goal_amount, raised_amount, end_date, status, category, photo, created_at, updated_at, news
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`;
    const values = [
      user_id, name, shortdescription, description, goal_amount, raised_amount, end_date, status, category, photo, currentDateTime, currentDateTime, news
    ];

    const result = await pool.query(query, values);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

// Обновление профиля
app.post('/api/updateProfile', upload.single('photo'), async (req, res) => {
  const { user_id, name, description } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null; // Сохранение относительного пути

  try {
    const userIdInt = parseInt(user_id, 10);
    if (isNaN(userIdInt)) {
      throw new Error('Invalid user_id');
    }

    let query, values;

    if (photo) {
      query = `
        UPDATE Users
        SET username = $1, bio = $2, profile_picture = $3
        WHERE user_id = $4
        RETURNING *;`;
      values = [name, description, photo, userIdInt];
    } else {
      query = `
        UPDATE Users
        SET username = $1, bio = $2
        WHERE user_id = $3
        RETURNING *;`;
      values = [name, description, userIdInt];
    }

    const result = await pool.query(query, values);
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      throw new Error('Invalid userId');
    }

    const query = `
      WITH user_stats AS (
        SELECT
          u.user_id,
          u.username AS name,
          u.bio AS description,
          u.profile_picture AS photo,
          COUNT(p.project_id) AS projects,
          COALESCE(ul.points, 0) AS points,
          u.role
        FROM Users u
        LEFT JOIN Projects p ON u.user_id = p.user_id
        LEFT JOIN UserLevels ul ON u.user_id = ul.user_id
        WHERE u.user_id = $1
        GROUP BY u.user_id, ul.points
      ),
      current_level AS (
        SELECT 
          us.*,
          l.level_id,
          l.level_name,
          l.min_points AS current_min
        FROM user_stats us
        LEFT JOIN Levels l ON l.min_points <= us.points
        ORDER BY l.min_points DESC
        LIMIT 1
      ),
      next_level AS (
        SELECT 
          cl.*,
          l.min_points AS next_min
        FROM current_level cl
        LEFT JOIN Levels l ON l.min_points > cl.points
        ORDER BY l.min_points ASC
        LIMIT 1
      )
      SELECT
        name,
        description,
        photo,
        projects,
        points,
        COALESCE(level_name, 'Новичок') AS level,
        CASE
          WHEN next_min IS NULL THEN 100
          WHEN current_min IS NULL THEN ROUND((points * 100.0 / NULLIF(next_min, 0)))::integer
          ELSE ROUND(((points - current_min) * 100.0 / NULLIF(next_min - current_min, 0)))::integer
        END AS progressPercentage,
        role
      FROM next_level;
    `;

    const result = await pool.query(query, [userIdInt]);
    const userProfile = result.rows[0] || {
      name: '',
      description: '',
      photo: '',
      projects: 0,
      points: 0,
      level: 'Новичок',
      progressPercentage: 0,
      role: 'Пользователь'
    };

    if (userProfile.photo) {
      userProfile.photo = `${req.protocol}://${req.get('host')}${userProfile.photo}`;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Ошибка при загрузке данных профиля:', error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.get('/api/getprojects', async (req, res) => {
  const { search, category, sort } = req.query;

  try {
    let query = `
      SELECT 
        P.project_id, 
        P.title AS project_name, 
        P.shortdescription AS short_description, 
        P.photo AS project_image, 
        P.goal_amount AS goal_amount, 
        P.raised_amount AS raised_amount, 
        P.category AS category,
        P.created_at AS created_at,
        U.username AS creator_name
      FROM Projects P
      JOIN Users U ON P.user_id = U.user_id
      WHERE 1=1`; // Базовый запрос

    const values = [];

    if (search) {
      query += ` AND (P.title ILIKE $${values.length + 1} OR P.shortdescription ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }

    if (category) {
      query += ` AND P.category = $${values.length + 1}`;
      values.push(category);
    }

    if (sort) {
      if (sort === 'По дате') {
        query += ` ORDER BY P.created_at DESC`;
      } else if (sort === 'По популярности') {
        query += ` ORDER BY P.raised_amount DESC`;
      } else if (sort === 'По сумме') {
        query += ` ORDER BY P.goal_amount DESC`;
      }
    }

    const result = await pool.query(query, values);

    // Форматируем URL изображений для каждого проекта
    const projectsWithFormattedImages = result.rows.map(project => {
      if (project.project_image) {
        return {
          ...project,
          project_image: `${req.protocol}://${req.get('host')}/uploads/${project.project_image}`
        };
      }
      return project;
    });

    res.status(200).send(projectsWithFormattedImages);
  } catch (error) {
    console.error('Ошибка при получении данных проектов:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.get('/api/userprojects/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    let query = `
      SELECT 
        P.project_id, 
        P.title AS project_name, 
        P.shortdescription AS short_description, 
        P.photo AS project_image, 
        P.goal_amount AS goal_amount, 
        P.raised_amount AS raised_amount, 
        P.category AS category,
        U.username AS creator_name,
        U.user_id AS userID
      FROM Projects P
      JOIN Users U ON P.user_id = U.user_id
      WHERE U.user_id = $1`; // Запрос для получения всех проектов пользователя

    const values = [userId];

    const result = await pool.query(query, values);

    // Добавляем полный URL к каждому проекту, если поле photo не пустое
    const projects = result.rows.map(project => {
      if (project.project_image) {
        project.project_image = `${req.protocol}://${req.get('host')}/uploads/${project.project_image}`;
      }
      return project;
    });

    res.status(200).send(projects);
  } catch (error) {
    console.error('Ошибка при получении данных проектов пользователя:', error);
    res.status(500).send('Что-то пошло не так');
  }
});


app.get('/api/PRcategories', async (req, res) => {
  try {
    const query = `SELECT DISTINCT category FROM Projects`;
    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.get('/api/PGcategories', async (req, res) => {
  try {
    const query = `SELECT DISTINCT category FROM Pages`;
    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.get('/api/getproject/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const projectQuery = `
      SELECT 
        P.project_id, 
        P.title AS project_name, 
        P.shortdescription AS short_description, 
        P.content AS full_description, 
        P.photo AS project_image, 
        P.goal_amount AS goal_amount, 
        P.raised_amount AS raised_amount, 
        P.category AS category,
        U.username AS creator_name,
        U.profile_picture AS profile_image,
        P.created_at,
        P.end_date,
        p.news,
        U.email AS email_user

      FROM Projects P
      JOIN Users U ON P.user_id = U.user_id
      WHERE P.project_id = $1`;

    const projectValues = [projectId];

    const projectResult = await pool.query(projectQuery, projectValues);

    if (projectResult.rows.length > 0) {
      const project = projectResult.rows[0];

      const supportQuery = `
        SELECT COUNT(*) AS support_count
        FROM Backings
        WHERE project_id = $1`;
      const supportValues = [projectId];

      const supportResult = await pool.query(supportQuery, supportValues);
      const supportCount = supportResult.rows[0].support_count;

      if (project.project_image) {
        project.project_image = `${req.protocol}://${req.get('host')}/uploads/${project.project_image}`;
      }

      project.support_count = supportCount; // Добавляем количество поддержек к проекту

      res.status(200).send(project);
    } else {
      res.status(404).send('Проект не найден');
    }
  } catch (error) {
    console.error('Ошибка при получении данных проекта:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

app.post('/api/remindProjectEnd', async (req, res) => {
  const { email, endDate, projectName } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Напоминание об окончании проекта',
      text: `Проект "${projectName}" заканчивается ${endDate}. Не забудьте проверить его статус!`
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Напоминание отправлено успешно!');
    });
  } catch (error) {
    console.error('Ошибка при отправке напоминания:', error);
    res.status(500).send('Что-то пошло не так');
  }
});

// Маршрут для получения структуры таблиц
app.get('/api/tables', async (req, res) => {
  try {
    const query = `
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const result = await pool.query(query);

    const tables = result.rows.reduce((acc, row) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = [];
      }
      acc[row.table_name].push({ column: row.column_name, type: row.data_type });
      return acc;
    }, {});

    res.status(200).json(tables);
  } catch (error) {
    console.error('Ошибка при получении структуры таблиц:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении структуры таблиц' });
  }
});

// Универсальный маршрут для работы с таблицами
app.get('/api/admin/:table', authenticateJWT, checkAdmin, async (req, res) => {
  const { table } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM ${table}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Ошибка при получении данных из таблицы ${table}:`, error);
    res.status(500).json({ message: `Ошибка сервера при получении данных из таблицы ${table}` });
  }
});

// Универсальный маршрут для добавления данных в таблицу
app.post('/api/admin/:table', authenticateJWT, checkAdmin, async (req, res) => {
  const { table } = req.params;
  const data = req.body;

  try {
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`Ошибка при добавлении данных в таблицу ${table}:`, error);
    res.status(500).json({ message: `Ошибка сервера при добавлении данных в таблицу ${table}` });
  }
});

// Универсальный маршрут для удаления данных из таблицы
app.delete('/api/admin/:table/:id', authenticateJWT, checkAdmin, async (req, res) => {
  const { table, id } = req.params;

  // Карта соответствий таблиц и их идентификаторов
  const tableIdMap = {
    wishes: 'wish_id',
    projects: 'project_id',
    users: 'user_id',
    backings: 'backing_id',
    comments: 'comment_id',
    achievements: 'achievement_id',
    levels: 'level_id',
    userlevels: 'user_level_id',
    actions: 'action_id',
    useractions: 'user_action_id',
    joblistings: 'job_id',
    medicalassistance: 'request_id',
    donationpoints: 'point_id',
    expensereports: 'report_id',
    pages: 'page_id',
  };

  try {
    // Проверяем, есть ли таблица в карте
    const columnName = tableIdMap[table.toLowerCase()];
    if (!columnName) {
      return res.status(400).json({ message: `Таблица "${table}" не поддерживается` });
    }

    // Проверяем, что id передан и является числом
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Некорректный идентификатор записи' });
    }

    // Выполняем запрос на удаление
    const query = `DELETE FROM ${table} WHERE ${columnName} = $1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    res.status(200).json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error(`Ошибка при удалении данных из таблицы ${table}:`, error);
    res.status(500).json({ message: `Ошибка сервера при удалении данных из таблицы ${table}` });
  }
});

app.post('/api/wishes', async (req, res) => {
  const { content, user_id, is_anonymous } = req.body;

  try {
    let author_mail = null;

    // Если пожелание не анонимное, извлекаем email пользователя
    if (!is_anonymous) {
      const userQuery = `SELECT email FROM Users WHERE user_id = $1`;
      const userResult = await pool.query(userQuery, [user_id]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      author_mail = userResult.rows[0].email;
    }

    // Вставляем пожелание в таблицу Wishes
    const query = `
      INSERT INTO Wishes (description, author_mail, is_anonymous)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [content, author_mail, is_anonymous];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении пожелания:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении пожелания' });
  }
});

// Создание записи о поддержке
app.post('/api/create-backing', authenticateJWT, async (req, res) => {
  try {
    const { project_id, amount } = req.body;
    const user_id = req.user.userId;

    const result = await pool.query(
      `INSERT INTO Backings (project_id, user_id, amount, payment_status)
             VALUES ($1, $2, $3, 'pending')
             RETURNING *`,
      [project_id, user_id, amount]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании записи о поддержке:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Подтверждение платежа
app.post('/api/confirm-payment', authenticateJWT, async (req, res) => {
  try {
    const { backing_id, status } = req.body;

    // Обновляем статус платежа
    await pool.query(
      `UPDATE Backings SET payment_status = $1 WHERE backing_id = $2`,
      [status, backing_id]
    );

    // Обновляем собранную сумму в проекте
    await pool.query(
      `UPDATE Projects p
             SET raised_amount = (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM Backings
                 WHERE project_id = p.project_id AND payment_status = 'completed'
             )
             WHERE project_id = (
                 SELECT project_id FROM Backings WHERE backing_id = $1
             )`,
      [backing_id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при подтверждении платежа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех страниц с фильтрацией, поиском и сортировкой
app.get('/api/pages', async (req, res) => {
  const { search, category, sort } = req.query;

  try {
    let query = `
      SELECT 
        page_id, 
        title, 
        category, 
        short_description, 
        content, 
        image_url, 
        created_at, 
        updated_at
      FROM Pages
      WHERE 1=1`;

    const values = [];

    if (search && search.trim() !== '') {
      query += ` AND (title ILIKE $${values.length + 1} OR short_description ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }

    if (category && category.trim() !== '' && category !== 'Все категории') {
      query += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    if (sort && sort.trim() !== '') {
      if (sort === 'По дате') {
        query += ` ORDER BY created_at DESC`;
      } else if (sort === 'По названию') {
        query += ` ORDER BY title ASC`;
      }
    }

    console.log('SQL-запрос:', query, values);

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка при выполнении маршрута /api/pages:', error);
    res.status(500).json({ message: 'Ошибка сервера при выполнении маршрута /api/pages' });
  }
});

// Получение страницы по ID
app.get('/api/pages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        page_id, 
        title, 
        category, 
        short_description, 
        content, 
        image_url, 
        created_at, 
        updated_at
      FROM Pages
      WHERE page_id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при получении страницы:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении страницы' });
  }
});

app.post('/api/upload-image', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'Файл не загружен' });
  }
  res.json({ location: `/uploads/${file.filename}` }); // Возвращаем путь к файлу
});

// API маршруты
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

// Все остальные запросы направляются на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../my-react-app/dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Сервер остановлен');
    process.exit(0);
  });
});

//netstat -ano | findstr :3001
//taskkill /PID (нужный пид) /F

//netstat -ano | Select-String ":3001" | ForEach-Object { ($_ -split '\s+')[-1] } | ForEach-Object { Stop-Process -Id $_ -Force }