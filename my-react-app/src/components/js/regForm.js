export const handleSubmit = async (event, { username, email, password, confirmPassword }) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию

    if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, confirm_password: confirmPassword })
        });

        if (response.ok) {
            const message = await response.text();
            alert(message); // Оповещение об успешной регистрации
            window.location.href = 'http://localhost:5000/login';
        } else {
            const errorMessage = await response.text();
            alert(errorMessage); // Оповещение об ошибке
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Ошибка при регистрации. Попробуйте позже.');
    }
};