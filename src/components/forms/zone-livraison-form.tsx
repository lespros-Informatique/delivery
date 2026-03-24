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
import { mockVilles } from 'src/data/mock';

interface ZoneLivraisonFormData {
  code_zone: string;
  ville_code: string;
  nom_zone: string;
  frais_livraison: number;
  delai_minutes: number;
  statut_zone: boolean;
}

interface ZoneLivraisonFormProps {
  initialData?: Partial<ZoneLivraisonFormData>;
  onSubmit: (data: ZoneLivraisonFormData) => void;
}

const generateZoneCode = (nom: string, ville: string) => {
  const prefix = ville ? ville.slice(0, 3).toUpperCase() : 'ZONE';
  const suffix = nom.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  return `${prefix}_${suffix}`;
};

export function ZoneLivraisonForm({ 
  initialData, 
  onSubmit 
}: ZoneLivraisonFormProps) {
  const [formData, setFormData] = useState<ZoneLivraisonFormData>({
    code_zone: initialData?.code_zone || '',
    ville_code: initialData?.ville_code || '',
    nom_zone: initialData?.nom_zone || '',
    frais_livraison: initialData?.frais_livraison || 300,
    delai_minutes: initialData?.delai_minutes || 30,
    statut_zone: initialData?.statut_zone ?? true
  });

  const handleChange = (field: keyof ZoneLivraisonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-générer le code zone
    if (field === 'nom_zone' || field === 'ville_code') {
      const newNom = field === 'nom_zone' ? value : formData.nom_zone;
      const newVille = field === 'ville_code' ? value : formData.ville_code;
      if (newNom && newVille) {
        setFormData(prev => ({ ...prev, code_zone: generateZoneCode(newNom, newVille) }));
      }
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
            label="Code zone"
            value={formData.code_zone}
            onChange={(e) => handleChange('code_zone', e.target.value.toUpperCase())}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            select
            label="Ville"
            value={formData.ville_code}
            onChange={(e) => handleChange('ville_code', e.target.value)}
            required
          >
            {mockVilles.map((ville) => (
              <MenuItem key={ville.id_ville} value={ville.code_ville}>
                {ville.nom_ville}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom de la zone"
            value={formData.nom_zone}
            onChange={(e) => handleChange('nom_zone', e.target.value)}
            required
            placeholder="ex: Cocody, Marcory, Yopougon"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Frais de livraison"
            type="number"
            value={formData.frais_livraison}
            onChange={(e) => handleChange('frais_livraison', Number(e.target.value))}
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
            label="Délai de livraison"
            type="number"
            value={formData.delai_minutes}
            onChange={(e) => handleChange('delai_minutes', Number(e.target.value))}
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">minutes</InputAdornment>
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_zone}
                onChange={(e) => handleChange('statut_zone', e.target.checked)}
                color="primary"
              />
            }
            label="Zone active"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ZoneLivraisonForm;