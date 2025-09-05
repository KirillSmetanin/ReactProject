export const loginUser = async (event, { email, password }) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('role', result.role);
        window.location.href = 'http://localhost:5000'; // Перенаправление на другую страницу
        return result;
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert('Ошибка при входе: ' + error.message);
      throw new Error('Ошибка при входе: ' + error.message);
    }
  };
  