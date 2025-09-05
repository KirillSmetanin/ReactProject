import { useEffect, useState } from 'react';
import './main.css';
import createCubes from '../js/cube-animation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {ButtonVariant1, ButtonVariant2} from '../props/props'

export const Main = ({ className, ...props }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleSocialClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={"main hero" + className} id='hero'>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Выберите направление</h3>
            <div className="modal-buttons">
              <a href="/med" className="modal-button">
                Лечение прошедших СВО
              </a>
              <a href="/work" className="modal-button">
                Трудоустройство прошедших СВО
              </a>
            </div>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="contener-1" data-aos="fade-down">
        <img className="pattern-1" src="pattern-10.svg" />
        <div className="frame-40">
          <div className="volter">
            ПоддержиГероев.рф{" "}
          </div>
          <div className="volter-crowdfunding">
            Поучаствуйте в мероприятиях, подержите героев России.
            <br />
            Вы множите пообщаться лично с каждым из участников, получить информацию
            на форуме, а так же помочь различными услугами или материальными
            благами.
          </div>
          <div className="frame-41">
            <a href="#about"><ButtonVariant1 text="О нас" /></a>
            <a href="#services"><ButtonVariant2 text="Что мы делаем" /></a>
          </div>
        </div>
        <div className="frame-3">
          <img className="image-2" src="Frame3.png" />
        </div>
        <div className="ellipse-3"></div>
        <div className="ellipse-4"></div>
        <div className="ellipse-5"></div>
      </div>
      <div className="contener-2" data-aos="fade-up" id="about">
        <img className="frame-135" src="Element.svg" />
        <div className="frame-114">
          <img src="Frame-183.png" />
          <div className="ellipse-32"></div>
          <div className="ellipse-42"></div>
          <div className="ellipse-52"></div>
          <div className="ellipse-6"></div>
        </div>
        <div className="frame-133">
          <div className="volter2">О “ПоддержиГероев.рф”</div>
          <div className="volter3">
            На ПоддержиГероев.рф мы не просто платформа для сбора средств — мы надёжный
            партнёр в помощи тем, кто защищал нашу страну. Наша миссия — объединить людей,
            готовых поддерживать ветеранов СВО, и предоставить им инструменты для
            эффективной социальной адаптации, медицинской помощи, трудоустройства и других
            важных инициатив.
            <br />
            Мы верим, что каждая помощь — это шаг к лучшему будущему. Независимо от того,
            хотите ли вы поддержать проект по реабилитации, предоставить бесплатные услуги
            или просто выразить свою благодарность героям, мы поможем вам сделать это
            прозрачно и эффективно.
            <br />
            С ПоддержиГероев.рф ваша помощь становится осмысленной, а доброе дело —
            доступным каждому. Вместе мы создаем пространство, где забота и благодарность
            превращаются в реальные действия.
          </div>
        </div>
      </div>
      <div className="contener-7" data-aos="fade-up" id="services">
        <div className="frame-181">
          <div className="div7-1">Что мы делаем</div>
          <div className="div8-1">Индивидуальные решения для поддержки наших героев</div>
          <div className="frame-147-1">
            <a className="frame-148-1" href="/sbor">
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Краудфандинг</div>
                  <div className="div10-1">
                    Создание кампаний для сбора средств на помощь нуждающимся.
                  </div>
                </div>
              </div>
            </a>
            <a className="frame-1542-1" href="kp">
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Образовательные мероприятия</div>
                  <div className="div10-1">
                    Мастер-классы и семинары по темам поддержки и помощи.
                  </div>
                </div>
              </div>
            </a>
            <a className="frame-1552-1" href="kp">
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Консультации</div>
                  <div className="div10-1">
                    Индивидуальные рекомендации по организации сбора средств.
                  </div>
                </div>
              </div>
            </a>
            <div className="frame-156-1" onClick={handleSocialClick} style={{ cursor: 'pointer' }}>
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Социальные программы</div>
                  <div className="div10-1">
                    Поддержка ментального и физического здоровья.
                  </div>
                </div>
              </div>
            </div>
            <a className="frame-157-1" href="https://vk.com/club230201819">
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Виртуальные мероприятия</div>
                  <div className="div10-1">
                    Удаленные сессии и консультации для вовлечения сообщества.
                  </div>
                </div>
              </div>
            </a>
            <a className="frame-158-1" href="/wishes">
              <div className="frame-149-1">
                <img className="frame-139-1" src="frame-1390.svg" />
              </div>
              <div className="frame-154-1">
                <div className="frame-155-1">
                  <div className="div9-1">Оставить пожелания</div>
                  <div className="div10-1">Поддержите служащих</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="contener-3" data-aos="fade-up">
        <div className="frame-48">
          <img src="Frame47.png" />
        </div>
        <div className="frame-49">
          <img src="Frame48.png" />
        </div>
        <div className="frame-47">
          <img src="Frame49.png" />
        </div>
        <div className="div">Солидарность </div>
        <div className="div2">Вдохновение</div>
        <div className="div3">Помощь</div>
        <div className="div4">
          Используя нашу платформу и опыт, мы объединяем людей в духе солидарности, помогая находить и поддерживать значимые проекты, которые воплощают общие ценности, меняют жизнь к лучшему и создают прочные связи внутри общества.{" "}
        </div>
        <div className="div5">
          Присоединяйтесь к движению, которое делает мир лучше через солидарность и поддержку. Ваша помощь — это не просто вклад, а шанс изменить жизни тех, кто в этом нуждается. Давайте вместе создадим сообщество, где каждый поступок имеет значение, а добро возвращается сторицей.{" "}
        </div>
        <div className="div6">
          Наша преданная своему делу команда оказывает индивидуальную помощь на каждом этапе, начиная с создания вашего проекта и заканчивая достижением ваших финансовых целей, обеспечивая бесперебойную работу на протяжении всего процесса краудфандинга.{" "}
        </div>
      </div>
      <div className="contener-5" data-aos="fade-up" id="recommendations">
        <div className="frame-134">
          <div className="rectangle-16"></div>
          <div className="ellipse-7"></div>
          <div className="rectangle-17"></div>
          <div className="ellipse-8"></div>
        </div>
        <div className="frame-52">
          <div className="div8">Рома Воронин </div>
          <div className="volter-volter2">
            Люблю это сообщество! Поддержка и советы по помощи героям очень полезны. Атмосфера здесь дружелюбная, и я всегда ухожу с чувством удовлетворения.{" "}
          </div>
        </div>
      </div>
      <div className="contener-6" data-aos="fade-up">
        <img className="frame-140" src="contener-60.png" />
        <div className="frame-142">
          <div className="frame-56">
            <div className="frame-492">
              <img src="fr.png" />
            </div>
            <div className="div9">Получите наши эксклюзивные возможности </div>
            <input className="frame-57"></input>
            <input className="frame-58"></input>
            <a href='/login'>
              <ButtonVariant1 text="Вход" />
            </a>
          </div>
        </div>
      </div>
      <div className="our-sponsors-2" data-aos="fade-up">
        <img className="element-2" src="el.png" />
        <div className="div-2">Наши спонсоры</div>
        <div className="sponsors-2">
          <div className="apple-2">
            <img className="apple2-2" src="vk.png" />
          </div>
          <div className="microsoft-2">
            <img className="microsoft-1-2" src="sber.png" />
          </div>
          <div className="slack-2">
            <div className="slack-technologies-logo-1-2">
              <img className="group-2" src="yandex.png" />
            </div>
          </div>
        </div>
      </div>
      <script src="../js/scroll.js"></script>
    </div>
  );
};