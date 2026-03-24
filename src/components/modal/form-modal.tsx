import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Divider,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  actions?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<any>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const FormModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  actions,
  size = 'medium'
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Taille basée sur le prop size
  const getDialogWidth = () => {
    switch (size) {
      case 'small': return '400px';
      case 'medium': return '560px';
      case 'large': return '800px';
      default: return maxWidth;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: fullScreen ? '100%' : '90vh',
          width: fullScreen ? '100%' : getDialogWidth()
        }
      }}
    >
      {/* En-tête du modal */}
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenu du modal */}
      <DialogContent sx={{ pt: 3, overflow: 'visible' }}>
        <Box sx={{ pb: 2 }}>
          {children}
        </Box>
      </DialogContent>

      {/* Actions (boutons) */}
      {actions && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2 }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

// Version simple sans actions définies
export const SimpleModal: React.FC<Omit<FormModalProps, 'actions'>> = (props) => {
  return (
    <FormModal
      {...props}
      actions={
        <>
          <Button onClick={props.onClose} color="inherit">
            Annuler
          </Button>
          <Button variant="contained" type="submit" form="modal-form">
            Enregistrer
          </Button>
        </>
      }
    />
  );
};

export default FormModal;