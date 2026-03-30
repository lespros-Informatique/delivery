import React from 'react';
import { Box, CircularProgress, Alert, Typography, Button } from '@mui/material';

interface AsyncPageProps {
    isLoading: boolean;
    error: any;
    isEmpty?: boolean;
    emptyText?: string;
    onRetry?: () => void;
    children: React.ReactNode;
}

/**
 * AsyncPage Component
 * ===========================================
 * Centralizes loading, error, and empty states for pages.
 */
export const AsyncPage: React.FC<AsyncPageProps> = ({
    isLoading,
    error,
    isEmpty = false,
    emptyText = 'Aucune donnée trouvée',
    onRetry,
    children,
}) => {
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    action={onRetry && (
                        <Button color="inherit" size="small" onClick={onRetry}>
                            Réessayer
                        </Button>
                    )}
                >
                    {error.message || "Une erreur est survenue lors du chargement des données."}
                </Alert>
            </Box>
        );
    }

    if (isEmpty) {
        return (
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    {emptyText}
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
};

export default AsyncPage;
