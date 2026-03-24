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
import { TypePromotion } from 'src/types';

interface PromotionFormData {
  code_promotion: string;
  restaurant_code: string;
  type_promotion: TypePromotion;
  valeur: number;
  code_reduction: string;
  date_debut: string;
  date_fin: string;
  utilisations_max: number | null;
  statut_promotion: 'active' | 'desactive' | 'expiree';
}

interface PromotionFormProps {
  initialData?: Partial<PromotionFormData>;
  onSubmit: (data: PromotionFormData) => void;
}

const generatePromotionCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `PROMO_${random.toString().padStart(4, '0')}`;
};

export const PromotionForm: React.FC<PromotionFormProps> = ({ 
  initialData, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    code_promotion: initialData?.code_promotion || generatePromotionCode(),
    restaurant_code: initialData?.restaurant_code || '',
    type_promotion: initialData?.type_promotion || 'pourcentage',
    valeur: initialData?.valeur || 0,
    code_reduction: initialData?.code_reduction || '',
    date_debut: initialData?.date_debut || new Date().toISOString().split('T')[0],
    date_fin: initialData?.date_fin || '',
    utilisations_max: initialData?.utilisations_max ?? null,
    statut_promotion: initialData?.statut_promotion || 'active'
  });

  const handleChange = (field: keyof PromotionFormData, value: any) => {
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
            label="Code promotion"
            value={formData.code_promotion}
            onChange={(e) => handleChange('code_promotion', e.target.value)}
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
            select
            label="Restaurant (laisser vide pour tous)"
            value={formData.restaurant_code}
            onChange={(e) => handleChange('restaurant_code', e.target.value)}
          >
            <MenuItem value="">Tous les restaurants</MenuItem>
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
            label="Type de promotion"
            value={formData.type_promotion}
            onChange={(e) => handleChange('type_promotion', e.target.value)}
            required
          >
            <MenuItem value="pourcentage">Pourcentage (%)</MenuItem>
            <MenuItem value="montant_fixe">Montant fixe (XOF)</MenuItem>
            <MenuItem value="Livraison_gratuite">Livraison gratuite</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label={formData.type_promotion === 'pourcentage' ? 'Pourcentage' : 'Montant'}
            type="number"
            value={formData.valeur}
            onChange={(e) => handleChange('valeur', Number(e.target.value))}
            required={formData.type_promotion !== 'Livraison_gratuite'}
            disabled={formData.type_promotion === 'Livraison_gratuite'}
            InputProps={{
              endAdornment: formData.type_promotion === 'pourcentage' 
                ? <InputAdornment position="end">%</InputAdornment>
                : <InputAdornment position="end">XOF</InputAdornment>
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Code réduction"
            value={formData.code_reduction}
            onChange={(e) => handleChange('code_reduction', e.target.value.toUpperCase())}
            required
            placeholder="ex: PROMOTE20"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Utilisations maximales"
            type="number"
            value={formData.utilisations_max || ''}
            onChange={(e) => handleChange('utilisations_max', e.target.value ? Number(e.target.value) : null)}
            placeholder="Laisser vide pour illimité"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Date de début"
            type="date"
            value={formData.date_debut}
            onChange={(e) => handleChange('date_debut', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Date de fin"
            type="date"
            value={formData.date_fin}
            onChange={(e) => handleChange('date_fin', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_promotion === 'active'}
                onChange={(e) => handleChange('statut_promotion', e.target.checked ? 'active' : 'desactive')}
                color="primary"
              />
            }
            label="Promotion active"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromotionForm;