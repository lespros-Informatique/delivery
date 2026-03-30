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
import { useApiList } from 'src/hooks/useApiList';
import { restaurantsService } from 'src/lib/api/restaurants';

interface LivreurFormData {
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

export function LivreurForm({ 
  initialData,
  onSubmit 
}: LivreurFormProps) {
  // Récupérer les vrais restaurants depuis l'API pour éviter les contraintes de clés erronées liées aux mocks
  const { data: response } = useApiList<any>(
    'restaurants_options',
    () => restaurantsService.getAll({ limit: 200 }) as any
  );
  
  // Sécurisation de l'extraction de l'Array (gère les structures nichées ou invalides)
  const rawData: any = response?.data;
  const restaurants = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);

  const [formData, setFormData] = useState<LivreurFormData>({
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
            {restaurants.map((restaurant: any) => (
              <MenuItem 
                key={restaurant.id_restaurant || restaurant.id || restaurant.code_restaurant || restaurant.codeRestaurant} 
                value={restaurant.code_restaurant || restaurant.codeRestaurant}
              >
                {restaurant.libelle_restaurant || restaurant.nom_restaurant || restaurant.nomRestaurant}
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