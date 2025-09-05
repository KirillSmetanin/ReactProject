import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sbor.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { Dropdown, SearchBar, Cards1 } from '../props/props'; // Предполагается, что Card1 — это компонент карточки

export const Sbor = ({ className, ...props }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedSort, setSelectedSort] = useState('Сортировка');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
    });

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/PRcategories');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const categories = await response.json();
        setCategories(['Все категории', ...categories.map((cat) => cat.category)]);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/getprojects', {
          params: {
            search: searchQuery,
            category: selectedCategory !== 'Все категории' ? selectedCategory : '',
            sort: selectedSort !== 'Сортировка' ? selectedSort : '',
          },
        });

        setProjects(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке проектов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, selectedCategory, selectedSort]);

  return (
    <div className={"sbor-cont " + className}>
    <div className="hero-section">
    <img className="element" src="Element.svg" />
    <div className="heading">
        <div className="text-block">
        <div className="div">Выбирайте, что хотите</div>
        <div className="div2">
            Ваша поддержка — это не просто помощь, это вклад в наше общее будущее.
            Давайте сделаем этот проект реальностью вместе!
        </div>
        </div>
        <div className="btn-free-trial">
        <div className="div3">В общий доступ</div>
        <img className="group-212" src="Group-212.svg" />
        </div>
    </div>
    <div className="image-container">
        <img className="image-6" src="image-6.png" />
    </div>
    </div>
    <div className="frame-168">
    <div className="frame-184">
        <div className="cards-1">
        <img className="card-project-img" src="card-project-img.png" />
        <div className="card-project-txt">
            <div className="card-project-name">
              <Link to={`/project/1`} className={"div4"}>Материальная помощь</Link>
            </div>
            <div className="card-project-op">
            <div className="div5">Внести определённую сумму денег в общий фонд</div>
            </div>
        </div>
        </div>
        <div className="frame-77">
        <img className="card-project-img" src="card-project-img-1.png" />
        <div className="card-project-txt">
            <div className="card-project-name">
              <Link to={`/project/2`} className={"div4"}>Гуманитарная помощь</Link>
            </div>
            <div className="card-project-op">
            <div className="div5">
                Сбор различных материальных благ, расходных товаров
            </div>
            </div>
        </div>
        </div>
        <div className="frame-78">
        <img className="card-project-img" src="card-project-img-2.png" />
        <div className="card-project-txt">
            <div className="card-project-name">
              <Link to={`/project/3`} className={"div4"}>Услуги</Link>
            </div>
            <div className="card-project-op">
            <div className="div5">
                Предоставление различных услуг для помощи людям
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    <div className="frame-71">
        <div className="frame-86">
          <SearchBar
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="frame-871">
          <div className="frame-872">
            <Dropdown
              title="Сортировка"
              options={['По дате', 'По названию']}
              onSelect={(option) => setSelectedSort(option)}
            />
            <Dropdown
              title="Категория"
              options={categories}
              onSelect={(option) => setSelectedCategory(option)}
            />
          </div>
        </div>
      </div>
      <div className="frame-85">
      {isLoading ? <div>Загрузка...</div> : null}
        {projects.map((project) => (
          <Cards1
            key={project.project_id}
            project={project}
            showDescription={true}
            showCategory={true}
            showProgress={true}
          />
        ))}
      </div>
    </div>
  );
};