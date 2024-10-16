import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Select, MenuItem, TextField } from '@mui/material';
import FlipIcon from '@mui/icons-material/Flip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import 'katex/dist/katex.min.css'; // Подключение стилей для LaTeX
import Latex from 'react-latex-next';
import './App.css';

// Функция для загрузки всех JSON-файлов из папки /public/data/
const loadAllCardsFromDataFolder = async () => {
    const filenames = ['cardsData_Tema1_full.json', 'tema2.json']; // Добавьте все файлы, которые хотите загрузить
    let allCards = [];

    // Асинхронно загружаем каждый файл
    for (const filename of filenames) {
        const response = await fetch(`/data/${filename}`);
        const fileData = await response.json();
        allCards = [...allCards, ...fileData];
    }
    return allCards;
};

const App = () => {
    const [cards, setCards] = useState([]); // Все карточки из всех JSON-файлов
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(''); // Фильтр по теме
    const [selectedType, setSelectedType] = useState(''); // Фильтр по типу
    const [searchQuery, setSearchQuery] = useState(''); // Поисковый запрос

    // Загрузка всех карточек из папки /public/data/ при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            const allCards = await loadAllCardsFromDataFolder();
            setCards(allCards);
        };

        fetchData();
    }, []);

    // Функция для переключения случайной карточки
    const handleRandomCard = () => {
        if (filteredCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredCards.length);
            setFlipped(false); // Сброс переворота
            setCurrentCardIndex(randomIndex);
        }
    };

    // Функция для переключения на следующую карточку
    const handleNextCard = () => {
        if (filteredCards.length > 0) {
            setFlipped(false); // Сброс переворота
            setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
        }
    };

    // Функция для переключения на предыдущую карточку
    const handlePreviousCard = () => {
        if (filteredCards.length > 0) {
            setFlipped(false); // Сброс переворота
            setCurrentCardIndex((prevIndex) => (prevIndex - 1 + filteredCards.length) % filteredCards.length);
        }
    };

    // Фильтрация карточек по теме, типу и поисковому запросу
    const filteredCards = cards.filter((card) => {
        if (!card) return false;
        const matchesTopic = selectedTopic ? card.topic === selectedTopic : true;
        const matchesType = selectedType ? card.type === selectedType : true;
        const matchesQuery = searchQuery
            ? card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.content?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesTopic && matchesType && matchesQuery;
    });

    return (
        <Box sx={{ bgcolor: 'black', minHeight: '100vh', padding: '20px', color: 'white' }}>
            <Typography variant="h2" gutterBottom align="center">
                Линал
            </Typography>

            {/* Фильтр по теме */}
            <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    displayEmpty
                    sx={{
                        marginRight: '10px',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        mb: '10px',
                    }}
                >
                    <MenuItem value="">Все темы</MenuItem>
                    {Array.from(new Set(cards.map(card => card.topic))).map((topic, index) => (
                        <MenuItem key={index} value={topic}>{topic}</MenuItem>
                    ))}
                </Select>

                {/* Фильтр по типу */}
                <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    displayEmpty
                    sx={{
                        marginRight: '10px',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        mb: '10px',
                    }}
                >
                    <MenuItem value="">Все типы</MenuItem>
                    <MenuItem value="Определение">Определение</MenuItem>
                    <MenuItem value="Формулировка">Формулировка</MenuItem>
                    <MenuItem value="Алгоритм">Алгоритм</MenuItem>
                </Select>

                {/* Поле поиска */}
                <TextField
                    label="Поиск"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        input: { color: 'white' },
                        label: { color: 'white' },
                        border: '1px solid white',
                        borderRadius: '4px',
                        mb: '10px',
                    }}
                />
            </Box>

            {/* Кнопка для выбора случайной карточки */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleRandomCard}>
                    Случайная карточка
                </Button>
            </Box>

            {filteredCards.length > 0 && filteredCards[currentCardIndex] ? (
                <Box
                    className={`flip-card ${flipped ? 'flipped' : ''}`}
                    sx={{
                        perspective: '1000px',
                        margin: '0 auto',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '600px',
                        height: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        className="flip-card-inner"
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            transform: flipped ? 'rotateY(180deg)' : 'none',
                        }}
                    >
                        <Box
                            className="flip-card-front"
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '20px',
                                padding: '20px',
                                overflow: 'auto',
                                '@media (max-width: 600px)': {
                                    padding: '10px', // Снижение отступов на мобильных устройствах
                                    textAlign: 'center' // Исправление смещения на мобильных устройствах
                                },
                            }}
                        >
                            <Typography variant="h5" sx={{ wordWrap: 'break-word' }}>
                                {filteredCards[currentCardIndex]?.title}
                            </Typography>
                        </Box>
                        <Box
                            className="flip-card-back"
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                transform: 'rotateY(180deg)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '20px',
                                padding: '20px',
                                overflow: 'auto',
                                '@media (max-width: 600px)': {
                                    padding: '10px', // Снижение отступов на мобильных устройствах
                                    textAlign: 'center'
                                },
                            }}
                        >
                            <Typography variant="body1">
                                <Latex>{filteredCards[currentCardIndex]?.content}</Latex>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Кнопка переворота карточки */}
                    <IconButton
                        onClick={() => setFlipped(!flipped)}
                        sx={{ position: 'absolute', top: '30px', right: '30px', color: 'white' }}
                    >
                        <FlipIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography variant="h4" align="center" sx={{ marginTop: '20px' }}>
                    Нет карточек по выбранным фильтрам
                </Typography>
            )}

            {/* Навигация по карточкам */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: '40px' }}>
                <IconButton onClick={handlePreviousCard} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="body1" sx={{ margin: '0 10px' }}>
                    {filteredCards.length > 0 ? `${currentCardIndex + 1} / ${filteredCards.length}` : ''}
                </Typography>
                <IconButton onClick={handleNextCard} sx={{ color: 'white' }}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default App;
