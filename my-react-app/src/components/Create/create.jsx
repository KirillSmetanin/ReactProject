import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './create.css';
import 'aos/dist/aos.css';
import { ButtonVariant1, ButtonVariant2, ResizableTextarea } from '../props/props'

export const Create = ({ className, ...props }) => {
    const [fields, setFields] = useState({
        name: '',
        shortdescription: '',
        description: '',
        goal_amount: '',
        raised_amount: '',
        end_date: '',
        category: '',
        photo: null,
        news: ''
    });

    const editorRef = useRef(null);
    const newsEditorRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content, editor) => {
        setFields(prev => ({ ...prev, description: content }));
    };

    const handleNewsEditorChange = (content, editor) => {
        setFields(prev => ({ ...prev, news: content }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFields((prevFields) => ({
            ...prevFields,
            photo: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user_id = localStorage.getItem('userId'); // Получение user_id из localStorage

        const formData = new FormData();
        formData.append('user_id', user_id);

        for (const key in fields) {
            formData.append(key, fields[key]);
        }

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Проект успешно опубликован!');
                // Можно перенаправить пользователя на страницу проекта
                // window.location.href = '/project';
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            alert('Ошибка при публикации проекта: ' + error.message);
        }
    };


    const [activeTab, setActiveTab] = useState('Описание');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <div className="frame-98">
                <div className="frame-90">
                    <input type="file" name="photo" onChange={handleFileChange} className="frame-88" />
                    <div className="frame-41">
                        <div className="rectangle-2"></div>
                        <img className="pattern-1-1" src="pattern-1-10.svg" />
                        <div className="frame-66">
                            <div className="rectangle-1"></div>
                            <div className="rectangle-3"></div>
                            <img
                                className="acetone-2024918-21407-209-1"
                                src="acetone-2024918-21407-209-10.png"
                            />
                        </div>
                        <div className="rectangle-4"></div>
                        <img className="vector-10" src="vector-100.svg" />
                        <img className="vector-11" src="vector-110.svg" />
                        <div className="rectangle-5"></div>
                        <div className="rectangle-6"></div>
                        <div className="rectangle-7"></div>
                        <img className="pattern-1-2" src="pattern-1-20.svg" />
                        <div className="rectangle-8"></div>
                        <img className="rectangle-12" src="rectangle-120.png" />
                    </div>
                    <div className="ellipse-6"></div>
                    <div className="ellipse-7"></div>
                    <div className="ellipse-8"></div>
                </div>
            </div>
            <div className="frame-99">
                <ResizableTextarea
                    className="div"
                    value={fields.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="Введите название проекта"
                />
                <ResizableTextarea
                    className="div2"
                    value={fields.shortdescription}
                    onChange={handleChange}
                    name="shortdescription"
                    placeholder="Введите короткое описание"
                />
                <div className="frame-89">
                    <div className="frame-91">
                        <div className="frame-83">
                            <input className="_76"
                                type="date"
                                placeholder='Дата оканчания'
                                value={fields.end_date}
                                onChange={handleChange}
                                name="end_date"
                            ></input>
                        </div>
                        <div className="frame-92">
                            <div className="frame-86">
                                <input className="_23" placeholder='Введите категорию'
                                    value={fields.category}
                                    onChange={handleChange}
                                    name="category"
                                ></input>
                                <input className="_23" placeholder='Сколько собрано'
                                    value={fields.raised_amount}
                                    onChange={handleChange}
                                    name="raised_amount"
                                ></input>
                            </div>
                        </div>
                        <div className="frame-84">
                            <input className="_12000" placeholder='Сколько нужно денег'
                                value={fields.goal_amount}
                                onChange={handleChange}
                                name="goal_amount"
                            ></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="frame-93">
                <div className="frame-101">
                    <div className="frame-94">
                        <div className="tabs" >
                            <button
                                type="button"
                                className={activeTab === 'Описание' ? 'active' : ''}
                                onClick={() => handleTabClick('Описание')}
                            >
                                Описание
                            </button>
                            <button
                                type="button"
                                className={activeTab === 'Новости' ? 'active' : ''}
                                onClick={() => handleTabClick('Новости')}
                            >
                                Новости
                            </button>
                            <button
                                type="button"
                                className={activeTab === 'Комментарии' ? 'active' : ''}
                                onClick={() => handleTabClick('Комментарии')}
                            >
                                Комментарии
                            </button>
                            <button
                                type="button"
                                className={activeTab === 'Участники' ? 'active' : ''}
                                onClick={() => handleTabClick('Участники')}
                            >
                                Участники
                            </button>
                        </div>
                        <div className="frame-107">
                            <div className="div5">
                                {activeTab === 'Описание' && (
                                    <Editor
                                        apiKey="55jph7t58axoi1jainy1onksuizxa6ttcd6l5omm3jiigf1m"
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        value={fields.description}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'link image | code help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        onEditorChange={handleEditorChange}
                                    />
                                )}
                                {activeTab === 'Новости' && (
                                    <Editor
                                        apiKey="55jph7t58axoi1jainy1onksuizxa6ttcd6l5omm3jiigf1m"
                                        onInit={(evt, editor) => newsEditorRef.current = editor}
                                        value={fields.news}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist | ' +
                                                'link image | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        onEditorChange={handleNewsEditorChange}
                                    />
                                )}
                                {activeTab === 'Комментарии' && <div>В разработке</div>}
                                {activeTab === 'Участники' && <div>В разработке</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="frame-149">
                <ButtonVariant1 text="Создать стартап" type="submit" />
            </div>
        </form>
    );
};