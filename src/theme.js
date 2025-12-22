import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode
                primary: {
                    main: '#2563eb',
                    light: '#60a5fa',
                    dark: '#1e40af',
                },
                secondary: {
                    main: '#7c3aed',
                    light: '#a78bfa',
                    dark: '#5b21b6',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                },
            }
            : {
                // Dark Mode
                primary: {
                    main: '#60a5fa', // Lighter blue for dark mode
                    light: '#93c5fd',
                    dark: '#2563eb',
                },
                secondary: {
                    main: '#a78bfa', // Lighter violet for dark mode
                    light: '#c4b5fd',
                    dark: '#7c3aed',
                },
                background: {
                    default: '#0f172a', // Slate 900
                    paper: '#1e293b', // Slate 800
                },
                text: {
                    primary: '#f8fafc', // Slate 50
                    secondary: '#cbd5e1', // Slate 300
                },
            }),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 600,
        },
        button: {
            fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
                contained: {
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    marginBottom: 4,
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
                    boxShadow: '4px 0 24px 0 rgba(0,0,0,0.02)',
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: mode === 'light' ? '#eff6ff' : 'rgba(37, 99, 235, 0.15)', // Light blue bg
                        color: mode === 'light' ? '#1e40af' : '#60a5fa',
                        '&:hover': {
                            backgroundColor: mode === 'light' ? '#dbeafe' : 'rgba(37, 99, 235, 0.25)',
                        },
                    },
                }
            }
        }
    },
});

export default getTheme;
