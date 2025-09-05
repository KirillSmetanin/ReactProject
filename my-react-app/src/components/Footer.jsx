import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    
    return (
        <footer className="footer">
        <div className="div">
          <div className="div2">
            {/* Логотип и описание */}
            <div className="div3">
              <div className="div4">
                <div className="div5">ПоддержиГероев.рф</div>
                <div className="frame">
                  <img className="frame2" src="Logo.svg" alt="Логотип" />
                </div>
              </div>
              <div className="div6">
                Поддержка тех, кто защищает, с помощью общественных инициатив.
              </div>
            </div>
  
            {/* Ссылки */}
            <div className="div7">
              <div className="div8">Ссылки</div>
              <div className="ul">
                <a href="/" className="div9">Главная</a>
                <a href="/sbor" className="div10">Краудфандинг</a>
                <a href="/kp" className="div11">Образоание</a>
              </div>
            </div>
  
            {/* Документы */}
            <div className="div13">
              <div className="div14">Документы</div>
              <div className="ul2">
                <a href="/privacy-policy" className="div15">Политика конфиденциальности</a>
                <a href="/terms-of-service" className="div16">Условия обслуживания</a>
                <a href="/cookie-policy" className="cookie">Политика использования cookie</a>
              </div>
            </div>
  
            {/* Контакты */}
            <div className="div17">
              <div className="div18">Связь с нами</div>
              <div className="frame-172">
                <a href="https://ok.ru/group/70000034830902"><img className="bxl-ok-ru" src="bxl_ok-ru.svg" alt="Одноклассники" /></a>
                <a href="https://vk.com/club230201819?from=groups"><img className="fa-brands-vk" src="fa-brands_vk.svg" alt="ВКонтакте" /></a>
              </div>
              <div className="_7-917-582-60-95">+7 917-582-60-95</div>
            </div>
          </div>
  
          {/* Копирайт */}
          <div className="div19">
            <div className="_2025">
              <span>
                <span className="_2025-span">© 2025 </span>
                <span className="_2025-span2">ПоддержиГероев.рф</span>
                <span className="_2025-span3">. Все права защищены.</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;
