import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  color?: 'primary' | 'error' | 'warning' | 'info' | 'success';
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isLoading = false,
  color = 'error'
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {color === 'error' && <WarningAmberIcon color="error" />}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <LoadingButton 
          onClick={onConfirm} 
          color={color} 
          variant="contained"
          loading={isLoading}
          disableElevation
        >
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
