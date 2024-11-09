// src/components/TicketGenerator.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';

const TicketGenerator = ({ cards, themeMode, toggleTheme }) => {
    const [ticket, setTicket] = useState([]);

    // Загрузка билета из localStorage при монтировании компонента
    useEffect(() => {
        const savedTicket = localStorage.getItem('examTicket');
        if (savedTicket) {
            setTicket(JSON.parse(savedTicket));
        }
    }, []);

    // Функция для генерации билета с определённой структурой
    const generateTicket = () => {
        const sections = [
            { title: 'Определения', count: 5, type: 'Определение' },
            { title: 'Алгоритм/Определение', count: 1, type: 'Алгоритм' },
            { title: 'Формулировки', count: 2, type: 'Формулировка' },
            { title: 'Доказательства', count: 2, type: 'Доказательство' },
            { title: 'Продвинутый уровень', count: 2, type: 'Продвинутый' },
        ];

        const generatedTicket = sections.map((section) => {
            const filteredCards = cards.filter((card) => card.type === section.type);
            if (filteredCards.length === 0) {
                return { ...section, cards: [] };
            }
            const randomCards = Array.from({ length: section.count }, () => {
                const randomIndex = Math.floor(Math.random() * filteredCards.length);
                return filteredCards[randomIndex];
            });
            return { ...section, cards: randomCards };
        });

        setTicket(generatedTicket);
        localStorage.setItem('examTicket', JSON.stringify(generatedTicket));
    };

    // Функция для сброса билета
    const resetTicket = () => {
        setTicket([]);
        localStorage.removeItem('examTicket');
    };

    return (
        <Box
            sx={{
                bgcolor: themeMode === 'light' ? '#f5f5f5' : 'black',
                minHeight: '100vh',
                padding: '20px',
                color: themeMode === 'light' ? '#333' : 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
            }}
        >
            {/* Заголовок и переключение темы */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1200px',
                    flexWrap: 'wrap',
                }}
            >
                <Typography variant="h2" gutterBottom align="center">
                    Генерация билетов
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>

            {/* Кнопки генерации и сброса билета */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={generateTicket}>
                    Сгенерировать билет
                </Button>
                <Button variant="outlined" color="secondary" onClick={resetTicket}>
                    Сбросить билет
                </Button>
            </Box>

            {/* Отображение билета */}
            {ticket.length > 0 ? (
                <Paper
                    elevation={3}
                    sx={{
                        padding: '20px',
                        background: themeMode === 'light' ? '#ffffff' : '#333',
                        borderRadius: '10px',
                        color: themeMode === 'light' ? '#333' : 'white',
                        width: '100%',
                        maxWidth: '800px',
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center">
                        Экзаменационный билет
                    </Typography>
                    <Grid container spacing={3}>
                        {ticket.map((section, sectionIndex) => (
                            <Grid item xs={12} key={sectionIndex}>
                                <Typography variant="h5" gutterBottom>
                                    {section.title}
                                </Typography>
                                {section.cards.length > 0 ? (
                                    section.cards.map((card, index) => (
                                        <Paper
                                            key={index}
                                            elevation={2}
                                            sx={{
                                                padding: '15px',
                                                marginBottom: '10px',
                                                background: themeMode === 'light' ? '#ffffff' : '#444',
                                                color: themeMode === 'light' ? '#333' : 'white',
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                                                {card ? `${index + 1}. ${card.title}` : 'Нет доступных карточек'}
                                            </Typography>
                                            {card && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    component={Link}
                                                    to={`/card/${card.id}`}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    Открыть карточку
                                                </Button>
                                            )}
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ color: themeMode === 'light' ? '#999' : '#ccc' }}>
                                        Нет доступных карточек для этой секции
                                    </Typography>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            ) : (
                <Typography variant="body1">Нажмите кнопку, чтобы сгенерировать билет.</Typography>
            )}
        </Box>
    );

};

export default TicketGenerator;
