import React, { useEffect, useState } from 'react';
import './kp.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { Dropdown, SearchBar, PageCard } from '../props/props';

export const Kp = ({ className, ...props }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedSort, setSelectedSort] = useState('Сортировка');
  const [showDescription, setShowDescription] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
    });

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/PGcategories');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const categories = await response.json();
        console.log(categories);
        setCategories(['Все категории', ...categories.map((cat) => cat.category)]);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('Фильтры изменились:', { searchQuery, selectedCategory, selectedSort });

    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/pages', {
          params: {
            search: searchQuery,
            category: selectedCategory !== 'Все категории' ? selectedCategory : '',
            sort: selectedSort !== 'Сортировка' ? selectedSort : '',
          },
        });

        console.log('Полученные данные:', response.data);
        setPages(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке страниц:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [searchQuery, selectedCategory, selectedSort]);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleShowDescription = () => {
    setShowDescription((prev) => !prev);
  };

  return (
    <div className={"frame-70 " + className}>
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
      <div className="frame-74">
          {isLoading ? <div>Загрузка...</div> : null}
          {pages.map((page) => (
            <PageCard
              key={page.page_id}
              page={page}
              showDescription={showDescription}
              showCategory={true}
            />
          ))}
      </div>
    </div>
  );
};