import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    fetchItems, createItem, updateItem, deleteItem, completeItem,
    toggleLoop, updatePriority, bulkDeleteItems, bulkCompleteItems
} from '../store/itemsSlice';
import {
    Container, TextField, Button, Box, Typography,
    Checkbox, IconButton, Chip, FormControl, InputLabel, Select, MenuItem,
    Menu, ListItemIcon, Divider, Paper, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LoopIcon from '@mui/icons-material/Loop';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ItemDialog from '../components/ItemDialog';
import BulkActionsBar from '../components/BulkActionsBar';

const ItemsPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    const { items } = useSelector((state) => state.items);
    const { categories } = useSelector((state) => state.categories); // For displaying category names

    const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog state
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Selection state
    const [selectedIds, setSelectedIds] = useState([]);

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuItemId, setMenuItemId] = useState(null);

    useEffect(() => {
        // Fetch items whenever filters relevant to backend change (none for now, we filter locally or could pass params)
        // Ideally we pass params to fetchItems if backend supports it. The backend supports many params.
        // For simplicity let's fetch all and filter locally, OR fetch with basic params.
        // Let's fetch all for the user to keep things responsive and simple given the scale.
        dispatch(fetchItems());
    }, [dispatch]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Category Filter
            if (categoryId && item.categoryId !== parseInt(categoryId)) return false;

            // Status Filter
            // const isCompleted = !!item.endedAt && new Date(item.endedAt) <= new Date();
            // Note: Backend logic for 'completed' check might be slightly different. 
            // In ItemDto: EndedAt is just due date? No, EndedAt might be used as "finished at" or "due date". 
            // Backend: items = items.Where(i => i.EndedAt.HasValue && i.EndedAt.Value <= now) if IsCompleted=true.
            // ItemsController: IsCompleted filter checks EndedAt <= Now. So EndedAt serves as "Due Date" effectively?
            // "completeItem" action in backend: Sets IsCompleted = true? actually it checks Logic. 
            // Wait, Item entity has IsCompleted? Or just EndedAt?
            // Let's look at controller: "Complete" action calls _itemService.CompleteItemAsync.
            // Usually completed items have a flag or a date. 
            // Front side check: if item.isCompleted (from DTO) is true.
            // The DTO likely has IsCompleted or similar. 
            // Let's assume DTO has IsCompleted or we rely on the specific field.
            // ItemDto usually maps Entity props.
            // Let's check ItemDto content? No, I didn't see DTO. 
            // But Controller 'GetById' returns ItemDto. 
            // Let's assume 'isCompleted' property exists on the item object from Redux (mapped from API response).
            // Actually, looking at `itemsSlice`, `completeItem` sets `item.isCompleted = true`. So it must exist.

            if (filterStatus === 'active' && item.isCompleted) return false;
            if (filterStatus === 'completed' && !item.isCompleted) return false;

            // Search Filter
            if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true;
        });
    }, [items, categoryId, filterStatus, searchTerm]);

    const handleCreateItem = () => {
        setEditingItem(categoryId ? { categoryId: parseInt(categoryId) } : null);
        setItemDialogOpen(true);
    };

    const handleSaveItem = (data) => {
        if (editingItem && editingItem.id) {
            dispatch(updateItem({ id: editingItem.id, data }));
        } else {
            dispatch(createItem(data));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Видалити обрані завдання (${selectedIds.length})?`)) {
            await dispatch(bulkDeleteItems(selectedIds));
            setSelectedIds([]);
        }
    };

    const handleBulkComplete = async () => {
        await dispatch(bulkCompleteItems(selectedIds));
        setSelectedIds([]);
    };

    // Item Actions
    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuItemId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuItemId(null);
    };

    const handleEditFromMenu = () => {
        const item = items.find(i => i.id === menuItemId);
        if (item) {
            setEditingItem(item);
            setItemDialogOpen(true);
        }
        handleMenuClose();
    };

    const handleDeleteFromMenu = () => {
        if (window.confirm('Видалити завдання?')) {
            dispatch(deleteItem(menuItemId));
        }
        handleMenuClose();
    };

    const handleToggleLoopFromMenu = () => {
        dispatch(toggleLoop(menuItemId));
        handleMenuClose();
    };

    const handlePriorityChange = (priority) => {
        dispatch(updatePriority({ id: menuItemId, priority }));
        handleMenuClose();
    };

    const handleComplete = (item) => {
        if (!item.isCompleted) {
            dispatch(completeItem(item.id));
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 4: return 'error'; // Critical
            case 3: return 'warning'; // High
            case 2: return 'info'; // Medium
            default: return 'default'; // Low
        }
    };

    const getPriorityLabel = (p) => {
        switch (p) {
            case 4: return 'Критичний';
            case 3: return 'Високий';
            case 2: return 'Середній';
            default: return 'Низький';
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {categoryId
                        ? categories.find(c => c.id === parseInt(categoryId))?.name || 'Категорія'
                        : 'Всі завдання'}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateItem}>
                    Додати завдання
                </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label="Пошук"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={filterStatus}
                        label="Статус"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="active">Активні</MenuItem>
                        <MenuItem value="completed">Виконані</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredItems.map((item) => (
                    <Paper
                        key={item.id}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            transition: 'all 0.2s',
                            opacity: item.isCompleted ? 0.7 : 1,
                            bgcolor: item.isCompleted ? 'background.default' : 'background.paper',
                            borderLeft: `6px solid ${item.categoryColor || 'transparent'}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3,
                            },
                            position: 'relative',
                        }}
                    >
                        <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleToggleSelect(item.id)}
                            sx={{ mt: 0.5 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textDecoration: item.isCompleted ? 'line-through' : 'none',
                                        color: item.isCompleted ? 'text.secondary' : 'text.primary',
                                        fontWeight: 600,
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                {item.isLooped && (
                                    <Tooltip title="Повторюване">
                                        <LoopIcon fontSize="small" color="action" />
                                    </Tooltip>
                                )}
                            </Box>

                            {item.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: '90%' }}>
                                    {item.description}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip
                                    label={getPriorityLabel(item.priority)}
                                    size="small"
                                    color={getPriorityColor(item.priority)}
                                    sx={{ fontWeight: 500, height: 24 }}
                                />
                                {item.endedAt && (
                                    <Chip
                                        label={new Date(item.endedAt).toLocaleDateString()}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 24, borderColor: 'divider' }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {!item.isCompleted && (
                                <Tooltip title="Завершити">
                                    <IconButton onClick={() => handleComplete(item)} color="success" sx={{ bgcolor: 'success.light', color: 'white', '&:hover': { bgcolor: 'success.main' }, mr: 1, width: 32, height: 32 }}>
                                        <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, item.id)}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
                {filteredItems.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            Список порожній
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Створіть нове завдання, щоб почати
                        </Typography>
                    </Box>
                )}
            </Box>

            <BulkActionsBar
                selectedCount={selectedIds.length}
                onDelete={handleBulkDelete}
                onComplete={handleBulkComplete}
                onClearSelection={() => setSelectedIds([])}
            />

            <ItemDialog
                open={itemDialogOpen}
                onClose={() => setItemDialogOpen(false)}
                onSave={handleSaveItem}
                item={editingItem}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditFromMenu}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    Редагувати
                </MenuItem>
                <MenuItem onClick={handleToggleLoopFromMenu}>
                    <ListItemIcon><LoopIcon fontSize="small" /></ListItemIcon>
                    {items.find(i => i.id === menuItemId)?.isLooped ? 'Прибрати повторення' : 'Зробити повторюваним'}
                </MenuItem>
                <MenuItem onClick={handleDeleteFromMenu}>
                    <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                    Видалити
                </MenuItem>
                <Divider />
                <MenuItem disabled>Змінити пріоритет:</MenuItem>
                <MenuItem onClick={() => handlePriorityChange(1)}>Низький</MenuItem>
                <MenuItem onClick={() => handlePriorityChange(2)}>Середній</MenuItem>
                <MenuItem onClick={() => handlePriorityChange(3)}>Високий</MenuItem>
                <MenuItem onClick={() => handlePriorityChange(4)}>Критичний</MenuItem>
            </Menu>
        </Container>
    );
};

export default ItemsPage;