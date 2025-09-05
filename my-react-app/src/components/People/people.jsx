import { useEffect } from 'react';
import './people.css';
import createCubes from '../js/cube-animation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {ButtonVariant1, ButtonVariant2} from '../props/props'

export const People = ({ className, ...props }) => {
    useEffect(() => {
      // const numberOfCubes = 70; // Задайте количество кубиков
      // createCubes(numberOfCubes);
      AOS.init(); // Инициализация AOS
    }, []);
    return (
<div className="people-cont">
  <div className="frame-111">
    <div className="frame-188">
      <div className="frame-112">
        <img className="ellipse" src="ellipse0.png" />
        <button className="button">
          <div className="text">Подержать проект</div>
        </button>
      </div>
      <div className="frame-122">
        <div className="frame-97">
          <img className="element" src="element0.svg" />
          <img className="element2" src="element1.svg" />
          <div className="div">Имя попечителя:</div>
          <div className="div2">Анна Викторовна</div>
          <div className="div">Цель сбора:</div>
          <div className="div2">На лечение</div>
        </div>
        <div className="card-project-lvl">
          <div className="card-project-bar">
            <div className="rectangle-1"></div>
            <div className="rectangle-2"></div>
            <div className="rectangle-3"></div>
          </div>
          <div className="har">
            <div className="card-project-proc-sbor">
              <div className="_76">76%</div>
              <div className="div3">Идёт сбор</div>
            </div>
            <div className="card-project-proc-sb">
              <div className="_12000">12000 Руб.</div>
              <div className="div4">Собрано</div>
            </div>
            <div className="card-project-proc-sb2">
              <div className="_12000000">12000000 Руб.</div>
              <div className="div4">Цель</div>
            </div>
          </div>
        </div>
      </div>
      <div className="frame-113">
        <div className="frame-114">
          <div className="rectangle-6"></div>
          <div className="rectangle-7"></div>
          <div className="rectangle-8"></div>
          <div className="rectangle-9"></div>
          <div className="rectangle-10"></div>
          <div className="rectangle-11"></div>
          <div className="ellipse-3"></div>
          <div className="ellipse-4"></div>
          <div className="ellipse-5"></div>
          <div className="ellipse-6"></div>
          <div className="frame-67">
            <img
              className="acetone-2024918-214737-578-1"
              src="acetone-2024918-214737-578-10.png"
            />
          </div>
          <div className="frame-68">
            <img className="image-1" src="image-10.png" />
          </div>
          <div className="frame-69">
            <img className="image-12" src="image-11.png" />
          </div>
          <img className="pattern-1-1" src="pattern-1-10.svg" />
        </div>
      </div>
    </div>
  </div>
  <div className="frame-115">
    <div className="frame-143">
      <div className="div5">ОПИСАНИЕ:</div>
      <div className="div6">
        Я Анна викторовна, хочу помочь своему брату который ущёл на СВО, он
        тяжело ранен, пожалуйста помогите чем сможите
      </div>
    </div>
  </div>
  <div className="frame">
    <div className="frame-144">
      <div className="div">Различные фото/видео</div>
      <div className="frame-118">
        <img className="image-3" src="image-30.png" />
        <img className="image-2" src="image-20.png" />
        <img className="image-4" src="image-40.png" />
      </div>
    </div>
  </div>
</div>
  );
};