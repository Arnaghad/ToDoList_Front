import React from 'react';
import { Paper, Button, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const BulkActionsBar = ({ selectedCount, onDelete, onComplete, onClearSelection }) => {
    if (selectedCount === 0) return null;

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                zIndex: 1000,
                backgroundColor: 'secondary.main', // or primary.dark
                color: 'white',
            }}
        >
            <Typography variant="subtitle1">
                Обрано: {selectedCount}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<DoneAllIcon />}
                    onClick={onComplete}
                    size="small"
                >
                    Завершити
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    size="small"
                >
                    Видалити
                </Button>
                <Button
                    color="inherit"
                    onClick={onClearSelection}
                    size="small"
                >
                    Скасувати
                </Button>
            </Box>
        </Paper>
    );
};

export default BulkActionsBar;
