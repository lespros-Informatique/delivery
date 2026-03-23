import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Avatar, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { mockProduits, mockCategories, mockRestaurants, mockCommandes, mockLignesCommandes } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  // Trouver le produit par code
  const produit = mockProduits.find(p => p.code_produit === code);
  
  if (!produit) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Produit non trouvé</Typography>
          <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  // Trouver la catégorie
  const categorie = mockCategories.find(c => c.code_categorie === produit.categorie_code);
  
  // Trouver le restaurant
  const restaurant = mockRestaurants.find(r => r.code_restaurant === produit.restaurant_code);
  
  // Trouver les commandes contenant ce produit
  const lignesProduit = mockLignesCommandes.filter(l => l.produit_code === produit.code_produit);
  const codesCommandes = lignesProduit.map(l => l.commande_code);
  const commandes = mockCommandes.filter(c => codesCommandes.includes(c.code_commande));

  // Statut du produit
  const statut = produit.disponible_produit === 1 ? 'Disponible' : 'Indisponible';
  const etat = produit.etat_produit === 1 ? 'Actif' : 'Inactif';

  return (
    <>
      <Helmet>
        <title>{produit.libelle_produit} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec breadcrumbs et actions */}
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  Accueil
                </Link>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/products')}
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  Produits
                </Link>
                <Typography variant="body2" color="text.primary">
                  {produit.code_produit}
                </Typography>
              </Breadcrumbs>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={() => navigate('/products')}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    {produit.libelle_produit}
                  </Typography>
                  <Chip 
                    label={statut} 
                    color={produit.disponible_produit === 1 ? 'success' : 'error'} 
                    size="small" 
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/products/${code}`)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Supprimer
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              {/* Informations principales */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Informations du produit
                        </Typography>
                        <Divider />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              CODE PRODUIT
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {produit.code_produit}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              PRIX
                            </Typography>
                            <Typography variant="h5" color="primary.main" fontWeight={700}>
                              {Number(produit.prix_produit).toLocaleString()} XOF
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              DESCRIPTION
                            </Typography>
                            <Typography variant="body1">
                              {produit.description_produit || 'Aucune description'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<RestaurantIcon />} 
                          label={restaurant?.libelle_restaurant || 'Restaurant non trouvé'}
                          variant="outlined"
                          onClick={() => navigate(`/restaurants/${produit.restaurant_code}`)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Chip 
                          icon={<CategoryIcon />} 
                          label={categorie?.libelle_categorie || 'Catégorie non trouvée'}
                          variant="outlined"
                          onClick={() => navigate(`/categories/${produit.categorie_code}`)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Chip 
                          label={etat}
                          color={produit.etat_produit === 1 ? 'success' : 'error'}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Image et estadísticas */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Image du produit
                      </Typography>
                      <Avatar
                        variant="rounded"
                        src={produit.image_produit}
                        sx={{ 
                          width: '100%', 
                          height: 200, 
                          bgcolor: 'grey.100',
                          mx: 'auto'
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 60 }} />
                      </Avatar>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Statistiques
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Commandes
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {commandes.length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Quantité totale vendus
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {lignesProduit.reduce((sum, l) => sum + l.quantite_ligne_commande, 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Revenu généré
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="success.main">
                            {lignesProduit.reduce((sum, l) => sum + l.total_ligne_commande, 0).toLocaleString()} XOF
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Dates
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Créé le
                          </Typography>
                          <Typography variant="body2">
                            {new Date(produit.created_at_produit).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Modifié le
                          </Typography>
                          <Typography variant="body2">
                            {new Date(produit.updated_at_produit).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            {/* Commandes contenant ce produit */}
            {commandes.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalShippingIcon />
                      Commandes contenant ce produit
                    </Stack>
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    {commandes.map((cmd) => {
                      const lignesCmd = lignesProduit.filter(l => l.commande_code === cmd.code_commande);
                      return (
                        <Box 
                          key={cmd.id_commande}
                          sx={{ 
                            p: 2, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {cmd.code_commande}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantité: {lignesCmd.reduce((sum, l) => sum + l.quantite_ligne_commande, 0)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" fontWeight={600}>
                              {cmd.total_commande.toLocaleString()} XOF
                            </Typography>
                            <Chip 
                              label={cmd.statut_commande} 
                              size="small"
                              color={cmd.statut_commande === 'livree' ? 'success' : 
                                     cmd.statut_commande === 'annulee' ? 'error' : 'default'}
                            />
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;