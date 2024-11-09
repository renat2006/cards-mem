// src/components/SubjectSelector.jsx
import React from 'react';
import { Select, MenuItem } from '@mui/material';

const SubjectSelector = ({ subjects, selectedSubject, setSelectedSubject, themeMode }) => {
    return (
        <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            displayEmpty
            sx={{
                marginBottom: '20px',
                color: themeMode === 'light' ? 'black' : 'white',
                border: '1px solid',
                borderColor: themeMode === 'light' ? 'black' : 'white',
                borderRadius: '4px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                minWidth: '200px',
            }}
        >
            <MenuItem value="">Все предметы</MenuItem>
            {subjects.map((subject, index) => (
                <MenuItem key={index} value={subject.name}>
                    {subject.name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default React.memo(SubjectSelector);
