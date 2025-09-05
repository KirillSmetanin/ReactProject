import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './projectdetails.css';
import { ButtonVariant1, ButtonVariant2 } from '../props/props';

export const ProjectDetails = ({ className, ...props }) => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('Описание');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSupportClick = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/create-backing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    project_id: projectId,
                    amount: parseFloat(paymentAmount)
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Здесь можно добавить интеграцию с платежной системой (например, ЮKassa)
                // В демо-версии просто имитируем успешный платеж
                await fetch('/api/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        backing_id: result.backing_id,
                        status: 'completed'
                    })
                });

                alert('Платеж успешно завершен! Спасибо за поддержку проекта.');
                setShowPaymentModal(false);
                // Обновляем данные проекта
                const projectResponse = await fetch(`/api/getproject/${projectId}`);
                const projectData = await projectResponse.json();
                setProject(projectData);
            } else {
                throw new Error(result.message || 'Ошибка при создании записи о поддержке');
            }
        } catch (error) {
            console.error('Ошибка платежа:', error);
            alert('Ошибка: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`/api/getproject/${projectId}`);
                const result = await response.json();
                setProject(result);
            } catch (error) {
                console.error('Ошибка при загрузке данных проекта:', error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (!project) {
        return <div>Загрузка...</div>;
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const percentageRaised = project.goal_amount > 0
        ? Math.min(100, Math.round((project.raised_amount / project.goal_amount) * 100))
        : 0;

    const daysLeft = project.end_date ? Math.max(0, Math.ceil((new Date(project.end_date.replace(' ', 'T')) - new Date()) / (1000 * 60 * 60 * 24))) : 'N/A';
    const launchDate = project.created_at ? new Date(project.created_at.replace(' ', 'T')).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : 'N/A';

    const handleRemind = async () => {
        try {
            const response = await fetch('/api/remindProjectEnd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: project.email_user, endDate: project.end_date, projectName: project.project_name })
            });

            if (response.ok) {
                alert('Напоминание отправлено успешно!');
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            alert('Ошибка при отправке напоминания: ' + error.message);
        }
    };

    return (
        <div className="frame-87">

            {/* Модальное окно оплаты */}
            {showPaymentModal && (
                <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Поддержать проект: {project?.project_name}</h3>
                        <form onSubmit={handlePaymentSubmit}>
                            <div className="payment-input-group">
                                <label>Сумма поддержки:</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    min="1"
                                    step="1"
                                    required
                                    placeholder="Введите сумму"
                                />
                            </div>
                            <div className="payment-actions">
                                <button
                                    type="button"
                                    className="payment-cancel"
                                    onClick={() => setShowPaymentModal(false)}
                                    disabled={isProcessing}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="payment-confirm"
                                    disabled={isProcessing || !paymentAmount}
                                >
                                    {isProcessing ? 'Обработка...' : 'Подтвердить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="frame-98">
                <div className="frame-90">
                    <img className="frame-88" src={project.project_image || "frame-880.png"} alt={project.project_name} />
                    <div className="frame-41">
                        <div className="rectangle-2"></div>
                        <img className="pattern-1-1" src="../../pattern-1-10.svg" />
                        <div className="frame-66">
                            <div className="rectangle-1"></div>
                            <div className="rectangle-3"></div>
                            <img
                                className="acetone-2024918-21407-209-1"
                                src="../../acetone-2024918-21407-209-10.png"
                            />
                        </div>
                        <div className="rectangle-4"></div>
                        <img className="vector-10" src="../../vector-100.svg" />
                        <img className="vector-11" src="../../vector-110.svg" />
                        <div className="rectangle-5"></div>
                        <div className="rectangle-6"></div>
                        <div className="rectangle-7"></div>
                        <img className="pattern-1-2" src="../../pattern-1-20.svg" />
                        <div className="rectangle-8"></div>
                        <img className="rectangle-12" src="../../rectangle-120.png" />
                    </div>
                    <div className="ellipse-6"></div>
                    <div className="ellipse-7"></div>
                    <div className="ellipse-8"></div>
                </div>
            </div>
            <div className="frame-99">
                <div className="div">{project.project_name}</div>
                <div className="div2">{project.category}</div>
                <div className="div2">{project.short_description}</div>
                <div className="frame-89">
                    <div className="frame-82">
                        <div className="rectangle-13"></div>
                        <div className="rectangle-22"
                            style={{ width: `${percentageRaised}%` }}
                        ></div>
                        <div className="rectangle-32"
                            style={{ left: `${percentageRaised}%` }}
                        ></div>
                    </div>
                    <div className="frame-91">
                        <div className="frame-83">
                            <div className="_76">{percentageRaised}%</div>
                            <div className="div3">Идёт сбор</div>
                        </div>
                        <div className="frame-92">
                            <div className="frame-85">
                                <div className="_23">{project.support_count} раза</div>
                                <div className="div3">Поддержали</div>
                            </div>
                            <div className="frame-86">
                                <div className="_23">{daysLeft} дней</div>
                                <div className="div3">Осталось</div>
                            </div>
                            <div className="frame-872">
                                <div className="_14">{launchDate}</div>
                                <div className="div3">Запущен</div>
                            </div>
                        </div>
                        <div className="frame-84">
                            <div className="_12000">Собрано {project.raised_amount}</div>
                            <div className="_18000">из {project.goal_amount}</div>
                        </div>
                    </div>
                </div>
                <div className="frame-109">
                    <ButtonVariant1
                        className="button"
                        text="Поддержать проект"
                        onClick={handleSupportClick}
                    />
                    <ButtonVariant2 className="button2" onClick={handleRemind} text="Напомнить об окончании" />
                </div>
            </div>
            <div className="frame-93">
                <div className="frame-101">
                    <div className="frame-94">
                        <div className="tabs">
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
                                {activeTab === 'Описание' &&
                                    <div className="div5-span" dangerouslySetInnerHTML={{ __html: project.full_description }}></div>
                                }
                                {activeTab === 'Новости' &&
                                    <div className="div5-span" dangerouslySetInnerHTML={{ __html: project.news }}></div>
                                }
                                {activeTab === 'Комментарии' && <div>В разработке</div>}
                                {activeTab === 'Участники' && <div>В разработке</div>}
                            </div>
                        </div>
                    </div>
                    <div className="frame-95">
                        <div className="frame-96">
                            <img className="ellipse" src={project.profile_image || "ellipse0.png"} alt="Автор" />
                            <div className="frame-97">
                                <div className="div6">АВТОР</div>
                                <div className="div4">{project.creator_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
