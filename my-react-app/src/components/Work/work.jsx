import { useEffect, useState } from 'react';
import './work.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Work = ({ className, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

  useEffect(() => {
    AOS.init(); // Инициализация AOS
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Переключение состояния модального окна
  };
  return (
    <div className="work-cont">
      <div className="hero-section">
        <img className="element" src="Element.svg" />
        <div className="frame-189">
          <div className="heading">
            <div className="text-block">
              <div className="div">Трудоустройство прошедших СВО</div>
              <div className="div2">
                Служба занятости населения помогает ветеранам и участникам СВО найти
                работу, повысить квалификацию или получить востребованную профессию
              </div>
            </div>
            <div className="btn-free-trial" onClick={handleModalToggle}>
              <div className="div3">Обратиться в центр занятости</div>
              <img className="group-212" src="Group-212.svg" />
            </div>
          </div>
          <div className="image-container">
            <img className="image-8" src="Work.png" />
          </div>
        </div>
      </div>
      <div className="frame-168">
        <div className="frame-190">
          <div className="div4">Специальные меры поддержки</div>
          <div className="frame-176">
            <div className="cards-1">
              <div className="card-project-txt">
                <div className="card-project-name">
                  <div className="div5">Трудоустройство</div>
                </div>
                <div className="card-project-op">
                  <div className="div6">
                    Внести определённую сумму денег в общий фонд
                  </div>
                </div>
                <img className="vector" src="Ch.svg" />
              </div>
            </div>
            <div className="frame-77">
              <div className="card-project-txt">
                <div className="card-project-name">
                  <div className="div5">Образование</div>
                </div>
                <div className="card-project-op">
                  <div className="div6">
                    Сбор различных материальных благ, расходных товаров
                  </div>
                </div>
                <img className="vector2" src="Un.svg" />
              </div>
            </div>
            <div className="frame-78">
              <div className="card-project-txt">
                <div className="card-project-name">
                  <div className="div5">Обслуживание</div>
                </div>
                <div className="card-project-op">
                  <div className="div6">
                    Предоставление различных услуг для помощи людям
                  </div>
                </div>
                <img className="vector3" src="Car.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="frame-169">
        <div className="frame-191">
          <div className="div7">Работа для каждого</div>
          <div className="frame-1762">
            {/* Карточка 1 */}
            <div className="frame-177">
              <div className="frame-179">
                <div className="div8">Возвращайтесь на свою работу</div>
                <div className="div9">
                  Если вы планируете вернуться на прежнее рабочее место
                </div>
              </div>
              <div className="frame-180">
                <div className="div10">Возвращайтесь на свою работу</div>
                <div className="div9">
                  <ul className="div-9-span2">
                    <li>Пройти профориентацию;</li>
                    <li>Подтвердить квалификацию;</li>
                    <li>Подобрать профессиональное обучение.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Карточка 2 */}
            <div className="frame-177">
              <div className="frame-179">
                <div className="div8">Получите новую профессию</div>
                <div className="div9">
                  Если вы хотите освоить новую специальность
                </div>
              </div>
              <div className="frame-180">
                <div className="div10">Получите новую профессию</div>
                <div className="div9">
                  <ul className="div-9-span2">
                    <li>Запишитесь на курсы профессионального обучения;</li>
                    <li>Получите доступ к современным образовательным ресурсам;</li>
                    <li>Освойте востребованные навыки.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Карточка 3 */}
            <div className="frame-177">
              <div className="frame-179">
                <div className="div8">Повышение квалификации</div>
                <div className="div9">
                  Если вы хотите улучшить свои профессиональные навыки
                </div>
              </div>
              <div className="frame-180">
                <div className="div10">Повышение квалификации</div>
                <div className="div9">
                  <ul className="div-9-span2">
                    <li>Участвуйте в тренингах и семинарах;</li>
                    <li>Получите сертификаты о повышении квалификации;</li>
                    <li>Станьте экспертом в своей области.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Карточка 4 */}
            <div className="frame-177">
              <div className="frame-179">
                <div className="div8">Содействие в трудоустройстве</div>
                <div className="div9">
                  Если вы ищете работу или хотите сменить профессию
                </div>
              </div>
              <div className="frame-180">
                <div className="div10">Содействие в трудоустройстве</div>
                <div className="div9">
                  <ul className="div-9-span2">
                    <li>Получите помощь в составлении резюме;</li>
                    <li>Участвуйте в ярмарках вакансий;</li>
                    <li>Получите консультации по поиску работы.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Карточка 5 */}
            <div className="frame-177">
              <div className="frame-179">
                <div className="div8">Психологическая поддержка</div>
                <div className="div9">
                  Если вы нуждаетесь в помощи для адаптации к новой жизни
                </div>
              </div>
              <div className="frame-180">
                <div className="div10">Психологическая поддержка</div>
                <div className="div9">
                  <ul className="div-9-span2">
                    <li>Консультации с профессиональными психологами;</li>
                    <li>Групповые занятия для адаптации;</li>
                    <li>Индивидуальная работа с психотерапевтом.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleModalToggle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Контактная информация</h2>
            <p><strong>Телефон:</strong> +7 (800) 555-35-35</p>
            <p><strong>Электронная почта:</strong> employment@support.ru</p>
            <p><strong>Адрес:</strong> Москва, ул. Примерная, д. 2</p>
            <button className="close-btn" onClick={handleModalToggle}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};