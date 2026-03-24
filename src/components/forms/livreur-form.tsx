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
import { mockRestaurants } from 'src/data/mock';

interface LivreurFormData {
  code_livreur: string;
  nom_livreur: string;
  prenom_livreur: string;
  telephone_livreur: string;
  email_livreur: string;
  restaurant_code: string;
  moyen_transport: string;
  plaque_vehicule: string;
  statut_livreurs: boolean;
}

interface LivreurFormProps {
  initialData?: Partial<LivreurFormData>;
  onSubmit: (data: LivreurFormData) => void;
}

const generateLivreurCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `LIV_${random.toString().padStart(4, '0')}`;
};

export function LivreurForm({ 
  initialData, 
  onSubmit 
}: LivreurFormProps) {
  const [formData, setFormData] = useState<LivreurFormData>({
    code_livreur: initialData?.code_livreur || generateLivreurCode(),
    nom_livreur: initialData?.nom_livreur || '',
    prenom_livreur: initialData?.prenom_livreur || '',
    telephone_livreur: initialData?.telephone_livreur || '',
    email_livreur: initialData?.email_livreur || '',
    restaurant_code: initialData?.restaurant_code || '',
    moyen_transport: initialData?.moyen_transport || 'moto',
    plaque_vehicule: initialData?.plaque_vehicule || '',
    statut_livreurs: initialData?.statut_livreurs ?? true
  });

  const handleChange = (field: keyof LivreurFormData, value: any) => {
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
            label="Code livreur"
            value={formData.code_livreur}
            onChange={(e) => handleChange('code_livreur', e.target.value)}
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
            value={formData.nom_livreur}
            onChange={(e) => handleChange('nom_livreur', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Prénom"
            value={formData.prenom_livreur}
            onChange={(e) => handleChange('prenom_livreur', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Téléphone"
            value={formData.telephone_livreur}
            onChange={(e) => handleChange('telephone_livreur', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Email"
            type="email"
            value={formData.email_livreur}
            onChange={(e) => handleChange('email_livreur', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            select
            label="Restaurant"
            value={formData.restaurant_code}
            onChange={(e) => handleChange('restaurant_code', e.target.value)}
          >
            <MenuItem value="">Aucun (indépendant)</MenuItem>
            {mockRestaurants.map((restaurant) => (
              <MenuItem key={restaurant.id_restaurant} value={restaurant.code_restaurant}>
                {restaurant.libelle_restaurant}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            select
            label="Moyen de transport"
            value={formData.moyen_transport}
            onChange={(e) => handleChange('moyen_transport', e.target.value)}
            required
          >
            <MenuItem value="moto">Moto</MenuItem>
            <MenuItem value="voiture">Voiture</MenuItem>
            <MenuItem value="velo">Vélo</MenuItem>
            <MenuItem value="pied">À pied</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Plaque d'immatriculation"
            value={formData.plaque_vehicule}
            onChange={(e) => handleChange('plaque_vehicule', e.target.value)}
            placeholder="ex: XX-XXXX-XX"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_livreurs}
                onChange={(e) => handleChange('statut_livreurs', e.target.checked)}
                color="primary"
              />
            }
            label="Livreur actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LivreurForm;