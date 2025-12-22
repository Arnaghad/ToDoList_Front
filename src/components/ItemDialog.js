import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox,
    Box, Stack
} from '@mui/material';
import { useSelector } from 'react-redux';

const ItemDialog = ({ open, onClose, onSave, item }) => {
    const { categories } = useSelector((state) => state.categories);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        priority: 1,
        categoryId: '',
        endedAt: '',
        isLooped: false,
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                priority: item.priority || 1,
                categoryId: item.categoryId || '',
                endedAt: item.endedAt ? item.endedAt.slice(0, 16) : '', // Format for datetime-local
                isLooped: item.isLooped || false,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                priority: 1,
                categoryId: '',
                endedAt: '',
                isLooped: false,
            });
        }
    }, [item, open]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            // Convert empty string back to null if needed, or handle in backend.
            categoryId: formData.categoryId === '' ? null : formData.categoryId,
            endedAt: formData.endedAt === '' ? null : formData.endedAt
        };
        onSave(submissionData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{item ? 'Редагувати завдання' : 'Нове завдання'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Назва"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Опис"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Пріоритет</InputLabel>
                                    <Select
                                        name="priority"
                                        label="Пріоритет"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>Низький</MenuItem>
                                        <MenuItem value={2}>Середній</MenuItem>
                                        <MenuItem value={3}>Високий</MenuItem>
                                        <MenuItem value={4}>Критичний</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Категорія</InputLabel>
                                    <Select
                                        name="categoryId"
                                        label="Категорія"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value=""><em>Без категорії</em></MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label="Термін виконання"
                                    type="datetime-local"
                                    name="endedAt"
                                    value={formData.endedAt}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isLooped"
                                            checked={formData.isLooped}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="Зациклити (повторювати)"
                                />
                            </Box>
                        </Stack>
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

export default ItemDialog;
