// src/components/CardDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Breadcrumbs,
    Button,
} from '@mui/material';
import Latex from 'react-latex-next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const CardDetail = ({ themeMode, toggleTheme }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Функция для загрузки JSON-файлов и поиска нужной карточки
        const fetchCard = async () => {
            try {
                const fileNames = ['all_1.json', 'all_maths_1.json', 'all_FBA_1.json', 'all_math_exam.json', 'all_math_exam_red.json']; // Укажите имена всех файлов JSON, которые хотите проверить
                let foundCard = null;

                for (const fileName of fileNames) {
                    const response = await fetch(`/data/${fileName}`);
                    if (response.ok) {
                        const data = await response.json();
                        foundCard = data.find((c) => c.id === parseInt(id, 10));
                        if (foundCard) break;
                    }
                }

                if (foundCard) {
                    setCard(foundCard);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error loading card data:', error);
                setNotFound(true);
            }
        };

        fetchCard();
    }, [id]);

    if (notFound) {
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

    if (!card) {
        return <Typography>Загрузка...</Typography>;
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
                <Typography color="textPrimary"><Latex>{card.title}</Latex></Typography>
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
                    <Latex> {card.title}</Latex>
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
                    maxWidth: '1200px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="body1" sx={{ textAlign: 'center',  whiteSpace: 'pre-wrap',


                    overflowWrap: 'break-word', }}>
                    <Latex>{card.content}</Latex>
                </Typography>
                {card.note && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                        <strong>Примечание:</strong> <Latex>{card.note}</Latex>
                    </Typography>
                )}
                {card.example && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                        <strong>{<Latex>{card.example.description}{' '}</Latex>}</strong>
                        <Latex>{card.example.value}</Latex>
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default CardDetail;
