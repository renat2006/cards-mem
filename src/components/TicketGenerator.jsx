import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useNavigate } from 'react-router-dom';

const subjectStructures = {
    'Линейная алгебра': [
        { title: 'Определения', count: 5, type: 'Определение' },
        { title: 'Алгоритмы', count: 1, type: 'Алгоритм' },
        { title: 'Теоремы', count: 2, type: 'Формулировка' },
    ],
    'Матан': [
        { title: 'Определения в кванторах', count: 1, type: 'Определение или формулировка в кванторах' },
        { title: 'Определения', count: 2, type: 'Определение' },
        { title: 'Формулировки теорем', count: 1, type: 'Формулировка' },
        { title: 'Доказательства', count: 2, type: 'Формулировка и доказательство' },
        { title: 'Теоретическая задача', count: 1, type: 'Задача' },
    ],
};

const TicketGenerator = ({ cards = [], themeMode, toggleTheme, subjects, selectedSubject, setSelectedSubject }) => {
    const [ticket, setTicket] = useState([]);
    const [customStructure, setCustomStructure] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка сохраненного билета из localStorage при загрузке компонента
        const savedTicket = localStorage.getItem('examTicket');
        if (savedTicket) {
            setTicket(JSON.parse(savedTicket));
        }
    }, []);

    useEffect(() => {
        setCustomStructure(subjectStructures[selectedSubject] || []);
    }, [selectedSubject]);

    const generateTicket = () => {
        if (!cards.length || !customStructure.length) return;

        const generatedTicket = customStructure.map((section) => {
            const filteredCards = cards.filter((card) => card.type === section.type);
            const selectedCards = Array.from({ length: section.count }, () => {
                const randomIndex = Math.floor(Math.random() * filteredCards.length);
                return filteredCards[randomIndex];
            });
            return { ...section, cards: selectedCards.filter(Boolean) };
        });

        setTicket(generatedTicket);
        localStorage.setItem('examTicket', JSON.stringify(generatedTicket));
    };

    const addSection = () => {
        setCustomStructure([...customStructure, { title: '', count: 1, type: '' }]);
    };

    const handleStructureChange = (index, field, value) => {
        const updatedStructure = [...customStructure];
        updatedStructure[index][field] = field === 'count' ? Number(value) : value;
        setCustomStructure(updatedStructure);
    };

    const resetTicket = () => {
        setTicket([]);
        localStorage.removeItem('examTicket');
    };

    return (
        <Box
            sx={{
                bgcolor: themeMode === 'light' ? '#f5f5f5' : 'black',
                minHeight: '100vh',
                padding: { xs: '10px', sm: '20px' },
                color: themeMode === 'light' ? '#333' : 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: '15px', sm: '20px' },
            }}
        >
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
                <Typography variant="h4" gutterBottom align="center">
                    Генерация билетов для {selectedSubject}
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>

            <Box sx={{ width: '100%', maxWidth: '400px', mb: 3 }}>
                <Select
                    label="Выберите предмет"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    fullWidth
                >
                    {subjects.map((subject) => (
                        <MenuItem key={subject.name} value={subject.name}>
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box sx={{ width: '100%', maxWidth: '800px', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Настройка структуры билета
                </Typography>
                {customStructure.map((section, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '10px', mb: 2 }}>
                        <TextField
                            label="Название раздела"
                            value={section.title}
                            onChange={(e) => handleStructureChange(index, 'title', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Количество"
                            type="number"
                            value={section.count}
                            onChange={(e) => handleStructureChange(index, 'count', e.target.value)}
                            sx={{ width: '80px' }}
                        />
                        <Select
                            label="Тип"
                            value={section.type}
                            onChange={(e) => handleStructureChange(index, 'type', e.target.value)}
                            sx={{ flex: 1 }}
                        >
                            {Array.from(new Set(cards.map((card) => card.type))).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                ))}
                <Button variant="outlined" onClick={addSection} sx={{ mt: 2 }}>
                    Добавить раздел
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '10px', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={generateTicket} fullWidth>
                    Сгенерировать билет
                </Button>
                <Button variant="outlined" color="secondary" onClick={resetTicket} fullWidth>
                    Сбросить билет
                </Button>
                <Button variant="outlined" color="primary" onClick={() => navigate('/')} fullWidth>
                    Назад к карточкам
                </Button>
            </Box>

            {ticket.length > 0 ? (
                <Paper
                    elevation={3}
                    sx={{
                        padding: { xs: '15px', sm: '20px' },
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
