import { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';

interface RoleFormData {
  code_role: string;
  libelle_role: string;
  description_role: string;
  etat_role: boolean;
}

interface RoleFormProps {
  initialData?: Partial<RoleFormData>;
  onSubmit: (data: RoleFormData) => void;
}

const generateRoleCode = (nom: string) => {
  return nom.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
};

export function RoleForm({ 
  initialData, 
  onSubmit 
}: RoleFormProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    code_role: initialData?.code_role || '',
    libelle_role: initialData?.libelle_role || '',
    description_role: initialData?.description_role || '',
    etat_role: initialData?.etat_role ?? true
  });

  const handleChange = (field: keyof RoleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-générer le code rôle quand le nom change
    if (field === 'libelle_role' && !initialData?.code_role) {
      setFormData(prev => ({ ...prev, code_role: generateRoleCode(value) }));
    }
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
            label="Code rôle"
            value={formData.code_role}
            onChange={(e) => handleChange('code_role', e.target.value)}
            required
            inputProps={{ maxLength: 20 }}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom du rôle"
            value={formData.libelle_role}
            onChange={(e) => handleChange('libelle_role', e.target.value)}
            required
            placeholder="ex: Administrateur, Gestionnaire"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            multiline
            rows={3}
            label="Description"
            value={formData.description_role}
            onChange={(e) => handleChange('description_role', e.target.value)}
            placeholder="Décrivez les permissions de ce rôle"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etat_role}
                onChange={(e) => handleChange('etat_role', e.target.checked)}
                color="primary"
              />
            }
            label="Rôle actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RoleForm;