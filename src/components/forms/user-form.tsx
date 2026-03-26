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
import LockIcon from '@mui/icons-material/Lock';

/**
 * Interface pour les données du formulaire utilisateur
 * Le code est généré par le backend, pas besoin de le saisir
 */
interface UserFormData {
  nomUser: string;
  emailUser: string;
  telephoneUser?: string;
  motDePasse?: string;
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
    motDePasse: '',
    etatUsers: initialData?.etatUsers ?? true
  });

  const handleChange = (field: keyof UserFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before submit:', formData);
    
    // Validation du mot de passe pour la création
    if (!isEdit && (!formData.motDePasse || formData.motDePasse.length < 6)) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Préparer les données à envoyer
    const submitData: Record<string, unknown> = {
      nomUser: formData.nomUser,
      emailUser: formData.emailUser,
      telephoneUser: formData.telephoneUser || undefined,
      etatUsers: formData.etatUsers,
    };
    
    // Ajouter le mot de passe seulement si présent et非edit
    if (!isEdit && formData.motDePasse) {
      submitData.motDePasse = formData.motDePasse;
    }
    
    console.log('Submit data:', submitData);
    onSubmit(submitData as unknown as UserFormData);
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

        {/* Mot de passe: seulement pour la création */}
        {!isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Mot de passe"
              type="password"
              value={formData.motDePasse || ''}
              onChange={(e) => handleChange('motDePasse', e.target.value)}
              required={!isEdit}
              placeholder="Minimum 6 caractères"
              helperText="Obligatoire pour la création"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        {isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Nouveau mot de passe"
              type="password"
              value={formData.motDePasse || ''}
              onChange={(e) => handleChange('motDePasse', e.target.value)}
              placeholder="Laisser vide pour garder l'actuel"
              helperText="Optionnel: laissez vide pour conserver le mot de passe actuel"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etatUsers}
                onChange={(e) => handleChange('etatUsers', e.target.checked)}
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