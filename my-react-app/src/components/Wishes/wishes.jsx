import { useState } from 'react';
import axios from 'axios';
import './wishes.css';
import createCubes from '../js/cube-animation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ButtonVariant1, ButtonVariant2 } from '../props/props';

export const Wishes = () => {
  const [content, setContent] = useState(''); // Текст пожелания
  const [isAnonymous, setIsAnonymous] = useState(true); // Флаг анонимности
  const [successMessage, setSuccessMessage] = useState(''); // Сообщение об успехе
  const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Получаем user_id из localStorage
      const user_id = localStorage.getItem('userId');

      if (!user_id) {
        throw new Error('Пользователь не авторизован');
      }

      // Отправка данных на сервер
      await axios.post('/api/wishes', {
        content,
        user_id, // Передаём user_id вместо author_name
        is_anonymous: isAnonymous,
      });

      setSuccessMessage('Ваше пожелание успешно отправлено!');
      setContent('');
      setIsAnonymous(true);

      // Убираем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Ошибка при отправке пожелания. Попробуйте снова.');
      console.error(error);

      // Убираем сообщение через 3 секунды
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="wishes-cont">
      <div className="hero-section">
        <img className="element" src="Element.svg" />
        <div className="frame-187">
          <div className="heading">
            <div className="text-block">
              <div className="div">Оставьте свои пожелания</div>
              <div className="div2">
                Пожелания и благодарности служащим: ваши слова вдохновения и
                поддержки
              </div>
            </div>
            <div className="btn-free-trial">
              <div className="div3">Поддержка</div>
              <img className="group-212" src="Group-212.svg" />
            </div>
          </div>
          <div className="image-container">
            <img className="image-7" src="pngWishes.png" />
          </div>
        </div>
      </div>
      <div className="testimonial">
        <img className="group" src="el.png" />
        <div className="div4">Пожелания служащим</div>
        <div className="content">
          {/* Пример пожеланий */}
          <div className="client">
            <div className="comment">
              <div className="quote">
                <img className="group2" src="QuoteBlue.svg" />
              </div>
              <div className="div5">
                Вы — герои! Здоровья, тепла и побед. Пусть работа будет в радость!
                Никогда не отчаивайтесь, вас ждут ваши семьи!
              </div>
            </div>
            <div className="name-box">
              <img className="avater" src="Avater1.png" />
              <div className="name">
                <div className="div6">Екатерина</div>
                <div className="div7">Санкт-Петербург</div>
              </div>
            </div>
          </div>
          <div className="client2">
            <div className="comment2">
              <div className="quote">
                <img className="group3" src="QuoteWi.svg" />
              </div>
              <div className="div8">
                Желаю вдохновения и сил! Пусть ваш труд приносит счастье и
                удовлетворение. Спасибо за всё!
              </div>
            </div>
            <div className="name-box">
              <img className="avater" src="Avater2.png" />
              <div className="name">
                <div className="div9">Иван</div>
                <div className="div10">Новосибирск</div>
              </div>
            </div>
          </div>
          <div className="client2">
            <div className="comment2">
              <div className="quote">
                <img className="group4" src="QuoteWi.svg" />
              </div>
              <div className="div8">
                Спасибо за ваш труд! Пусть каждый день будет успешным, а работа
                приносит радость. Будьте здоровы!
              </div>
            </div>
            <div className="name-box">
              <img className="avater" src="Avater3.png" />
              <div className="name">
                <div className="div6">Алексей</div>
                <div className="div10">Москва</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form className="frame-173" onSubmit={handleSubmit}>
        {/* Поле ввода текста пожелания */}
        <textarea
          className="frame-174"
          placeholder="Введите пожелание"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="frame-186">
          <div className="frame-170">
            <div className="div12">Отправить анонимно</div>
            {/* Переключатель анонимности */}
            <div
              className={`toggle ${isAnonymous ? 'active' : ''}`}
              onClick={() => setIsAnonymous(!isAnonymous)}
            >
              <div className="knob"></div>
            </div>
          </div>
          {/* Кнопка отправки */}
          <button type="submit" className="batton-12">
            <div className="text">Отправить пожелание</div>
          </button>
        </div>
      </form>

      {/* Всплывающее сообщение об успехе */}
      {successMessage && (
        <div className="popup success-popup">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Всплывающее сообщение об ошибке */}
      {errorMessage && (
        <div className="popup error-popup">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};