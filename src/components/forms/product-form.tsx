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
import { mockCategories, mockRestaurants } from 'src/data/mock';

interface ProductFormData {
  code_produit: string;
  restaurant_code: string;
  categorie_code: string;
  libelle_produit: string;
  description_produit: string;
  prix_produit: number;
  image_produit: string;
  disponible_produit: boolean;
  etat_produit: boolean;
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
  const [formData, setFormData] = useState<ProductFormData>({
    code_produit: initialData?.code_produit || generateProductCode(),
    restaurant_code: initialData?.restaurant_code || '',
    categorie_code: initialData?.categorie_code || '',
    libelle_produit: initialData?.libelle_produit || '',
    description_produit: initialData?.description_produit || '',
    prix_produit: initialData?.prix_produit || 0,
    image_produit: initialData?.image_produit || '',
    disponible_produit: initialData?.disponible_produit ?? true,
    etat_produit: initialData?.etat_produit ?? true
  });

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
            value={formData.code_produit}
            onChange={(e) => handleChange('code_produit', e.target.value)}
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
            value={formData.restaurant_code}
            onChange={(e) => handleChange('restaurant_code', e.target.value)}
            required
            size="medium"
          >
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
            select
            label="Catégorie"
            value={formData.categorie_code}
            onChange={(e) => handleChange('categorie_code', e.target.value)}
            required
            size="medium"
          >
            {mockCategories.map((categorie) => (
              <MenuItem key={categorie.id_categorie} value={categorie.code_categorie}>
                {categorie.libelle_categorie}
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
            value={formData.prix_produit}
            onChange={(e) => handleChange('prix_produit', Number(e.target.value))}
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
            value={formData.libelle_produit}
            onChange={(e) => handleChange('libelle_produit', e.target.value)}
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
            value={formData.description_produit}
            onChange={(e) => handleChange('description_produit', e.target.value)}
            size="medium"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="URL de l'image"
            value={formData.image_produit}
            onChange={(e) => handleChange('image_produit', e.target.value)}
            placeholder="/assets/products/product-1.png"
            size="medium"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.disponible_produit}
                onChange={(e) => handleChange('disponible_produit', e.target.checked)}
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
                checked={formData.etat_produit}
                onChange={(e) => handleChange('etat_produit', e.target.checked)}
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