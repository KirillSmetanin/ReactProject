import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './props.css';

export const ButtonVariant1 = ({ text, onClick, type, className }) => {
  return (
    <button className={`my-button1 ${className}`} onClick={onClick} type={type}>
      <span className="text1">{text}</span>
    </button>
  );
};

export const ButtonVariant2 = ({ text, onClick, type }) => {
  return (
    <button className="my-button2" onClick={onClick} type={type}>
      <span className="text2">{text}</span>
    </button>
  );
};

export const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="search">
      {/* <img className="search-menu" src="search-menu0.svg" alt="Menu"/> */}
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <img className="searchicon" src="searchicon0.svg" alt="Search Icon" />
    </div>
  );
};

export const Dropdown = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(title);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom, // Нижняя граница элемента
        left: rect.left,  // Левая граница элемента
      });
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption}
        <img
          className={`dropdown-icon ${isOpen ? 'rotate' : ''}`}
          src="frame-1390.svg"
          alt="Dropdown Icon"
        />
      </div>
      {isOpen && (
        <div
          className="dropdown-options"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Cards1 = ({ className, project, role, showDescription, showCategory, showProgress }) => {
  const { project_id, project_image, project_name, category, short_description, goal_amount, raised_amount } = project;
  const progressPercentage = Math.round((raised_amount / goal_amount) * 100);

  return (
    <div className={"cards-1 " + className}>
      <img className="cards1-project-img" src={project_image || "default-project-img.png"} alt={project_name} />
      <div className="cards1-project-txt">
        <div className="cards1-project-name">
          <Link to={`/project/${project_id}`} className={"cards1-div " + className}>{project_name}</Link>
          {showCategory && <div className="cards1-div2">{category}</div>}
        </div>
        {showDescription && (
          <div className="cards1-project-op">
            <div className="cards1-div3">{short_description}</div>
          </div>
        )}
        {showProgress && (
          <div className="cards1-project-lvl">
            <div className="cards1-project-bar">
              <div className="cards1-rectangle-1"></div>
              <div className="cards1-rectangle-2" style={{ width: `${progressPercentage}%` }}></div>
              <div className="cards1-rectangle-3" style={{ left: `calc(${progressPercentage}% - 5px)` }}></div>
            </div>
            <div className="cards1-har">
              <div className="cards1-project-proc-sbor">
                <div className="cards1-_76">{progressPercentage}%</div>
                <div className="cards1-div4">Идёт сбор</div>
              </div>
              <div className="cards1-project-proc-sb">
                <div className="cards1-_12000">{raised_amount} Руб.</div>
                <div className="cards1-div5">Собрано</div>
              </div>
              <div className="cards1-project-proc-sb2">
                <div className="cards1-_12000000">{goal_amount} Руб.</div>
                <div className="cards1-div5">Цель</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PageCard = ({ className, page, showDescription, showCategory }) => {
  const { page_id, image_url, title, category, short_description } = page;

  return (
    <div className={"page-card " + className}>
      <img className="page-card-img" src={image_url || "default-page-img.png"} alt={title} />
      <div className="page-card-txt">
        <div className="page-card-title">
          <Link to={`/pages/${page_id}`} className={"page-card-link " + className}>
            {title}
          </Link>
          {showCategory && <div className="page-card-category">{category}</div>}
        </div>
        {showDescription && (
          <div className="page-card-description">
            <div>{short_description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ResizableTextarea = ({ label, value, onChange, placeholder, name, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleInput = () => {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    const textareaElement = textareaRef.current;
    textareaElement.addEventListener('input', handleInput);

    return () => {
      textareaElement.removeEventListener('input', handleInput);
    };
  }, []);

  return (
    <textarea
      className={className}
      name={name} // Добавляем атрибут name
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      ref={textareaRef}
      style={{
        width: '100%',
        resize: 'none',
        overflow: 'hidden'
      }}
      rows="1"
    />
  );
};

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Описание');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => handleTabClick('Описание')}>Описание</button>
        <button onClick={() => handleTabClick('Новости')}>Новости</button>
        <button onClick={() => handleTabClick('Комментарии')}>Комментарии</button>
        <button onClick={() => handleTabClick('Участники')}>Участники</button>
      </div>
      <div className="tab-content">
        {activeTab === 'Описание' && <div>Содержание для Описание</div>}
        {activeTab === 'Новости' && <div>Содержание для Новости</div>}
        {activeTab === 'Комментарии' && <div>Содержание для Комментарии</div>}
        {activeTab === 'Участники' && <div>Содержание для Участники</div>}
      </div>
    </div>
  );
};




