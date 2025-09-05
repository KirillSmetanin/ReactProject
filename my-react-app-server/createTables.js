require('dotenv').config(); // Подключение dotenv
const { Pool } = require('pg');

// Подключение к базе данных
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const dropTables = async (client) => {
  const tables = [
      'Pages',
      'UserActions',
      'Actions',
      'UserLevels',
      'Levels',
      'Comments',
      'Achievements',
      'ExpenseReports',
      'DonationPoints',
      'Backings',
      'Projects',
      'Users',
      'Wishes',
      'JobListings',
      'MedicalAssistance'
  ];

  for (const table of tables) {
    await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
  }
};

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Удаление всех таблиц
    await dropTables(client);

    // Создание таблицы Пользователи
    await client.query(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        profile_picture VARCHAR(255),
        bio TEXT,
        total_support DECIMAL(10, 2) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(50) DEFAULT 'Пользователь'
      );
    `);

    // Создание таблицы Проекты
    await client.query(`
      CREATE TABLE IF NOT EXISTS Projects (
        project_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id),
        title VARCHAR(255) NOT NULL,
        shortdescription TEXT,
        content TEXT,
        photo VARCHAR(255) NOT NULL,
        goal_amount DECIMAL(10, 2) NOT NULL,
        raised_amount DECIMAL(10, 2) DEFAULT 0,
        end_date TIMESTAMP,
        status VARCHAR(50),
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        news TEXT,
        needy VARCHAR(50)
      );
    `);

    // Создание таблицы Поддержки
    await client.query(`
      CREATE TABLE IF NOT EXISTS Backings (
        backing_id SERIAL PRIMARY KEY,
        project_id INT REFERENCES Projects(project_id),
        user_id INT REFERENCES Users(user_id),
        amount DECIMAL(10, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_status VARCHAR(50)
      );
    `);

    // Создание таблицы Пожелания
    await client.query(`
        CREATE TABLE IF NOT EXISTS Wishes (
          wish_id SERIAL PRIMARY KEY,
          description TEXT NOT NULL,
          author_mail VARCHAR(255),
          is_anonymous BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Создание таблицы Достижения
    await client.query(`
      CREATE TABLE IF NOT EXISTS Achievements (
        achievement_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id),
        description VARCHAR(255),
        date_awarded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создание таблицы Комментарии
    await client.query(`
      CREATE TABLE IF NOT EXISTS Comments (
        comment_id SERIAL PRIMARY KEY,
        project_id INT REFERENCES Projects(project_id),
        user_id INT REFERENCES Users(user_id),
        description TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создание таблицы Уровни
    await client.query(`
      CREATE TABLE IF NOT EXISTS Levels (
        level_id SERIAL PRIMARY KEY,
        level_name VARCHAR(50),
        min_points INT NOT NULL,
        description TEXT
      );
    `);

    // Создание таблицы Пользовательские уровни
    await client.query(`
      CREATE TABLE IF NOT EXISTS UserLevels (
        user_level_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id),
        level_id INT REFERENCES Levels(level_id),
        points INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создание таблицы Действия
    await client.query(`
      CREATE TABLE IF NOT EXISTS Actions (
        action_id SERIAL PRIMARY KEY,
        action_type VARCHAR(50),
        points_awarded INT NOT NULL
      );
    `);

    // Создание таблицы Действия пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS UserActions (
        user_action_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id),
        action_id INT REFERENCES Actions(action_id),
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Добавление таблицы для модуля трудоустройства
    await client.query(`
      CREATE TABLE IF NOT EXISTS JobListings (
        job_id SERIAL PRIMARY KEY,
        employer_id INT REFERENCES Users(user_id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        requirements TEXT,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        for_svo_veterans BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Добавление таблицы для медицинской помощи
    await client.query(`
      CREATE TABLE IF NOT EXISTS MedicalAssistance (
        request_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id),
        assistance_type VARCHAR(255) NOT NULL,
        description TEXT,
        urgency_level VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Добавление таблицы для точек приема помощи
    await client.query(`
      CREATE TABLE IF NOT EXISTS DonationPoints (
        point_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id) ON DELETE CASCADE, -- Владелец точки
        project_id INT REFERENCES Projects(project_id) ON DELETE SET NULL, -- Связь с проектом
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(9, 6), -- Широта
        longitude DECIMAL(9, 6), -- Долгота
        accepted_items TEXT,
        working_hours TEXT,
        contact_phone VARCHAR(50),
        is_verified BOOLEAN DEFAULT FALSE
      );
    `);

    // Добавление таблицы для отчетов о расходах
    await client.query(`
      CREATE TABLE IF NOT EXISTS ExpenseReports (
        report_id SERIAL PRIMARY KEY,
        project_id INT REFERENCES Projects(project_id),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        document_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS Pages (
        page_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        short_description TEXT,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Модификация таблицы Users
    await client.query(`
      ALTER TABLE Users 
      ADD COLUMN IF NOT EXISTS is_svo_veteran BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS military_rank VARCHAR(100),
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
    `);

    // Модификация таблицы Projects
    await client.query(`
      ALTER TABLE Projects 
      ADD COLUMN IF NOT EXISTS target_region VARCHAR(255),
      ADD COLUMN IF NOT EXISTS military_unit VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'Pending';
    `);

    // Модификация таблицы Backings
    await client.query(`
      ALTER TABLE Backings 
      ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS message TEXT;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_project_raised_amount()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Обновляем сумму для проекта
        UPDATE Projects
        SET raised_amount = (
          SELECT COALESCE(SUM(amount), 0)
          FROM Backings
          WHERE project_id = (
            CASE 
              WHEN TG_OP = 'DELETE' THEN OLD.project_id
              ELSE NEW.project_id
            END
          )
          AND payment_status = 'completed'
        )
        WHERE project_id = (
          CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.project_id
            ELSE NEW.project_id
          END
        );
        
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE TRIGGER backings_update_trigger
      AFTER INSERT OR UPDATE OR DELETE ON Backings
      FOR EACH ROW
      EXECUTE FUNCTION update_project_raised_amount();
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_user_experience()
      RETURNS TRIGGER AS $$
      DECLARE
          user_id_param INT;
          profile_experience INT := 0;
          project_experience INT := 0;
          completed_project_experience INT := 0;
          backing_experience INT := 0;
          wishes_experience INT := 0;
      BEGIN
          -- Определяем user_id в зависимости от того, какая таблица вызвала триггер
          IF TG_TABLE_NAME = 'users' THEN
              user_id_param := NEW.user_id;
          ELSIF TG_TABLE_NAME = 'projects' THEN
              user_id_param := NEW.user_id;
          ELSIF TG_TABLE_NAME = 'backings' THEN
              user_id_param := NEW.user_id;
          ELSIF TG_TABLE_NAME = 'wishes' THEN
              user_id_param := (SELECT user_id FROM Users WHERE email = NEW.author_mail LIMIT 1);
          END IF;

          -- Опыт за описание профиля
          SELECT 
              CASE 
                  WHEN bio IS NOT NULL THEN 50 ELSE 0 
              END +
              CASE 
                  WHEN profile_picture IS NOT NULL THEN 50 ELSE 0 
              END
          INTO profile_experience
          FROM Users
          WHERE user_id = user_id_param;

          -- Опыт за проекты
          SELECT COUNT(*) * 100
          INTO project_experience
          FROM Projects
          WHERE user_id = user_id_param;

          -- Опыт за завершённые проекты
          SELECT COUNT(*) * 200
          INTO completed_project_experience
          FROM Projects
          WHERE user_id = user_id_param AND status = 'Завершён';

          -- Опыт за поддержки
          SELECT COUNT(*) * 50
          INTO backing_experience
          FROM Backings
          WHERE user_id = user_id_param;

          -- Опыт за пожелания
          SELECT COUNT(*) * 30
          INTO wishes_experience
          FROM Wishes
          WHERE author_mail = (SELECT email FROM Users WHERE user_id = user_id_param LIMIT 1);

          -- Обновляем общий опыт пользователя
          UPDATE UserLevels
          SET points = profile_experience + project_experience + completed_project_experience + backing_experience + wishes_experience,
              last_updated = CURRENT_TIMESTAMP
          WHERE user_id = user_id_param;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_user_level()
      RETURNS TRIGGER AS $$
      DECLARE
          current_points INT;
          new_level_id INT;
      BEGIN
          -- Получаем текущий опыт пользователя
          SELECT points INTO current_points FROM UserLevels WHERE user_id = NEW.user_id;

          -- Определяем новый уровень
          SELECT level_id INTO new_level_id
          FROM Levels
          WHERE min_points <= current_points
          ORDER BY min_points DESC
          LIMIT 1;

          -- Обновляем уровень пользователя
          UPDATE UserLevels
          SET level_id = new_level_id,
              last_updated = CURRENT_TIMESTAMP
          WHERE user_id = NEW.user_id;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION grant_achievements()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Достижение за первый проект
          IF NOT EXISTS (
              SELECT 1 FROM Achievements WHERE user_id = NEW.user_id AND description = 'Первый проект'
          ) AND (SELECT COUNT(*) FROM Projects WHERE user_id = NEW.user_id) > 0 THEN
              INSERT INTO Achievements (user_id, description, date_awarded)
              VALUES (NEW.user_id, 'Первый проект', CURRENT_TIMESTAMP);
          END IF;

          -- Достижение за первую поддержку
          IF NOT EXISTS (
              SELECT 1 FROM Achievements WHERE user_id = NEW.user_id AND description = 'Первая поддержка'
          ) AND (SELECT COUNT(*) FROM Backings WHERE user_id = NEW.user_id) > 0 THEN
              INSERT INTO Achievements (user_id, description, date_awarded)
              VALUES (NEW.user_id, 'Первая поддержка', CURRENT_TIMESTAMP);
          END IF;

          -- Достижение за первое пожелание
          IF NOT EXISTS (
              SELECT 1 FROM Achievements WHERE user_id = NEW.user_id AND description = 'Первое пожелание'
) AND (SELECT COUNT(*) FROM Wishes WHERE author_mail = (SELECT email FROM Users WHERE user_id = NEW.user_id)) > 0 THEN
              INSERT INTO Achievements (user_id, description, date_awarded)
              VALUES (NEW.user_id, 'Первое пожелание', CURRENT_TIMESTAMP);
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION create_user_level()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO UserLevels (user_id, level_id, points)
          VALUES (NEW.user_id, 1, 0);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE TRIGGER create_user_level_trigger
      AFTER INSERT ON Users
      FOR EACH ROW
      EXECUTE FUNCTION create_user_level();
    `);

    await client.query(`
      CREATE TRIGGER update_experience_on_profile_update
      AFTER UPDATE OF bio, profile_picture ON Users
      FOR EACH ROW
      EXECUTE FUNCTION update_user_experience();
    `);

    await client.query(`
      CREATE TRIGGER update_experience_on_project_change
      AFTER INSERT OR UPDATE OF status ON Projects
      FOR EACH ROW
      EXECUTE FUNCTION update_user_experience();
    `);

    await client.query(`
      CREATE TRIGGER update_experience_on_backing
      AFTER INSERT ON Backings
      FOR EACH ROW
      EXECUTE FUNCTION update_user_experience();
    `);

    await client.query(`
      CREATE TRIGGER update_experience_on_wish
      AFTER INSERT OR UPDATE ON Wishes
      FOR EACH ROW
      EXECUTE FUNCTION update_user_experience();
    `);

    await client.query(`
      CREATE TRIGGER update_level_on_experience_change
      AFTER UPDATE OF points ON UserLevels
      FOR EACH ROW
      EXECUTE FUNCTION update_user_level();
    `);

    await client.query(`
      CREATE TRIGGER grant_achievements_on_action
      AFTER INSERT OR UPDATE ON UserLevels
      FOR EACH ROW
      EXECUTE FUNCTION grant_achievements();
    `);

    await client.query('COMMIT');
    console.log('All tables created successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating tables', err);
  } finally {
    client.release();
  }
};



// Вызов функции создания таблиц
createTables();
