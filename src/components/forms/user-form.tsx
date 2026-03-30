import { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

/**
 * Interface pour les données du formulaire utilisateur
 * Le mot de passe est généré par le backend
 */
interface UserFormData {
  nomUser: string;
  emailUser: string;
  telephoneUser?: string;
  etatUsers: boolean;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isEdit?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  isEdit = false
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    nomUser: initialData?.nomUser || '',
    emailUser: initialData?.emailUser || '',
    telephoneUser: initialData?.telephoneUser || '',
    etatUsers: initialData?.etatUsers ?? true
  });

  const handleChange = (field: keyof UserFormData, value: unknown) => {
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
            label="Nom complet"
            value={formData.nomUser}
            onChange={(e) => handleChange('nomUser', e.target.value)}
            required
            placeholder="Entrez le nom complet"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Téléphone"
            value={formData.telephoneUser || ''}
            onChange={(e) => handleChange('telephoneUser', e.target.value)}
            placeholder="Ex: +2250700000000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Email"
            type="email"
            value={formData.emailUser}
            onChange={(e) => handleChange('emailUser', e.target.value)}
            required
            disabled={isEdit}
            placeholder="exemple@email.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etatUsers}
                onChange={(e) => handleChange('etatUsers', e.target.checked)}
                color="primary"
              />
            }
            label={formData.etatUsers ? "Utilisateur actif" : "Utilisateur inactif"}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserForm;