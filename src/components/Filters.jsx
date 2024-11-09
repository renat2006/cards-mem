// src/components/Filters.jsx
import React from 'react';
import {
    Box,
    Select,
    MenuItem,
    TextField,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    OutlinedInput
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Filters = ({
                     selectedTopic,
                     setSelectedTopic,
                     selectedType,
                     setSelectedType,
                     searchQuery,
                     setSearchQuery,
                     topics,
                     types,
                     themeMode
                 }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '20px',
            }}
        >
            {/* Фильтр по теме (множественный выбор) */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="topic-filter-label">Темы</InputLabel>
                <Select
                    labelId="topic-filter-label"
                    multiple
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    input={<OutlinedInput label="Темы" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    sx={{
                        color: themeMode === 'light' ? 'black' : 'white',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        backgroundColor: themeMode === 'light' ? 'white' : '#555',
                    }}
                >
                    {topics.map((topic) => (
                        <MenuItem key={topic} value={topic}>
                            <Checkbox checked={selectedTopic.indexOf(topic) > -1} />
                            <ListItemText primary={topic} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Фильтр по типу (множественный выбор) */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="type-filter-label">Тип</InputLabel>
                <Select
                    labelId="type-filter-label"
                    multiple
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    input={<OutlinedInput label="Тип" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    sx={{
                        color: themeMode === 'light' ? 'black' : 'white',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        backgroundColor: themeMode === 'light' ? 'white' : '#555',
                    }}
                >
                    {types.map((type) => (
                        <MenuItem key={type} value={type}>
                            <Checkbox checked={selectedType.indexOf(type) > -1} />
                            <ListItemText primary={type} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Поле поиска */}
            <TextField
                label="Поиск"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    minWidth: '200px',
                }}
            />
        </Box>
    );
};

export default React.memo(Filters);
