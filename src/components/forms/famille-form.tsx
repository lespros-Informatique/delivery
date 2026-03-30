import { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';

interface FamilleFormData {
  code_famille: string;
  libelle_famille: string;
  statut_famille: boolean;
}

interface FamilleFormProps {
  initialData?: Partial<FamilleFormData>;
  onSubmit: (data: FamilleFormData) => void;
}

const generateFamilleCode = (nom: string) => {
  return nom.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
};

export function FamilleForm({ 
  initialData, 
  onSubmit 
}: FamilleFormProps) {
  const [formData, setFormData] = useState<FamilleFormData>({
    code_famille: initialData?.code_famille || '',
    libelle_famille: initialData?.libelle_famille || '',
    statut_famille: initialData?.statut_famille ?? true
  });

  const handleChange = (field: keyof FamilleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-générer le code famille quand le nom change
    if (field === 'libelle_famille' && !initialData?.code_famille) {
      setFormData(prev => ({ ...prev, code_famille: generateFamilleCode(value) }));
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
            label="Code type cuisine"
            value={formData.code_famille}
            onChange={(e) => handleChange('code_famille', e.target.value.toUpperCase())}
            required
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom du type de cuisine"
            value={formData.libelle_famille}
            onChange={(e) => handleChange('libelle_famille', e.target.value)}
            required
            placeholder="ex: Cuisine Africaine, Fast Food"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_famille}
                onChange={(e) => handleChange('statut_famille', e.target.checked)}
                color="primary"
              />
            }
            label="Type de cuisine actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default FamilleForm;