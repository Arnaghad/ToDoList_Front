import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
    ListItemText, IconButton, Button, ListItemButton, Divider,
    CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../App';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/categoriesSlice';
import CategoryDialog from './CategoryDialog';

const drawerWidth = 280;

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setCategoryDialogOpen(true);
    };

    const handleEditCategory = (category, e) => {
        e.stopPropagation();
        setEditingCategory(category);
        setCategoryDialogOpen(true);
    };

    const handleDeleteCategory = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
            dispatch(deleteCategory(id));
        }
    };

    const handleSaveCategory = (data) => {
        if (editingCategory) {
            dispatch(updateCategory({ id: editingCategory.id, data }));
        } else {
            dispatch(createCategory(data));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const drawer = (
        <div>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" noWrap component="div">
                    ToDo List
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleCreateCategory}
                >
                    Нова категорія
                </Button>
            </Box>
            <List sx={{ px: 2 }}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: 2,
                            '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                        }}
                    >
                        <ListItemText primary="Всі завдання" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
                <Typography variant="overline" sx={{ px: 2, mt: 2, mb: 1, display: 'block', color: 'text.secondary' }}>
                    Категорії
                </Typography>
                {categories.map((category) => (
                    <ListItem
                        key={category.id}
                        disablePadding
                        sx={{ mb: 0.5 }}
                        secondaryAction={
                            <Box sx={{ opacity: 0, transition: '0.2s', '.MuiListItem-root:hover &': { opacity: 1 } }}>
                                <IconButton size="small" onClick={(e) => handleEditCategory(category, e)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={(e) => handleDeleteCategory(category.id, e)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                    >
                        <ListItemButton
                            onClick={() => navigate(`/?categoryId=${category.id}`)}
                            sx={{ borderRadius: 2 }}
                        >
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: category.color || 'primary.main',
                                    mr: 2,
                                }}
                            />
                            <ListItemText primary={category.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Divider sx={{ mx: 2, my: 1 }} />
            <List sx={{ px: 2, pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={colorMode.toggleColorMode}>
                        <IconButton>
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <ListItemText primary={theme.palette.mode === 'dark' ? 'Світла тема' : 'Темна тема'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <IconButton>
                            <LogoutIcon />
                        </IconButton>
                        <ListItemText primary="Вихід" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    display: { sm: 'none' }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        ToDo List
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 8, sm: 0 } }}
            >
                <Outlet />
            </Box>

            <CategoryDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                onSave={handleSaveCategory}
                category={editingCategory}
            />
        </Box>
    );
};

export default Layout;