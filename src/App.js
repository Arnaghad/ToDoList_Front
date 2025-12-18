import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ItemsPage from './pages/ItemsPage';
import PrivateRoute from './components/PrivateRoute';

import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import getTheme from './theme';

import { useDispatch, useSelector } from 'react-redux';
import signalRService from './services/signalrService';
import {
    itemAdded,
    itemUpdated,
    itemDeleted,
    itemCompleted,
    itemLoopToggled,
    itemPriorityUpdated
} from './store/itemsSlice';
import {
    categoryAdded,
    categoryUpdated,
    categoryDeleted
} from './store/categoriesSlice';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = React.useState('system');

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    React.useEffect(() => {
        if (token) {
            signalRService.startConnection(token);

            signalRService.on('itemCreated', (item) => {
                dispatch(itemAdded(item));
            });
            signalRService.on('itemUpdated', (item) => {
                dispatch(itemUpdated(item));
            });
            signalRService.on('itemDeleted', (id) => {
                dispatch(itemDeleted(id));
            });
            signalRService.on('itemCompleted', (id) => {
                dispatch(itemCompleted(id));
            });
            signalRService.on('itemLoopToggled', (id) => {
                dispatch(itemLoopToggled(id));
            });
            signalRService.on('itemPriorityUpdated', (data) => {
                dispatch(itemPriorityUpdated(data));
            });

            // --- Categories Handlers ---
            // Listening for both lowercase and PascalCase to be safe
            const onCategoryCreated = (category) => {
                console.log('SignalR: Category Created', category);
                dispatch(categoryAdded(category));
            };
            const onCategoryUpdated = (category) => {
                console.log('SignalR: Category Updated', category);
                dispatch(categoryUpdated(category));
            };
            const onCategoryDeleted = (id) => {
                console.log('SignalR: Category Deleted', id);
                dispatch(categoryDeleted(id));
            };

            signalRService.on('categoryCreated', onCategoryCreated);
            signalRService.on('CategoryCreated', onCategoryCreated);

            signalRService.on('categoryUpdated', onCategoryUpdated);
            signalRService.on('CategoryUpdated', onCategoryUpdated);

            signalRService.on('categoryDeleted', onCategoryDeleted);
            signalRService.on('CategoryDeleted', onCategoryDeleted);
        }

        return () => {
            signalRService.off('itemCreated');
            signalRService.off('itemUpdated');
            signalRService.off('itemDeleted');
            signalRService.off('itemCompleted');
            signalRService.off('itemLoopToggled');
            signalRService.off('itemPriorityUpdated');
            signalRService.off('categoryCreated');
            signalRService.off('CategoryCreated');
            signalRService.off('categoryUpdated');
            signalRService.off('CategoryUpdated');
            signalRService.off('categoryDeleted');
            signalRService.off('CategoryDeleted');
            // connection stop is optional, maybe we want to keep it? 
            // Usually valid to stop if token is gone (logout)
            if (!token) {
                signalRService.stopConnection();
            }
        };
    }, [token, dispatch]);

    const theme = React.useMemo(() => {
        const activeMode = mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode;
        return getTheme(activeMode);
    }, [mode, prefersDarkMode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route index element={<ItemsPage />} />
                        {/* Тут можна додати інші сторінки, наприклад редагування */}
                    </Route>
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;