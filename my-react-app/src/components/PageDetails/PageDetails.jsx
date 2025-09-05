import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PageDetails.css';

export const PageDetails = () => {
  const { id } = useParams(); // Получаем ID страницы из URL
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pages/${id}`);
        setPage(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке страницы:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageDetails();
  }, [id]);

  if (isLoading) {
    return <div className="page-details__loading">Загрузка...</div>;
  }

  if (!page) {
    return <div className="page-details__not-found">Страница не найдена</div>;
  }

  return (
    <div className="page-details">
      <div className="page-details__header">
        <h1 className="page-details__title">{page.title}</h1>
        <div className="page-details__category">Категория: {page.category}</div>
      </div>
      <img
        src={page.image_url || 'default-image.png'}
        alt={page.title}
        className="page-details__image"
      />
      <div
        className="page-details__content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      ></div>
      <div className="page-details__meta">
        <span>Дата создания: {new Date(page.created_at).toLocaleDateString()}</span>
        <span>Последнее обновление: {new Date(page.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};