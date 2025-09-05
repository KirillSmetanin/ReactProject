require('dotenv').config();
const { Pool } = require('pg');

// Подключение к базе данных
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const deleteTriggers = async (client) => {
  console.log('Удаление триггеров...');
  await client.query(`
    DROP TRIGGER IF EXISTS update_experience_on_profile_update ON Users;
    DROP TRIGGER IF EXISTS update_experience_on_project_change ON Projects;
    DROP TRIGGER IF EXISTS update_experience_on_backing ON Backings;
    DROP TRIGGER IF EXISTS update_experience_on_wish ON Wishes;
    DROP TRIGGER IF EXISTS update_level_on_experience_change ON UserLevels;
    DROP TRIGGER IF EXISTS grant_achievements_on_action ON UserLevels;
    DROP TRIGGER IF EXISTS create_user_level_trigger ON Users;
  `);
  console.log('Триггеры удалены.');
};

const deleteFunctions = async (client) => {
  console.log('Удаление функций...');
  await client.query(`
    DROP FUNCTION IF EXISTS update_user_experience();
    DROP FUNCTION IF EXISTS update_user_level();
    DROP FUNCTION IF EXISTS grant_achievements();
    DROP FUNCTION IF EXISTS update_project_raised_amount();
    DROP FUNCTION IF EXISTS create_user_level();
  `);
  console.log('Функции удалены.');
};

const deleteTables = async (client) => {
  console.log('Удаление таблиц...');
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
    'MedicalAssistance',
  ];

  for (const table of tables) {
    await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
  }
  console.log('Таблицы удалены.');
};

const deleteData = async (client) => {
  console.log('Очистка данных...');
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
    'MedicalAssistance',
  ];

  for (const table of tables) {
    await client.query(`TRUNCATE TABLE ${table} CASCADE;`);
  }
  console.log('Данные очищены.');
};

const deleteEverything = async (client) => {
  console.log('Удаление всего...');
  await deleteTables(client);
  await deleteTriggers(client);
  await deleteFunctions(client);
  console.log('Всё удалено.');
};

const main = async () => {
  const client = await pool.connect();

  try {
    console.log('Выберите, что удалить:');
    console.log('1. Триггеры');
    console.log('2. Функции');
    console.log('3. Таблицы');
    console.log('4. Данные');
    console.log('5. Всё');

    const choice = parseInt(await new Promise((resolve) => {
      process.stdin.once('data', (data) => resolve(data.toString().trim()));
    }));

    await client.query('BEGIN');

    switch (choice) {
      case 1:
        await deleteTriggers(client);
        break;
      case 2:
        await deleteFunctions(client);
        break;
      case 3:
        await deleteTables(client);
        break;
      case 4:
        await deleteData(client);
        break;
      case 5:
        await deleteEverything(client);
        break;
      default:
        console.log('Неверный выбор.');
    }

    await client.query('COMMIT');
    console.log('Операция завершена.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка при выполнении операции:', err);
  } finally {
    client.release();
    process.exit();
  }
};

main();