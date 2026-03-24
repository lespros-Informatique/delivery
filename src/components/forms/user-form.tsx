import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';

interface UserFormData {
  code_user: string;
  nom_user: string;
  prenom_user: string;
  email_user: string;
  telephone_user: string;
  etat_users: boolean;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
}

const generateUserCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `USER_${random.toString().padStart(4, '0')}`;
};

export function UserForm({ 
  initialData, 
  onSubmit 
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    code_user: initialData?.code_user || generateUserCode(),
    nom_user: initialData?.nom_user || '',
    prenom_user: initialData?.prenom_user || '',
    email_user: initialData?.email_user || '',
    telephone_user: initialData?.telephone_user || '',
    etat_users: initialData?.etat_users ?? true
  });

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" id="modal-form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Code utilisateur"
            value={formData.code_user}
            onChange={(e) => handleChange('code_user', e.target.value)}
            required
            disabled
            helperText="Code généré automatiquement"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom"
            value={formData.nom_user}
            onChange={(e) => handleChange('nom_user', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Prénom"
            value={formData.prenom_user}
            onChange={(e) => handleChange('prenom_user', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Téléphone"
            value={formData.telephone_user}
            onChange={(e) => handleChange('telephone_user', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Email"
            type="email"
            value={formData.email_user}
            onChange={(e) => handleChange('email_user', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etat_users}
                onChange={(e) => handleChange('etat_users', e.target.checked)}
                color="primary"
              />
            }
            label="Utilisateur actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserForm;