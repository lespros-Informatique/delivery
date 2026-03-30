import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { useApiList } from 'src/hooks/useApiList';
import { apiClient } from 'src/lib/api/client';

interface ProductFormData {
  codeProduit: string;
  restaurantCode: string;
  categorieCode: string;
  libelleProduit: string;
  descriptionProduit: string;
  prixProduit: number;
  imageProduit: string;
  disponibleProduit: boolean;
  etatProduit: boolean;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
}

const generateProductCode = () => {
  const random = Math.floor(Math.random() * 10000);
  return `PROD_${random.toString().padStart(4, '0')}`;
};

export function ProductForm({
  initialData,
  onSubmit
}: ProductFormProps) {
  // Fetch lists for select fields
  const { data: restaurantsRes, isLoading: loadingRestos } = useApiList<any>(
    'restaurants',
    () => apiClient.get('/restaurants').then(res => res.data)
  );

  const { data: categoriesRes, isLoading: loadingCats } = useApiList<any>(
    'categories',
    () => apiClient.get('/categories').then(res => res.data)
  );

  const restaurants = restaurantsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const [formData, setFormData] = useState<ProductFormData>({
    codeProduit: initialData?.codeProduit || generateProductCode(),
    restaurantCode: initialData?.restaurantCode || '',
    categorieCode: initialData?.categorieCode || '',
    libelleProduit: initialData?.libelleProduit || '',
    descriptionProduit: initialData?.descriptionProduit || '',
    prixProduit: initialData?.prixProduit || 0,
    imageProduit: initialData?.imageProduit || '',
    disponibleProduit: initialData?.disponibleProduit ?? true,
    etatProduit: initialData?.etatProduit ?? true
  });

  // Sync with initialData if it changes (e.g. when selecting a different product to edit)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        codeProduit: initialData.codeProduit || prev.codeProduit
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingRestos || loadingCats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      id="modal-form"
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Code produit"
            value={formData.codeProduit}
            onChange={(e) => handleChange('codeProduit', e.target.value)}
            required
            disabled
            helperText="Code généré automatiquement"
            size="medium"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            select
            label="Restaurant"
            value={formData.restaurantCode}
            onChange={(e) => handleChange('restaurantCode', e.target.value)}
            required
            size="medium"
          >
            {restaurants.map((restaurant: any) => (
              <MenuItem key={restaurant.id} value={restaurant.code_restaurant || restaurant.codeRestaurant}>
                {restaurant.libelle_restaurant || restaurant.libelleRestaurant}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            select
            label="Catégorie"
            value={formData.categorieCode}
            onChange={(e) => handleChange('categorieCode', e.target.value)}
            required
            size="medium"
          >
            {categories.map((categorie: any) => (
              <MenuItem key={categorie.id} value={categorie.code_categorie || categorie.codeCategorie}>
                {categorie.libelle_categorie || categorie.libelleCategorie}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Prix"
            type="number"
            value={formData.prixProduit}
            onChange={(e) => handleChange('prixProduit', Number(e.target.value))}
            required
            size="medium"
            InputProps={{
              endAdornment: <InputAdornment position="end">XOF</InputAdornment>
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Nom du produit"
            value={formData.libelleProduit}
            onChange={(e) => handleChange('libelleProduit', e.target.value)}
            required
            size="medium"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            label="Description"
            value={formData.descriptionProduit}
            onChange={(e) => handleChange('descriptionProduit', e.target.value)}
            size="medium"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="URL de l'image"
            value={formData.imageProduit}
            onChange={(e) => handleChange('imageProduit', e.target.value)}
            placeholder="/assets/products/product-1.png"
            size="medium"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.disponibleProduit}
                onChange={(e) => handleChange('disponibleProduit', e.target.checked)}
                color="primary"
              />
            }
            label="Disponible à la vente"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.etatProduit}
                onChange={(e) => handleChange('etatProduit', e.target.checked)}
                color="primary"
              />
            }
            label="Actif"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductForm;