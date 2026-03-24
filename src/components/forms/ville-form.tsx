import { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';

interface VilleFormData {
  code_ville: string;
  nom_ville: string;
  pays: string;
  latitude: number | null;
  longitude: number | null;
  frais_livraison_defaut: number;
  statut_ville: boolean;
}

interface VilleFormProps {
  initialData?: Partial<VilleFormData>;
  onSubmit: (data: VilleFormData) => void;
}

const generateVilleCode = (nom: string) => {
  return nom.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
};

export const VilleForm: React.FC<VilleFormProps> = ({ 
  initialData, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<VilleFormData>({
    code_ville: initialData?.code_ville || '',
    nom_ville: initialData?.nom_ville || '',
    pays: initialData?.pays || "Côte d'Ivoire",
    latitude: initialData?.latitude ?? null,
    longitude: initialData?.longitude ?? null,
    frais_livraison_defaut: initialData?.frais_livraison_defaut || 500,
    statut_ville: initialData?.statut_ville ?? true
  });

  const handleChange = (field: keyof VilleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-générer le code ville quand le nom change
    if (field === 'nom_ville' && !initialData?.code_ville) {
      setFormData(prev => ({ ...prev, code_ville: generateVilleCode(value) }));
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
            label="Code ville"
            value={formData.code_ville}
            onChange={(e) => handleChange('code_ville', e.target.value.toUpperCase())}
            required
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom de la ville"
            value={formData.nom_ville}
            onChange={(e) => handleChange('nom_ville', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Pays"
            value={formData.pays}
            onChange={(e) => handleChange('pays', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Frais de livraison par défaut"
            type="number"
            value={formData.frais_livraison_defaut}
            onChange={(e) => handleChange('frais_livraison_defaut', Number(e.target.value))}
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">XOF</InputAdornment>
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Latitude"
            type="number"
            slotProps={{ htmlInput: { step: '0.0000001' } }}
            value={formData.latitude || ''}
            onChange={(e) => handleChange('latitude', e.target.value ? Number(e.target.value) : null)}
            placeholder="ex: 5.3600000"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Longitude"
            type="number"
            slotProps={{ htmlInput: { step: '0.0000001' } }}
            value={formData.longitude || ''}
            onChange={(e) => handleChange('longitude', e.target.value ? Number(e.target.value) : null)}
            placeholder="ex: -4.0000000"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_ville}
                onChange={(e) => handleChange('statut_ville', e.target.checked)}
                color="primary"
              />
            }
            label="Ville active"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VilleForm;