import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import { mockRestaurants } from 'src/data/mock';

interface CategoryFormData {
  code_categorie: string;
  restaurant_code: string;
  libelle_categorie: string;
  statut_categorie: boolean;
}

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
}

const generateCategoryCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `CAT_${random.toString().padStart(4, '0')}`;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  initialData, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    code_categorie: initialData?.code_categorie || generateCategoryCode(),
    restaurant_code: initialData?.restaurant_code || '',
    libelle_categorie: initialData?.libelle_categorie || '',
    statut_categorie: initialData?.statut_categorie ?? true
  });

  const handleChange = (field: keyof CategoryFormData, value: any) => {
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
            label="Code catégorie"
            value={formData.code_categorie}
            onChange={(e) => handleChange('code_categorie', e.target.value)}
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
            label="Restaurant"
            value={formData.restaurant_code}
            onChange={(e) => handleChange('restaurant_code', e.target.value)}
            required
          >
            {mockRestaurants.map((restaurant) => (
              <MenuItem key={restaurant.id_restaurant} value={restaurant.code_restaurant}>
                {restaurant.libelle_restaurant}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Nom de la catégorie"
            value={formData.libelle_categorie}
            onChange={(e) => handleChange('libelle_categorie', e.target.value)}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.statut_categorie}
                onChange={(e) => handleChange('statut_categorie', e.target.checked)}
                color="primary"
              />
            }
            label="Catégorie active"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryForm;