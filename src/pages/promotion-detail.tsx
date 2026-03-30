import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DiscountIcon from '@mui/icons-material/Discount';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { mockPromotions, mockRestaurants } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const promotion = mockPromotions.find(p => p.code_promotion === code);
  
  if (!promotion) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Promotion non trouvée</Typography>
          <Button onClick={() => navigate('/promotions')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  const restaurant = promotion.restaurant_code 
    ? mockRestaurants.find(r => r.code_restaurant === promotion.restaurant_code)
    : null;

  // Calculer la valeur格式化
  const formattedValue = () => {
    if (promotion.type_promotion === 'pourcentage') return `${promotion.valeur}%`;
    if (promotion.type_promotion === 'montant_fixe') return `${promotion.valeur.toLocaleString()} XOF`;
    return 'GRATUIT';
  };

  // Vérifier si la promotion est encore active
  const isExpired = new Date(promotion.date_fin) < new Date();
  const isActive = promotion.statut_promotion === 'active' && !isExpired;

  return (
    <>
      <Helmet>
        <title>{promotion.code_promotion} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Accueil
                </Link>
                <Link component="button" variant="body2" onClick={() => navigate('/promotions')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Promotions
                </Link>
                <Typography variant="body2" color="text.primary">{promotion.code_promotion}</Typography>
              </Breadcrumbs>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={() => navigate('/promotions')}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    {promotion.code_reduction}
                  </Typography>
                  <Chip 
                    label={promotion.statut_promotion} 
                    color={isActive ? 'success' : isExpired ? 'warning' : 'error'} 
                    size="small" 
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />}>Modifier</Button>
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Supprimer</Button>
                </Stack>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom>Informations de la promotion</Typography>
                        <Divider />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="caption" color="primary.contrastText">TYPE</Typography>
                          <Typography variant="h5" color="primary.contrastText" fontWeight={700}>
                            {promotion.type_promotion === 'pourcentage' ? 'Pourcentage' : 
                             promotion.type_promotion === 'montant_fixe' ? 'Montant fixe' : 'Livraison gratuite'}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="caption" color="success.contrastText">VALEUR</Typography>
                          <Typography variant="h5" color="success.contrastText" fontWeight={700}>
                            {formattedValue()}
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">CODE PROMOTION</Typography>
                            <Typography variant="h6" fontWeight={600}>{promotion.code_promotion}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">CODE RÉDUCTION</Typography>
                            <Typography variant="h6" fontWeight={600}>{promotion.code_reduction || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {restaurant && (
                          <Chip 
                            icon={<RestaurantIcon />} 
                            label={restaurant.libelle_restaurant}
                            variant="outlined"
                            onClick={() => navigate(`/restaurants/${restaurant.code_restaurant}`)}
                            sx={{ cursor: 'pointer' }}
                          />
                        )}
                        {!restaurant && (
                          <Chip label="Plateforme (tous restaurants)" variant="outlined" color="primary" />
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarTodayIcon /> Période
                        </Stack>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date de début</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {new Date(promotion.date_debut).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date de fin</Typography>
                          <Typography variant="body1" fontWeight={600} color={isExpired ? 'error.main' : 'inherit'}>
                            {new Date(promotion.date_fin).toLocaleDateString('fr-FR')}
                            {isExpired && ' (Expirée)'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DiscountIcon /> Utilisation
                        </Stack>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Utilisations actuelles</Typography>
                          <Typography variant="body1" fontWeight={600}>{promotion.utilisations_actuelles}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Utilisations max</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {promotion.utilisations_max || 'Illimité'}
                          </Typography>
                        </Box>
                        {promotion.utilisations_max && (
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">Taux d'utilisation</Typography>
                              <Typography variant="caption" fontWeight={600}>
                                {Math.round((promotion.utilisations_actuelles / promotion.utilisations_max) * 100)}%
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                              <Box sx={{ 
                                width: `${(promotion.utilisations_actuelles / promotion.utilisations_max) * 100}%`, 
                                height: '100%', 
                                bgcolor: 'primary.main' 
                              }} />
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;