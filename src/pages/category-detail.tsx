import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Avatar, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import { mockCategories, mockRestaurants, mockProduits } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const categorie = mockCategories.find(c => c.code_categorie === code);
  
  if (!categorie) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Catégorie non trouvée</Typography>
          <Button onClick={() => navigate('/categories')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  const restaurant = mockRestaurants.find(r => r.code_restaurant === categorie.restaurant_code);
  const produits = mockProduits.filter(p => p.categorie_code === categorie.code_categorie);
  
  const statut = categorie.statut_categorie === 1 ? 'Active' : 'Inactive';

  return (
    <>
      <Helmet>
        <title>{categorie.libelle_categorie} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Accueil
                </Link>
                <Link component="button" variant="body2" onClick={() => navigate('/categories')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Catégories
                </Link>
                <Typography variant="body2" color="text.primary">{categorie.code_categorie}</Typography>
              </Breadcrumbs>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={() => navigate('/categories')}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    {categorie.libelle_categorie}
                  </Typography>
                  <Chip label={statut} color={categorie.statut_categorie === 1 ? 'success' : 'error'} size="small" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />}>
                    Modifier
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                    Supprimer
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom>Informations de la catégorie</Typography>
                        <Divider />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">CODE CATÉGORIE</Typography>
                            <Typography variant="body1" fontWeight={600}>{categorie.code_categorie}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">STATUT</Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {categorie.statut_categorie === 1 ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<RestaurantIcon />} 
                          label={restaurant?.libelle_restaurant || 'Restaurant non trouvé'}
                          variant="outlined"
                          onClick={() => navigate(`/restaurants/${categorie.restaurant_code}`)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Chip label={statut} color={categorie.statut_categorie === 1 ? 'success' : 'error'} />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Dernière mise à jour</Typography>
                        <Typography variant="body2">
                          {new Date(categorie.updated_at_categorie).toLocaleString('fr-FR')}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <InventoryIcon /> Produits ({produits.length})
                      </Stack>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1}>
                      {produits.slice(0, 5).map((produit) => (
                        <Box 
                          key={produit.id_produit}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'grey.100' }
                          }}
                          onClick={() => navigate(`/products/${produit.code_produit}`)}
                        >
                          <Typography variant="body2">{produit.libelle_produit}</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {produit.prix_produit.toLocaleString()} XOF
                          </Typography>
                        </Box>
                      ))}
                      {produits.length > 5 && (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          + {produits.length - 5} autres produits
                        </Typography>
                      )}
                      {produits.length === 0 && (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Aucun produit dans cette catégorie
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;