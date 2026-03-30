import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Button, Card, Grid, IconButton, 
  Stack, Typography, Chip, Avatar, CircularProgress, Alert
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
import StarIcon from '@mui/icons-material/Star';
import { restaurantsService, Restaurant } from 'src/lib/api';
import { PageContainer } from 'src/components/page-container';

// Page Détail Restaurant
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du restaurant depuis l'API
  const loadRestaurant = useCallback(async () => {
    if (!code) return;
    
    try {
      setLoading(true);
      const response = await restaurantsService.getByCode(code);
      if (response.success && response.data) {
        setRestaurant(response.data);
      } else {
        setError(response.message || 'Restaurant non trouvé');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  // Supprimer le restaurant
  const handleDelete = async () => {
    if (!restaurant) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant?')) {
      try {
        const response = await restaurantsService.delete(restaurant.id);
        if (response.success) {
          navigate('/restaurants');
        } else {
          setError(response.message || 'Erreur lors de la suppression');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  // Basculer le statut actif
  const handleToggleActive = async () => {
    if (!restaurant) return;
    
    try {
      const response = await restaurantsService.toggleActive(restaurant.id);
      if (response.success && response.data) {
        setRestaurant(response.data);
      } else {
        setError(response.message || 'Erreur lors du changement de statut');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de statut');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chargement... | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </PageContainer>
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <Helmet>
          <title>Restaurant non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {error || 'Restaurant non trouvé'}
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
        <title>{restaurant.nomRestaurant} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
          {/* Message d'erreur */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* En-tête avec navigation */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <IconButton onClick={() => navigate('/restaurants')}>
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700}>
                  {restaurant.nomRestaurant}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {restaurant.codeRestaurant}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => console.log('Edit', restaurant.codeRestaurant)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
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
                  color: 'success.contrastText',
                  fontSize: '2rem'
                }}
                src={restaurant.imageRestaurant || undefined}
              >
                {restaurant.nomRestaurant.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={600}>
                  {restaurant.nomRestaurant}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip 
                    label={restaurant.active ? 'Actif' : 'Inactif'}
                    color={restaurant.active ? 'success' : 'error'}
                    size="small"
                    onClick={handleToggleActive}
                    style={{ cursor: 'pointer' }}
                  />
                  {restaurant.Ville && (
                    <Chip 
                      label={restaurant.Ville.nomVille}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {restaurant.noteRestaurant && (
                    <Chip 
                      icon={<StarIcon />}
                      label={`${restaurant.noteRestaurant}/5`}
                      variant="outlined"
                      size="small"
                      color="warning"
                    />
                  )}
                </Stack>
              </Box>
              {restaurant.addressRestaurant && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    {restaurant.addressRestaurant}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Card>

          {/* KPI Cards */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                  <RestaurantMenuIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Statut</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {restaurant.active ? 'Actif' : 'Inactif'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                  <StarIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Note</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {restaurant.noteRestaurant ? `${restaurant.noteRestaurant}/5` : 'N/A'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                  <LocationOnIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Ville</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    {restaurant.Ville?.nomVille || 'Non défini'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                  <CalendarTodayIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Créé le</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    {new Date(restaurant.createdAt).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
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
                    <Typography variant="body1" fontWeight={500}>{restaurant.codeRestaurant}</Typography>
                  </Box>
                  <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                      Nom du restaurant
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>{restaurant.nomRestaurant}</Typography>
                  </Box>
                  {restaurant.descriptionRestaurant && (
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Description
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{restaurant.descriptionRestaurant}</Typography>
                    </Box>
                  )}
                  {restaurant.addressRestaurant && (
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Adresse
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.addressRestaurant}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Coordonnées</Typography>
                <Stack spacing={2}>
                  {restaurant.telephoneRestaurant && (
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Téléphone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.telephoneRestaurant}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  {restaurant.emailRestaurant && (
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.emailRestaurant}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  {restaurant.Ville && (
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StoreIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Ville
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{restaurant.Ville.nomVille}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  <Box sx={{ py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Créé le
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(restaurant.createdAt).toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Localisation */}
          {restaurant.latitude && restaurant.longitude && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Localisation</Typography>
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Latitude
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>{restaurant.latitude}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Longitude
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>{restaurant.longitude}</Typography>
                </Box>
              </Stack>
            </Card>
          )}
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;