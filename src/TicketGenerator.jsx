import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';

const TicketGenerator = ({ cards, theme, toggleTheme }) => {
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

    return (
        <Box sx={{ bgcolor: theme === 'light' ? '#f5f5f5' : 'black', minHeight: '100vh', padding: '20px', color: theme === 'light' ? '#333' : 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h2" gutterBottom align="center" sx={{ color: theme === 'light' ? '#333' : 'white' }}>
                    Генерация билетов
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={generateTicket}>
                    Сгенерировать билет
                </Button>
            </Box>

            {ticket.length > 0 && (
                <Paper elevation={3} sx={{ padding: '20px', background: theme === 'light' ? '#ffffff' : '#333', borderRadius: '10px', color: theme === 'light' ? '#333' : 'white' }}>
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
                                        <Paper key={index} elevation={2} sx={{ padding: '15px', marginBottom: '10px', background: theme === 'light' ? '#ffffff' : '#444', color: theme === 'light' ? '#333' : 'white' }}>
                                            <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                                                {card ? `${index + 1}. ${card.title}` : 'Нет доступных карточек'}
                                            </Typography>
                                            {card && (
                                                <Button variant="outlined" color="primary" component={Link} to={`/card/${card.id}`}>
                                                    Открыть карточку
                                                </Button>
                                            )}
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ color: theme === 'light' ? '#999' : '#ccc' }}>
                                        Нет доступных карточек для этой секции
                                    </Typography>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};

export default TicketGenerator;
