require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Подключение к базе данных
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

async function insertData() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Очистка таблиц
        await client.query('TRUNCATE TABLE Projects, Users, Backings, Achievements, Comments, Levels, UserLevels, Actions, UserActions, JobListings, MedicalAssistance, DonationPoints, ExpenseReports, Pages CASCADE');

        // 1. Добавление уровней
        await client.query(`
          INSERT INTO Levels (level_name, min_points, description)
          VALUES 
              ('Новичок', 0, 'Начальный уровень'),
              ('Активный', 1000, 'Средний уровень'),
              ('Лидер', 5000, 'Высокий уровень')
        `);

        // 2. Добавление действий
        await client.query(`
          INSERT INTO Actions (action_type, points_awarded)
          VALUES 
              ('Регистрация', 100),
              ('Поддержка проекта', 200),
              ('Комментарий', 50)
        `);


        await client.query('ALTER TABLE Users DISABLE TRIGGER create_user_level_trigger');

        // 3. Добавление пользователей
        const hashed_password1 = await bcrypt.hash('password123', 10);
        const hashed_password2 = await bcrypt.hash('klimova1942', 10);
        const hashed_password3 = await bcrypt.hash('123', 10);

        await client.query(`
          INSERT INTO Users (username, email, password_hash, profile_picture, bio, total_support, is_active, role, is_svo_veteran, military_rank, phone_number)
          VALUES 
              ('user1', 'user1@example.com', '${hashed_password1}', 'user1.jpg', 'Биография пользователя 1', 1000.00, TRUE, 'Пользователь', FALSE, NULL, '+79111111111'),
              ('admin', 'admin@example.com', '${hashed_password2}', 'admin.jpg', 'Администратор системы', 0.00, TRUE, 'Администратор', FALSE, NULL, '+79111111112'),
              ('veteran', 'veteran@example.com', '${hashed_password3}', 'veteran.jpg', 'Ветеран СВО', 500.00, TRUE, 'Пользователь', TRUE, 'Сержант', '+79111111113')
        `);

        await client.query('ALTER TABLE Users ENABLE TRIGGER create_user_level_trigger');

        // 8. Добавление пользовательских уровней
        await client.query(`
          INSERT INTO UserLevels (user_id, level_id, points, last_updated)
          VALUES 
              (1, 2, 1500, NOW()),
              (2, 1, 500, NOW()),
              (3, 2, 2000, NOW())
        `);

        //     // 9. Добавление действий пользователей
        // await client.query(`
        //       INSERT INTO UserActions (user_id, action_id, details, timestamp)
        //       VALUES 
        //           (1, 2, 'Поддержал проект 1', NOW()),
        //           (2, 1, 'Зарегистрировался в системе', NOW()),
        //           (3, 3, 'Оставил комментарий', NOW())
        //     `);

        // 4. Добавление проектов
        await client.query(`
          INSERT INTO Projects (user_id, title, shortdescription, content, photo, goal_amount, raised_amount, end_date, status, category, created_at, updated_at, news, target_region, military_unit, verification_status)
          VALUES 
              (1, 'Материальная помощь', 'Краткое описание материальной помощи', 'Полное описание проекта материальной помощи', 'help1.jpg', 100000.00, 0, '2023-12-31', 'Активный', 'Помощь', NOW(), NOW(), 'Новости проекта 1', 'Москва', 'Часть №1', 'Verified'),
              (2, 'Гуманитарная помощь', 'Краткое описание гуманитарной помощи', 'Полное описание проекта гуманитарной помощи', 'help2.jpg', 200000.00, 0, '2023-11-30', 'Активный', 'Помощь', NOW(), NOW(), 'Новости проекта 2', 'Санкт-Петербург', 'Часть №2', 'Verified'),
              (3, 'Услуги', 'Краткое описание услуг', 'Полное описание проекта по предоставлению услуг', 'services.jpg', 50000.00, 0, '2023-10-31', 'Активный', 'Услуги', NOW(), NOW(), 'Новости проекта 3', 'Краснодар', 'Часть №3', 'Pending')
        `);

        // 6. Добавление пожеланий
        await client.query(`
          INSERT INTO Wishes (description, author_mail, is_anonymous)
          VALUES 
              ('Желаю успехов!', 'user1@example.com', FALSE),
              ('Спасибо за вашу работу!', 'admin@example.com', TRUE),
              ('Вы делаете мир лучше!', 'veteran@example.com', FALSE)
        `);

        // 7. Добавление комментариев
        await client.query(`
          INSERT INTO Comments (project_id, user_id, description, timestamp)
          VALUES 
              (1, 3, 'Отличный проект!', NOW()),
              (2, 1, 'Как я могу помочь?', NOW()),
              (3, 2, 'Интересная инициатива', NOW())
        `);

        // 10. Добавление вакансий
        await client.query(`
          INSERT INTO JobListings (employer_id, title, description, requirements, location, salary_range, for_svo_veterans, created_at, is_active)
          VALUES 
              (1, 'Менеджер проекта', 'Управление проектами помощи', 'Опыт работы 3+ года', 'Москва', 'от 100000 руб.', TRUE, NOW(), TRUE),
              (2, 'Волонтер', 'Помощь в организации мероприятий', 'Желание помогать', 'Санкт-Петербург', 'договорная', TRUE, NOW(), TRUE),
              (3, 'Водитель', 'Доставка гуманитарной помощи', 'Права категории B', 'Краснодар', 'от 50000 руб.', FALSE, NOW(), TRUE)
        `);

        // 11. Добавление запросов медпомощи
        await client.query(`
          INSERT INTO MedicalAssistance (user_id, assistance_type, description, urgency_level, status, created_at)
          VALUES 
              (1, 'Консультация', 'Нужна консультация специалиста', 'Средняя', 'Pending', NOW()),
              (2, 'Лечение', 'Требуется курс лечения', 'Высокая', 'In Progress', NOW()),
              (3, 'Реабилитация', 'Реабилитация после травмы', 'Критическая', 'Pending', NOW())
        `);

        // 12. Добавление точек приёма помощи
        await client.query(`
          INSERT INTO DonationPoints (user_id, project_id, name, address, latitude, longitude, accepted_items, working_hours, contact_phone, is_verified)
          VALUES 
              (1, 1, 'Точка 1', 'Москва, ул. Пушкина 1', 55.755826, 37.617300, 'Одежда, продукты', 'Пн-Пт 10:00-18:00', '+79111111111', TRUE),
              (2, 2, 'Точка 2', 'Санкт-Петербург, Невский пр. 2', 59.934280, 30.335099, 'Лекарства, гигиена', 'Пн-Сб 09:00-20:00', '+79111111112', TRUE),
              (3, 3, 'Точка 3', 'Краснодар, ул. Красная 3', 45.035470, 38.975313, 'Техника, книги', 'Вт-Вс 11:00-19:00', '+79111111113', FALSE)
        `);

        // 13. Добавление отчётов о расходах
        await client.query(`
          INSERT INTO ExpenseReports (project_id, amount, description, document_url, created_at)
          VALUES 
              (1, 5000.00, 'Закупка продуктов', 'doc1.pdf', NOW()),
              (2, 10000.00, 'Закупка медикаментов', 'doc2.pdf', NOW()),
              (3, 2000.00, 'Оплата услуг', 'doc3.pdf', NOW())
        `);

        // 14. Добавление информационных страниц
        await client.query(`
          INSERT INTO Pages (title, category, short_description, content, image_url)
          VALUES 
              ('Как настроить Ollama', 'Документация', 'Инструкция по установке Ollama для VS Code', 'Шаг 1: Скачайте Ollama...', 'ollama_installation.jpg')
        `);

        await client.query('COMMIT');
        console.log('Данные успешно добавлены и триггеры активированы');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Ошибка при добавлении данных:', error);
    } finally {
        client.release();
    }
}

insertData();

// SELECT
//     u.user_id,
//     u.username,
//     COALESCE(
//         CASE WHEN u.bio IS NOT NULL THEN 50 ELSE 0 END +
//         CASE WHEN u.profile_picture IS NOT NULL THEN 50 ELSE 0 END, 0
//     ) AS profile_experience,
//     COALESCE((SELECT COUNT(*) * 100 FROM Projects p WHERE p.user_id = u.user_id), 0) AS project_experience,
//     COALESCE((SELECT COUNT(*) * 200 FROM Projects p WHERE p.user_id = u.user_id AND p.status = 'Завершён'), 0) AS completed_project_experience,
//     COALESCE((SELECT COUNT(*) * 50 FROM Backings b WHERE b.user_id = u.user_id), 0) AS backing_experience,
//     COALESCE((SELECT COUNT(*) * 30 FROM Wishes w WHERE w.author_name = u.username), 0) AS wishes_experience,
//     COALESCE(
//         CASE WHEN u.bio IS NOT NULL THEN 50 ELSE 0 END +
//         CASE WHEN u.profile_picture IS NOT NULL THEN 50 ELSE 0 END, 0
//     ) +
//     COALESCE((SELECT COUNT(*) * 100 FROM Projects p WHERE p.user_id = u.user_id), 0) +
//     COALESCE((SELECT COUNT(*) * 200 FROM Projects p WHERE p.user_id = u.user_id AND p.status = 'Завершён'), 0) +
//     COALESCE((SELECT COUNT(*) * 50 FROM Backings b WHERE b.user_id = u.user_id), 0) +
//     COALESCE((SELECT COUNT(*) * 30 FROM Wishes w WHERE w.author_name = u.username), 0) AS total_experience
// FROM Users u
// ORDER BY total_experience DESC;
