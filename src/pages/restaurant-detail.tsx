import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, Card, Grid, IconButton, 
  Stack, Typography, Chip, Avatar, LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarIcon from '@mui/icons-material/Star';
import { mockRestaurants, mockCategories, mockProduits, mockCommandes, mockClients, mockLivreurs, mockEvaluations, mockGains } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Types pour les données du restaurant
interface RestaurantStats {
  totalCategories: number;
  totalProduits: number;
  totalCommandes: number;
  commandesLivrees: number;
  commandesEnCours: number;
  totalClients: number;
  totalLivreurs: number;
  revenus: number;
  gains: number;
  noteMoyenne: number;
  totalEvaluations: number;
}

// Fonction pour obtenir les statistiques du restaurant
const getRestaurantStats = (restaurantCode: string): RestaurantStats => {
  const categories = mockCategories.filter(c => c.restaurant_code === restaurantCode);
  const produits = mockProduits.filter(p => p.restaurant_code === restaurantCode);
  const commandes = mockCommandes.filter(c => c.restaurant_code === restaurantCode);
  const clients = mockClients.filter(c => c.restaurant_code === restaurantCode);
  const livreurs = mockLivreurs.filter(l => l.restaurant_code === restaurantCode);
  const evaluations = mockEvaluations.filter(e => e.restaurant_code === restaurantCode);
  const gains = mockGains.filter(g => g.restaurant_code === restaurantCode);

  // Calcul de la note moyenne
  const noteMoyenne = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.note, 0) / evaluations.length
    : 0;

  return {
    totalCategories: categories.length,
    totalProduits: produits.length,
    totalCommandes: commandes.length,
    commandesLivrees: commandes.filter(c => c.statut_commande === 'livree').length,
    commandesEnCours: commandes.filter(c => ['en_attente', 'payee', 'en_preparation'].includes(c.statut_commande)).length,
    totalClients: clients.length,
    totalLivreurs: livreurs.length,
    revenus: commandes
      .filter(c => c.statut_commande !== 'annulee')
      .reduce((sum, c) => sum + c.total_commande, 0),
    gains: gains.reduce((sum, g) => sum + g.montant_restaurant, 0),
    noteMoyenne: Math.round(noteMoyenne * 10) / 10,
    totalEvaluations: evaluations.length,
  };
};

// Convertir les données mock vers le format détail
const getRestaurantDetailData = (code: string) => {
  const restaurant = mockRestaurants.find(r => r.code_restaurant === code);
  if (!restaurant) return null;
  return restaurant;
};

// Page Détail Restaurant
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const restaurant = code ? getRestaurantDetailData(code) : null;
  const stats = code ? getRestaurantStats(code) : null;

  if (!restaurant || !stats) {
    return (
      <>
        <Helmet>
          <title>Restaurant non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Restaurant non trouvé
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/restaurants')}>
              Retour à la liste
            </Button>
          </Box>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{restaurant.libelle_restaurant} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête avec navigation */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <IconButton onClick={() => navigate('/restaurants')}>
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {restaurant.libelle_restaurant}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {restaurant.code_restaurant}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => console.log('Edit', restaurant.code_restaurant)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => console.log('Delete', restaurant.code_restaurant)}
                  >
                    Supprimer
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Avatar et résumé */}
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar 
                  variant="rounded"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'success.main',
                    color: 'white',
                    fontSize: '2rem'
                  }}
                  src={restaurant.logo_restaurant || undefined}
                >
                  {restaurant.libelle_restaurant.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {restaurant.libelle_restaurant}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip 
                      label={restaurant.etat_restaurant === 1 ? 'Actif' : 'Inactif'}
                      color={restaurant.etat_restaurant === 1 ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={restaurant.famille_code || 'Non défini'}
                      variant="outlined"
                      size="small"
                    />
                    <Chip 
                      label={restaurant.ville_code || 'Non défini'}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Box>
                {restaurant.adresse_restaurant && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.adresse_restaurant}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Card>

            {/* KPI Cards - Statistiques principales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <RestaurantMenuIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Produits</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalProduits}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Commandes</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalCommandes}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Clients</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalClients}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Revenus</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.revenus.toLocaleString('fr-FR')} XOF</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Section Commandes par statut */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <ShoppingCartIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Commandes</Typography>
                  </Stack>
                  
                  {/* Stats rapides en haut */}
                  <Grid container spacing={1.5} mb={3}>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="success.dark">{stats.commandesLivrees}</Typography>
                        <Typography variant="caption" color="success.dark" fontWeight={500}>Livrées</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="warning.dark">{stats.commandesEnCours}</Typography>
                        <Typography variant="caption" color="warning.dark" fontWeight={500}>En cours</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="info.dark">{stats.totalCommandes}</Typography>
                        <Typography variant="caption" color="info.dark" fontWeight={500}>Total</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <StarIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="body2">Livrées</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesLivrees}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesLivrees / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ShoppingCartIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                          <Typography variant="body2">En cours</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesEnCours}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesEnCours / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' } }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Section Revenus et Évaluations */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6" fontWeight={600}>Revenus</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} color="success.dark">
                          {stats.revenus.toLocaleString('fr-FR')}
                        </Typography>
                        <Typography variant="body2" color="success.dark">Revenus (XOF)</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} color="info.dark">
                          {stats.gains.toLocaleString('fr-FR')}
                        </Typography>
                        <Typography variant="body2" color="info.dark">Gains (XOF)</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                          <StarIcon color="warning" />
                          <Typography variant="h4" fontWeight={700} color="warning.main">
                            {stats.noteMoyenne}/5
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          ({stats.totalEvaluations} évaluations)
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>

            {/* Section Catégories et Produits */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Catégories</Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    {mockCategories
                      .filter(c => c.restaurant_code === restaurant.code_restaurant)
                      .map((categorie, idx) => {
                        const nbProduits = mockProduits.filter(p => p.categorie_code === categorie.code_categorie).length;
                        return (
                          <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {categorie.libelle_categorie}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {categorie.code_categorie}
                                </Typography>
                              </Box>
                              <Chip 
                                label={`${nbProduits} produits`}
                                variant="outlined"
                                size="small"
                              />
                            </Stack>
                          </Box>
                        );
                      })}
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <LocalShippingIcon color="warning" />
                    <Typography variant="h6" fontWeight={600}>Livreurs associés</Typography>
                  </Stack>
                  
                  {stats.totalLivreurs > 0 ? (
                    <Stack spacing={2}>
                      {mockLivreurs
                        .filter(l => l.restaurant_code === restaurant.code_restaurant)
                        .map((livreur, idx) => (
                          <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {livreur.nom_livreur}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {livreur.code_livreur}
                                </Typography>
                              </Box>
                              <Chip 
                                label={livreur.statut_livreurs === 1 ? 'Actif' : 'Inactif'}
                                color={livreur.statut_livreurs === 1 ? 'success' : 'error'}
                                size="small"
                              />
                            </Stack>
                          </Box>
                        ))}
                    </Stack>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Typography color="text.secondary">Aucun livreur associé</Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* Informations générales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Informations générales</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Code restaurant
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{restaurant.code_restaurant}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Nom du restaurant
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{restaurant.libelle_restaurant}</Typography>
                    </Box>
                    {restaurant.description_restaurant && (
                      <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Description
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{restaurant.description_restaurant}</Typography>
                      </Box>
                    )}
                    {restaurant.adresse_restaurant && (
                      <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                              Adresse
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>{restaurant.adresse_restaurant}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Informations système</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StoreIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Propriétaire
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.user_code}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <RestaurantMenuIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Type / Famille
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.famille_code || 'Non défini'}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Statut
                      </Typography>
                      <Box mt={0.5}>
                        <Chip 
                          label={restaurant.etat_restaurant === 1 ? 'Actif' : 'Inactif'}
                          color={restaurant.etat_restaurant === 1 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ py: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Créé le
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(restaurant.created_at_restaurant).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;