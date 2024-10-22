// Компонент для отображения подробной информации о карточке
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, IconButton, Paper, Breadcrumbs, Button } from '@mui/material';
import Latex from 'react-latex-next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const CardDetail = ({ cards, theme, toggleTheme, ticket }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const card = cards.find((c) => c.id === parseInt(id, 10));

    if (!card) {
        return (
            <Box sx={{ bgcolor: theme === 'light' ? '#f5f5f5' : 'black', minHeight: '100vh', padding: '20px', color: theme === 'light' ? '#333' : 'white' }}>
                <Typography variant="h4">Карточка не найдена</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: theme === 'light' ? '#f5f5f5' : 'black', minHeight: '100vh', padding: '20px', color: theme === 'light' ? '#333' : 'white' }}>
            {/* Хлебные крошки для навигации */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px', color: theme === 'light' ? '#333' : 'white' }}>
                <Link to="/" style={{ textDecoration: 'none', color: theme === 'light' ? '#007bff' : '#90caf9' }}>
                    Главная
                </Link>
                <Link to="/generate-ticket" style={{ textDecoration: 'none', color: theme === 'light' ? '#007bff' : '#90caf9' }}>
                    Сгенерированный билет
                </Link>
                <Typography color="textPrimary">{card.title}</Typography>
            </Breadcrumbs>

            {/* Кнопка "Назад к билету" */}
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(-1)}
                sx={{ marginBottom: '20px' }}
            >
                Назад к билету
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h3" gutterBottom>
                    {card.title}
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>

            <Paper elevation={3} sx={{ padding: '20px', background: theme === 'light' ? '#ffffff' : '#333', borderRadius: '10px', color: theme === 'light' ? '#333' : 'white' }}>
                <Typography variant="body1">
                    <Latex>{card.content}</Latex>
                </Typography>
            </Paper>
        </Box>
    );
};

export default CardDetail;
