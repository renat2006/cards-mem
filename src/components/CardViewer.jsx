// src/components/CardViewer.jsx
import React from 'react';
import { Box, Typography, Button, Fade, Zoom, Chip } from '@mui/material';
import Latex from 'react-latex-next';
import { Link } from 'react-router-dom';
const parseBoldText = (text) => {

    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index}>
                    {part.slice(2, -2)} {/* Убираем ** */}
                </strong>
            );
        }
        return part;
    });
};
const CardViewer = ({ card, flipped, setFlipped, themeMode }) => {
    if (!card) return null;

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <Box
            onClick={handleFlip}
            sx={{
                width: { xs: '90%', sm: '80%' },
                maxWidth: '100%',
                cursor: 'pointer',
                margin: '0 auto',
                position: 'relative',
                height: { xs: '450px', sm: '450px' },

                minHeight: '300px',
                overflow: 'hidden',
                borderRadius: '20px',
                boxShadow: 3,
                backgroundColor: themeMode === 'light' ? '#f5f5f5' : '#333333',
                transition: 'background-color 0.3s, color 0.3s',
            }}
        >
            {/* Передняя сторона карточки с эффектом Zoom */}
            <Zoom in={!flipped} timeout={500}>
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: flipped ? 'none' : 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: themeMode === 'light' ? '#333' : '#ffffff',
                        padding: 2,
                    }}
                >
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>


                        <Typography
                            variant="h5"
                            sx={{
                                wordWrap: 'break-word',
                                textAlign: 'center',
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                padding: '10px 0',
                                marginTop: { xs: '24px', sm: '0' },
                            }}
                        >
                            <Latex>{card.title}</Latex>
                        </Typography>
                    </Box>
                </Box>
            </Zoom>


            <Fade in={flipped} timeout={500}>
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: flipped ? 'flex' : 'none',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        color: themeMode === 'light' ? '#333' : '#ffffff',
                        padding: 2,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxHeight: 'calc(100% - 50px)',
                            overflowY: 'auto',
                            paddingTop: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{

                                mt:3,
                                whiteSpace: 'pre-wrap',
                                textAlign: 'center',
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                overflowWrap: 'break-word',
                            }}
                        >
                            <Latex>{card.content}</Latex>
                        </Typography>
                        {card.note && (
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: '10px',
                                    textAlign: 'center',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                            >
                                <strong>Примечание:</strong> {card.note}
                            </Typography>
                        )}
                        {card.example && (
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: '10px',
                                    textAlign: 'center',
                                    fontSize: {xs: '0.9rem', sm: '1rem'},
                                }}
                            >
                                <strong>{<Latex>{card.example.description}{' '}</Latex>}</strong>
                                <Latex>{card.example.value}</Latex>
                            </Typography>
                        )}
                    </Box>
                    <Button
                        component={Link}
                        to={`/card/${card.id}`}
                        variant="outlined"
                        color="primary"
                        sx={{ marginTop: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Подробнее
                    </Button>
                </Box>
            </Fade>
        </Box>
    );
};

export default React.memo(CardViewer);
