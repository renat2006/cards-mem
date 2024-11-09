// src/components/CardDetail.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Breadcrumbs,
    Button
} from '@mui/material';
import Latex from 'react-latex-next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const CardDetail = ({ cards, themeMode, toggleTheme }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const card = cards.find((c) => c.id === parseInt(id, 10));

    if (!card) {
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
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Карточка не найдена
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{ marginTop: '20px' }}
                >
                    Назад
                </Button>
            </Box>
        );
    }

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
            {/* Хлебные крошки для навигации */}
            <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ marginBottom: '20px', color: themeMode === 'light' ? '#333' : 'white' }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: 'none',
                        color: themeMode === 'light' ? '#007bff' : '#90caf9',
                    }}
                >
                    Главная
                </Link>
                <Link
                    to="/generate-ticket"
                    style={{
                        textDecoration: 'none',
                        color: themeMode === 'light' ? '#007bff' : '#90caf9',
                    }}
                >
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
                <Typography variant="h3" gutterBottom>
                    {card.title}
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>

            {/* Контент карточки */}
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
                <Typography variant="body1">
                    <Latex>{card.content}</Latex>
                </Typography>
                {card.note && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                        <strong>Примечание:</strong> {card.note}
                    </Typography>
                )}
                {card.example && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                        <strong>Пример:</strong> {card.example.description}{' '}
                        <Latex>{card.example.value}</Latex>
                    </Typography>
                )}
            </Paper>
        </Box>
    );

};

export default CardDetail;
