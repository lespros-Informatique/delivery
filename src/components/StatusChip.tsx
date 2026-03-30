import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type StatusType =
    | 'en_attente' | 'payee' | 'en_preparation' | 'livree' | 'annulee' // Commandes
    | 'assignee' | 'en_cours' // Livraisons
    | 'valide' | 'echoue' // Paiements
    | 'actif' | 'inactif' | 'bloqué' // Entités
    | string;

interface StatusChipProps extends Omit<ChipProps, 'color'> {
    status: StatusType;
}

/**
 * StatusChip Component
 * ===========================================
 * Maps business statuses to MUI Chip colors and labels.
 */
export const StatusChip: React.FC<StatusChipProps> = ({ status, ...props }) => {
    const getStatusConfig = (status: string): { label: string; color: ChipProps['color'] } => {
        switch (status.toLowerCase()) {
            // Success / positive
            case 'livree':
            case 'payee':
            case 'valide':
            case 'actif':
                return { label: status.toUpperCase(), color: 'success' };

            // Warning / neutral
            case 'en_attente':
            case 'en_preparation':
            case 'assignee':
            case 'en_cours':
                return { label: status.replace('_', ' ').toUpperCase(), color: 'warning' };

            // Error / negative
            case 'annulee':
            case 'echoue':
            case 'inactif':
            case 'bloqué':
                return { label: status.toUpperCase(), color: 'error' };

            default:
                return { label: status.toUpperCase(), color: 'default' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            variant="outlined"
            {...props}
        />
    );
};

export default StatusChip;
