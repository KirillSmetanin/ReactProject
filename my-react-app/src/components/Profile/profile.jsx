import React, { useEffect, useState, useRef } from 'react';
import './profile.css';
import 'aos/dist/aos.css';
import { ButtonVariant1, Cards1 } from '../props/props';

export const Profile = ({ className, ...props }) => {
  const [fields, setFields] = useState({
    name: '',
    description: '',
    profileImage: '',
    projects: 0,
    level: 1,
    progressPercentage: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [projects, setProjects] = useState([]);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('user_id is null or undefined');
      }
      const response = await fetch(`/api/profile/${userId}`);
      const result = await response.json();
      
      // Обрабатываем данные перед установкой в состояние
      const progress = result.progresspercentage || result.progressPercentage || 0;
      const level = result.level || 'Новичок';
      
      setFields({
        name: result.name || '',
        description: result.description || '',
        profileImage: result.photo || '',
        projects: parseInt(result.projects) || 0,
        level: level, // Сохраняем как строку
        progressPercentage: Math.min(100, Math.max(0, Number(progress))) // Гарантируем число 0-100
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных профиля:', error);
      // Установите значения по умолчанию при ошибке
      setFields({
        name: '',
        description: '',
        profileImage: '',
        projects: 0,
        level: 'Новичок',
        progressPercentage: 0
      });
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/userprojects/${userId}`);
        const result = await response.json();
        setProjects(result);
      } catch (error) {
        console.error('Ошибка при загрузке проектов пользователя:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFields((prevFields) => ({
          ...prevFields,
          profileImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('user_id is null or undefined');
      }

      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('name', fields.name);
      formData.append('description', fields.description);
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Профиль успешно обновлен!');
        const result = await response.json();
        setFields((prevFields) => ({
          ...prevFields,
          profileImage: result.photo,
        }));
        setSelectedFile(null);
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert('Ошибка при обновлении профиля: ' + error.message);
    }
  };

    return (
    <div className={"frame-110 " + className}>
      <div className="frame-111">
        <div className="frame-112">
        <div onClick={handleImageClick}>
          <img className="ellipse" src={fields.profileImage} alt="Профиль"  title='Нажмите на фото чтобы изменить его, затем нажмите "Подтвердить фото"'/>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
          accept="image/*"
        />
          <ButtonVariant1 
            className="profilphotobutton" 
            text="Изменить фото" 
            onClick={handleSubmit}
            title='Нажмите на фото чтобы изменить его, затем нажмите "Подтвердить фото"'
          />
        </div>
        <div className="frame-122">
          <div className="frame-97">
            <div className="div">ПРОФИЛЬ: </div>
            <input
              className="div2"
              placeholder="Введите имя"
              value={fields.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              name="name"
              title="Нажмите на своё имя чтобы изменить его, затем нажмите Enter"
            />
            <div className="_1">{fields.projects} проект{fields.projects !== 1 ? 'а' : ''}</div>
          </div>
          <div className="frame-119">
            <div className="div3">УРОВЕНЬ: </div>
            <div className="frame-120">
              <div className="frame-82">
                <div className="rectangle-1"></div>
                <div className="rectangle-2" style={{ width: `${fields.progressPercentage}%` }}></div>
                <div className="rectangle-3" style={{ left: `${fields.progressPercentage - 3.54}%` }}></div>
              </div>
              <div className="frame-121">
                <div className="frame-83">
                  <div className="_76">{fields.progressPercentage}%</div>
                </div>
                <div className="frame-85">
                  <div className="_12">ур. {fields.level}</div>
                </div>
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
      <div className="frame-115">
        <div className="frame-143">
          <div className="div4">ОПИСАНИЕ: </div>
          <input
            className="div5"
            placeholder="Введите описание"
            value={fields.description}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            name="description"
            title="Нажмите на своё описание чтобы изменить его, затем нажмите Изменить описание"
          />
          <ButtonVariant1 text="Изменить описание" onClick={handleSubmit} />
        </div>
      </div>
      <div className="frame">
        <div className="frame-144">
          <div className="div">ПРОЕКТЫ: </div>
          <div className="frame-118">
          {projects.map(project => (
            <Cards1 key={project.project_id} project={project} />
          ))}
          </div>
        </div>
      </div>
      {/* <div className="frame-116">
        <div className="frame-145">
          <div className="div">Достижения </div>
          <div className="frame-1182">
            <div className="frame-128">
              <div className="frame-129"></div>
              <div className="frame-131">
                <div className="frame-130">
                  <div className="frame-132">
                    <div className="div11">Новичок </div>
                    <div className="div12">Создайте свой первый проект </div>
                  </div>
                  <div className="div13">Создайте свой первый проект </div>
                </div>
                <div className="_07-10-2024-14-00">
                  Достижение получено: 07.10.2024, 14:00{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
    );
};