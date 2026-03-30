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

// Types de cuisine (familles)
const famillesData = [
  { code_famille: 'AFRICAIN', libelle_famille: 'Cuisine Africaine' },
  { code_famille: 'EUROPEEN', libelle_famille: 'Cuisine Européenne' },
  { code_famille: 'ASIE', libelle_famille: 'Cuisine Asiatique' },
  { code_famille: 'INDIEN', libelle_famille: 'Cuisine Indienne' },
  { code_famille: 'FASTFOOD', libelle_famille: 'Fast Food' },
  { code_famille: 'PIZZA', libelle_famille: 'Pizzeria' },
];

interface RestaurantFormData {
  code_restaurant: string;
  libelle_restaurant: string;
  adresse_restaurant: string;
  ville_code: string;
  famille_code: string;
  telephone_restaurant: string;
  email_restaurant: string;
  logo_restaurant: string;
  etat_restaurant: boolean;
}

interface RestaurantFormProps {
  initialData?: Partial<RestaurantFormData>;
  onSubmit: (data: RestaurantFormData) => void;
}

const generateRestaurantCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `RESTO_${random.toString().padStart(4, '0')}`;
};

export function RestaurantForm({ 
  initialData, 
  onSubmit 
}: RestaurantFormProps) {
  const [formData, setFormData] = useState<RestaurantFormData>({
    code_restaurant: initialData?.code_restaurant || generateRestaurantCode(),
    libelle_restaurant: initialData?.libelle_restaurant || '',
    adresse_restaurant: initialData?.adresse_restaurant || '',
    ville_code: initialData?.ville_code || '',
    famille_code: initialData?.famille_code || '',
    telephone_restaurant: initialData?.telephone_restaurant || '',
    email_restaurant: initialData?.email_restaurant || '',
    logo_restaurant: initialData?.logo_restaurant || '',
    etat_restaurant: initialData?.etat_restaurant ?? true
  });

  const handleChange = (field: keyof RestaurantFormData, value: any) => {
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
            label="Code restaurant"
            value={formData.code_restaurant}
            onChange={(e) => handleChange('code_restaurant', e.target.value)}
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
            label="Nom du restaurant"
            value={formData.libelle_restaurant}
            onChange={(e) => handleChange('libelle_restaurant', e.target.value)}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            select
            label="Type de cuisine"
            value={formData.famille_code}
            onChange={(e) => handleChange('famille_code', e.target.value)}
            required
          >
            {famillesData.map((famille) => (
              <MenuItem key={famille.code_famille} value={famille.code_famille}>
                {famille.libelle_famille}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Adresse"
            value={formData.adresse_restaurant}
            onChange={(e) => handleChange('adresse_restaurant', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Téléphone"
            value={formData.telephone_restaurant}
            onChange={(e) => handleChange('telephone_restaurant', e.target.value)}
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
            value={formData.email_restaurant}
            onChange={(e) => handleChange('email_restaurant', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="URL du logo"
            value={formData.logo_restaurant}
            onChange={(e) => handleChange('logo_restaurant', e.target.value)}
            placeholder="/assets/restaurant-logo.png"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etat_restaurant}
                onChange={(e) => handleChange('etat_restaurant', e.target.checked)}
                color="primary"
              />
            }
            label="Restaurant actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantForm;