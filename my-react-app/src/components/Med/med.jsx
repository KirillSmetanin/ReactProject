import { useEffect, useState } from 'react';
import './med.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Med = ({ className, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

  useEffect(() => {
    AOS.init(); // Инициализация AOS
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Переключение состояния модального окна
  };

  return (
    <div className="med-cont">
      <div className="hero-section">
        <img className="element" src="Element.svg" />
        <div className="frame-192">
          <div className="heading">
            <div className="text-block">
              <div className="div">Лечение прошедших СВО</div>
              <div className="div2">Все льготы положенные служащим</div>
            </div>
            <div className="btn-free-trial" onClick={handleModalToggle}>
              <div className="div3">Обратиться за помощью</div>
              <img className="group-212" src="Group-212.svg" />
            </div>
          </div>
          <div className="image-container">
            <img className="image-6" src="image-6.png" />
          </div>
        </div>
      </div>
      <div className="frame-169">
        <div className="frame-193">
          <div className="div4">Предоставляемые льготы</div>
          <div className="frame-176">
            <div className="frame-177">
              <div className="div5">Возвращайтесь на свою работу</div>
            </div>
            <div className="frame-177">
              <div className="div5">Бесплатное медицинское обслуживание</div>
            </div>
            <div className="frame-177">
              <div className="div5">Реабилитационные программы</div>
            </div>
            <div className="frame-177">
              <div className="div5">Обеспечение лекарственными средствами</div>
            </div>
            <div className="frame-177">
              <div className="div5">Психологическая поддержка</div>
            </div>
            <div className="frame-177">
              <div className="div5">Санаторно-курортное лечение</div>
            </div>
            <div className="frame-177">
              <div className="div5">Материальная помощь</div>
            </div>
            <div className="frame-177">
              <div className="div5">Помощь в трудоустройстве</div>
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
            <p><strong>Электронная почта:</strong> help@support.ru</p>
            <p><strong>Адрес:</strong> Москва, ул. Примерная, д. 1</p>
            <button className="close-btn" onClick={handleModalToggle}>Закрыть</button>
          </div>
        </div>
      )}

    </div>
  );
};