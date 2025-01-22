// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    TextField,
    CssBaseline,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { FixedSizeList } from 'react-window'; // Импорт react-window
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import 'katex/dist/katex.min.css'; // Подключение стилей для LaTeX
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Latex from 'react-latex-next';
import TicketGenerator from './components/TicketGenerator';
import CardDetail from './components/CardDetail';
import CardViewer from './components/CardViewer';
import SubjectSelector from './components/SubjectSelector';
import Filters from './components/Filters';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

// Список доступных предметов и соответствующие им файлы данных
const subjects = [
    {
        name: 'Линейная алгебра',
        dataFiles: ['all_1.json'],
    },
    {
        name: 'Матан',
        dataFiles: ['all_maths_1.json'],
    },
    {
        name:"ОБА",
        dataFiles: ['all_FBA_1.json']
    },
    {
        name:"Матан Экзамен Синий",
        dataFiles: ['all_math_exam.json']
    },
    {
        name:"Матан Экзамен Красный",
        dataFiles: ['all_math_exam.json','all_math_exam_red.json']
    }
    // Добавьте другие предметы здесь
];

// Универсальная функция загрузки карточек для выбранного предмета
const loadCards = async (dataFiles) => {
    let allCards = [];

    for (const filename of dataFiles) {
        try {
            const response = await fetch(`/data/${filename}`);
            if (!response.ok) {
                console.warn(`Не удалось загрузить файл: ${filename}`);
                continue;
            }
            const fileData = await response.json();
            allCards = [...allCards, ...fileData];
        } catch (error) {
            console.error(`Ошибка при загрузке файла ${filename}:`, error);
        }
    }

    return allCards;
};

// Компонент для виртуализации списка опций Autocomplete (если используется)
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemCount = children.length;
    const itemSize = 48; // Высота одного элемента

    return (
        <div ref={ref}>
            <FixedSizeList
                height={Math.min(8, itemCount) * itemSize} // Отображать максимум 8 элементов без прокрутки
                width="100%"
                itemSize={itemSize}
                itemCount={itemCount}
                {...other}
            >
                {({ index, style }) => <div style={style}>{children[index]}</div>}
            </FixedSizeList>
        </div>
    );
});

const App = () => {
    // Инициализация темы из localStorage или установка по умолчанию
    const [themeMode, setThemeMode] = useState(() => {
        const savedTheme = localStorage.getItem('appTheme');
        return savedTheme ? savedTheme : 'light';
    });

    const toggleTheme = useCallback(() => {
        setThemeMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('appTheme', newMode); // Сохранение темы в localStorage
            return newMode;
        });
    }, []);


    // Создание темы MUI на основе состояния themeMode
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    primary: {
                        main: '#1976d2',
                    },
                    secondary: {
                        main: '#dc004e',
                    },
                },
            }),
        [themeMode]
    );

    const [cards, setCards] = useState([]); // Все карточки из выбранного предмета
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState([]); // Фильтр по теме (множественный выбор)
    const [selectedType, setSelectedType] = useState([]); // Фильтр по типу (множественный выбор)
    const [searchQuery, setSearchQuery] = useState(''); // Поисковый запрос
    const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
    const [cardNumberInput, setCardNumberInput] = useState(''); // Поле ввода номера карточки

    // Функция загрузки карточек при изменении выбранного предмета
    useEffect(() => {
        const fetchData = async () => {
            const subject = subjects.find((subj) => subj.name === selectedSubject);
            if (subject) {
                const loadedCards = await loadCards(subject.dataFiles);
                setCards(loadedCards);
                setCurrentCardIndex(0);
                setFlipped(false);
                setCardNumberInput(''); // Очистка ввода номера при смене предмета
            }
        };

        fetchData();
    }, [selectedSubject]);

    // Получение уникальных тем и типов для фильтров
    const topics = useMemo(() => {
        return Array.from(new Set(cards.map((card) => card.topic)));
    }, [cards]);

    const types = useMemo(() => {
        return Array.from(new Set(cards.map((card) => card.type)));
    }, [cards]);

    // Фильтрация карточек
    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            if (!card) return false;
            const matchesTopic =
                selectedTopic.length > 0 ? selectedTopic.includes(card.topic) : true;
            const matchesType =
                selectedType.length > 0 ? selectedType.includes(card.type) : true;
            const matchesQuery = searchQuery
                ? card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.content?.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesTopic && matchesType && matchesQuery;
        });
    }, [cards, selectedTopic, selectedType, searchQuery]);

    // Функции навигации по карточкам
    const handleRandomCard = useCallback(() => {
        if (filteredCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredCards.length);
            setCurrentCardIndex(randomIndex);
            setFlipped(false);
            setCardNumberInput(''); // Очистка ввода номера при случайном выборе
        }
    }, [filteredCards]);

    const handleNextCard = useCallback(() => {
        if (filteredCards.length > 0) {
            setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
            setFlipped(false);
            setCardNumberInput(''); // Очистка ввода номера при переходе
        }
    }, [filteredCards]);

    const handlePreviousCard = useCallback(() => {
        if (filteredCards.length > 0) {
            setCurrentCardIndex((prevIndex) =>
                (prevIndex - 1 + filteredCards.length) % filteredCards.length
            );
            setFlipped(false);
            setCardNumberInput(''); // Очистка ввода номера при переходе
        }
    }, [filteredCards]);

    // Функция перехода к конкретной карточке через номерный ввод
    const handleGotoCardByNumber = () => {
        const number = parseInt(cardNumberInput, 10);
        if (!isNaN(number) && number >= 1 && number <= filteredCards.length) {
            setCurrentCardIndex(number - 1);
            setFlipped(false);
        } else {
            alert('Пожалуйста, введите корректный номер карточки.');
        }
    };

    // Подготовка опций для Autocomplete (если используется)
    const cardOptions = useMemo(() => {
        return filteredCards.map((card, index) => ({
            label: `Карточка ${index + 1}: ${card.title}`,
            index: index,
        }));
    }, [filteredCards]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box
                    sx={{
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        minHeight: '100vh',
                        padding: { xs: '10px', sm: '20px' }, // Адаптивные отступы
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    {/* Заголовок и переключение темы */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            maxWidth: '1200px',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                        }}
                                    >
                                        <Typography variant="h2" gutterBottom align="center" sx={{ flexGrow: 1 }}>
                                            {selectedSubject}
                                        </Typography>
                                        <ThemeToggle themeMode={themeMode} toggleTheme={toggleTheme} />
                                    </Box>

                                    {/* Кнопка перехода к генератору билетов */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                            width: '100%',
                                            maxWidth: '1200px',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            component={Link}
                                            to="/generate-ticket"
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Перейти к генератору билетов
                                        </Button>
                                    </Box>

                                    {/* Выбор предмета */}
                                    <SubjectSelector
                                        subjects={subjects}
                                        selectedSubject={selectedSubject}
                                        setSelectedSubject={setSelectedSubject}
                                        themeMode={themeMode}
                                    />

                                    {/* Улучшенные фильтры */}
                                    <Filters
                                        selectedTopic={selectedTopic}
                                        setSelectedTopic={setSelectedTopic}
                                        selectedType={selectedType}
                                        setSelectedType={setSelectedType}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        topics={topics}
                                        types={types}
                                        themeMode={themeMode}
                                    />

                                    {/* Кнопка для выбора случайной карточки */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                            width: '100%',
                                            maxWidth: '1200px',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleRandomCard}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Случайная карточка
                                        </Button>
                                    </Box>
                                    <Typography variant="h6" gutterBottom align="center" sx={{ flexGrow: 1 }}>
                                       P. S. Нажми на карточку, чтобы узнать верный ответ :)
                                    </Typography>
                                    {/* Отображение карточки */}
                                    <CardViewer
                                        card={filteredCards[currentCardIndex]}
                                        flipped={flipped}
                                        setFlipped={setFlipped}
                                        themeMode={themeMode}
                                    />

                                    {/* Навигация по карточкам */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            marginTop: '40px',
                                            width: '100%',
                                            maxWidth: '1200px',
                                        }}
                                    >
                                        {/* Кнопки навигации */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <IconButton
                                                onClick={handlePreviousCard}
                                                sx={{ color: themeMode === 'light' ? 'black' : 'white' }}
                                            >
                                                <ArrowBackIcon />
                                            </IconButton>
                                            <Typography variant="body1">
                                                {filteredCards.length > 0
                                                    ? `${currentCardIndex + 1} / ${filteredCards.length}`
                                                    : 'Нет карточек'}
                                            </Typography>
                                            <IconButton
                                                onClick={handleNextCard}
                                                sx={{ color: themeMode === 'light' ? 'black' : 'white' }}
                                            >
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </Box>

                                        {/* Новый фильтр по номеру карточки */}
                                        <Box
                                            sx={{
                                                width: '100%',
                                                maxWidth: 300,
                                                marginTop: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px',
                                            }}
                                        >
                                            <TextField
                                                label="Номер карточки"
                                                variant="outlined"
                                                type="number"
                                                value={cardNumberInput}
                                                onChange={(e) => setCardNumberInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleGotoCardByNumber();
                                                    }
                                                }}
                                                sx={{
                                                    input: { color: themeMode === 'light' ? 'black' : 'white' },
                                                    label: { color: themeMode === 'light' ? 'black' : 'white' },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: themeMode === 'light' ? 'black' : 'white',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: themeMode === 'light' ? 'black' : 'white',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: themeMode === 'light' ? 'black' : 'white',
                                                        },
                                                    },
                                                    backgroundColor: themeMode === 'light' ? 'white' : '#555',
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleGotoCardByNumber}
                                                sx={{ width: '100%' }}
                                            >
                                                Перейти
                                            </Button>
                                        </Box>

                                        {/* Если Autocomplete все еще нужен, можно его оставить */}
                                        {/* {filteredCards.length > 0 && (
                                            <Box sx={{ width: '100%', maxWidth: 300, marginTop: '20px' }}>
                                                <Autocomplete
                                                    ListboxComponent={ListboxComponent}
                                                    options={cardOptions}
                                                    getOptionLabel={(option) => option.label}
                                                    onChange={handleGotoCard}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Перейти к карточке"
                                                            variant="outlined"
                                                            sx={{
                                                                input: { color: themeMode === 'light' ? 'black' : 'white' },
                                                                label: { color: themeMode === 'light' ? 'black' : 'white' },
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': {
                                                                        borderColor: themeMode === 'light' ? 'black' : 'white',
                                                                    },
                                                                    '&:hover fieldset': {
                                                                        borderColor: themeMode === 'light' ? 'black' : 'white',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: themeMode === 'light' ? 'black' : 'white',
                                                                    },
                                                                },
                                                                backgroundColor: themeMode === 'light' ? 'white' : '#555',
                                                            }}
                                                        />
                                                    )}
                                                    clearOnEscape
                                                    noOptionsText="Нет совпадений"
                                                />
                                            </Box>
                                        )} */}
                                    </Box>
                                </>
                            }
                        />
                        <Route
                            path="/generate-ticket"
                            element={
                                <TicketGenerator
                                    cards={cards}
                                    themeMode={themeMode}
                                    toggleTheme={toggleTheme}
                                    subjects={subjects}
                                    selectedSubject={selectedSubject}
                                    setSelectedSubject={setSelectedSubject}
                                />
                            }
                        />

                        <Route
                            path="/card/:id"
                            element={<CardDetail cards={cards} themeMode={themeMode} toggleTheme={toggleTheme} />}
                        />
                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
    );

};

export default App;
