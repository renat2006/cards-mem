// src/components/SettingsModal.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
} from '@mui/material';

const SettingsModal = ({ open, onClose, themeMode, setThemeMode, animationType, setAnimationType, fontSize, setFontSize }) => {
    const handleThemeChange = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
        localStorage.setItem('appTheme', newTheme);
    };

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
        localStorage.setItem('appFontSize', event.target.value);
    };

    const handleAnimationChange = (event) => {
        setAnimationType(event.target.value);
        localStorage.setItem('appAnimationType', event.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Настройки персонализации</DialogTitle>
            <DialogContent>
                {/* Тема */}
                <FormControlLabel
                    control={<Switch checked={themeMode === 'dark'} onChange={handleThemeChange} />}
                    label="Тёмная тема"
                    sx={{ marginBottom: 2 }}
                />

                {/* Размер шрифта */}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Размер шрифта</InputLabel>
                    <Select value={fontSize} onChange={handleFontSizeChange}>
                        <MenuItem value="small">Маленький</MenuItem>
                        <MenuItem value="medium">Средний</MenuItem>
                        <MenuItem value="large">Большой</MenuItem>
                    </Select>
                </FormControl>

                {/* Выбор анимации */}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Тип анимации</InputLabel>
                    <Select value={animationType} onChange={handleAnimationChange}>
                        <MenuItem value="fade">Плавное появление</MenuItem>
                        <MenuItem value="zoom">Увеличение</MenuItem>
                        <MenuItem value="slide">Скользящий переход</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsModal;
