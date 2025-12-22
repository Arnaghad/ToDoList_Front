import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';

const CategoryDialog = ({ open, onClose, onSave, category }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#1976d2'); // Default Blue

    const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#ed6c02', '#9c27b0', '#0288d1', '#757575'];


    useEffect(() => {
        if (category) {
            setName(category.name);
            setColor(category.color || '#1976d2');
        } else {
            setName('');
            setColor('#1976d2');
        }
    }, [category, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, color });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{category ? 'Редагувати категорію' : 'Нова категорія'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Назва категорії"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Колір</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {colors.map((c) => (
                                <Box
                                    key={c}
                                    onClick={() => setColor(c)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: c,
                                        cursor: 'pointer',
                                        border: color === c ? '2px solid black' : '1px solid #ccc',
                                        transform: color === c ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Скасувати</Button>
                    <Button type="submit" variant="contained">Зберегти</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CategoryDialog;
