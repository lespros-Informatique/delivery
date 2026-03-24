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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { mockUsers, mockRoles, mockUserRoles, mockRestaurants, mockCommandes, mockPaiements, mockNotifications } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Types pour les données de l'utilisateur
interface UserStats {
  nombreRoles: number;
  roles: string[];
  restaurantsAssocies: number;
  commandesEffectuees: number;
  montantDepense: number;
  notificationsRecues: number;
  notificationsNonLues: number;
}

// Fonction pour obtenir les statistiques de l'utilisateur
const getUserStats = (userCode: string): UserStats => {
  // Roles de l'utilisateur
  const userRoles = mockUserRoles.filter(ur => ur.user_code === userCode && ur.etat_user_role === 1);
  const roles = userRoles.map(ur => {
    const role = mockRoles.find(r => r.code_role === ur.role_code);
    return role?.libelle_role || ur.role_code;
  });

  // Restaurants associés (pour restaurant_owner)
  const restaurants = mockRestaurants.filter(r => r.user_code === userCode);

  // Commandes (si client)
  const isClient = userRoles.some(ur => ur.role_code === 'client');
  const commandes = isClient ? mockCommandes.filter(c => c.client_code === userCode) : [];
  
  // Paiements
  const paiements = isClient ? mockPaiements.filter(p => {
    const cmd = mockCommandes.find(c => c.code_commande === p.commande_code);
    return cmd?.client_code === userCode;
  }) : [];

  // Notifications
  const notifications = mockNotifications.filter(n => n.user_code === userCode);

  return {
    nombreRoles: roles.length,
    roles,
    restaurantsAssocies: restaurants.length,
    commandesEffectuees: commandes.length,
    montantDepense: commandes
      .filter(c => c.statut_commande !== 'annulee')
      .reduce((sum, c) => sum + c.total_commande, 0),
    notificationsRecues: notifications.length,
    notificationsNonLues: notifications.filter(n => n.lu === 0).length,
  };
};

// Convertir les données mock vers le format détail
const getUserDetailData = (code: string) => {
  const user = mockUsers.find(u => u.code_user === code);
  if (!user) return null;
  return user;
};

// Page Détail Utilisateur
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const user = code ? getUserDetailData(code) : null;
  const stats = code ? getUserStats(code) : null;

  if (!user || !stats) {
    return (
      <>
        <Helmet>
          <title>Utilisateur non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Utilisateur non trouvé
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')}>
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
        <title>{user.nom_user} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête avec navigation */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <IconButton onClick={() => navigate('/users')}>
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {user.nom_user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {user.code_user}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => console.log('Edit', user.code_user)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => console.log('Delete', user.code_user)}
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
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '2rem'
                  }}
                >
                  {user.nom_user.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {user.nom_user}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip 
                      label={user.etat_users === 1 ? 'Actif' : 'Inactif'}
                      color={user.etat_users === 1 ? 'success' : 'error'}
                      size="small"
                    />
                    {stats.roles.map((role, idx) => (
                      <Chip 
                        key={idx}
                        label={role}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={3}>
                  {user.telephone_user && (
                    <Box sx={{ textAlign: 'center' }}>
                      <PhoneIcon color="primary" />
                      <Typography variant="caption" display="block">
                        {user.telephone_user}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ textAlign: 'center' }}>
                    <EmailIcon color="primary" />
                    <Typography variant="caption" display="block">
                      {user.email_user}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* KPI Cards - Statistiques principales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <SupervisorAccountIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Rôles</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.nombreRoles}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <RestaurantIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Restaurants</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.restaurantsAssocies}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <BusinessIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Commandes</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.commandesEffectuees}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Notifications</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.notificationsRecues}</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Section Rôles et Permissions */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <SupervisorAccountIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Rôles assignés</Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    {stats.roles.length > 0 ? (
                      stats.roles.map((role, idx) => (
                        <Box key={idx} sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight={500} color="primary.dark">
                              {role}
                            </Typography>
                            <Chip label="Actif" color="success" size="small" />
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                        <Typography color="text.secondary">Aucun rôle assigné</Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>

              {/* Section Restaurants associés */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <RestaurantIcon color="success" />
                    <Typography variant="h6" fontWeight={600}>Restaurants associés</Typography>
                  </Stack>
                  
                  {stats.restaurantsAssocies > 0 ? (
                    <Stack spacing={2}>
                      {mockRestaurants
                        .filter(r => r.user_code === user.code_user)
                        .map((restaurant, idx) => (
                          <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {restaurant.libelle_restaurant}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {restaurant.code_restaurant}
                                </Typography>
                              </Box>
                              <Chip 
                                label={restaurant.etat_restaurant === 1 ? 'Actif' : 'Inactif'}
                                color={restaurant.etat_restaurant === 1 ? 'success' : 'error'}
                                size="small"
                              />
                            </Stack>
                          </Box>
                        ))}
                    </Stack>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Typography color="text.secondary">Aucun restaurant associé</Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* Section Statistiques client (si applicable) */}
            {stats.commandesEffectuees > 0 && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <BusinessIcon color="warning" />
                      <Typography variant="h6" fontWeight={600}>Commandes</Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">Total commandes</Typography>
                            <Typography variant="h4" fontWeight={700} color="primary.main">{stats.commandesEffectuees}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">Montant total dépensé</Typography>
                            <Typography variant="h5" fontWeight={700} color="success.main">
                              {stats.montantDepense.toLocaleString('fr-FR')} XOF
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <PhoneIcon color="info" />
                      <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box sx={{ p: 2, bgcolor: stats.notificationsNonLues > 0 ? 'error.light' : 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight={700} color={stats.notificationsNonLues > 0 ? 'error.dark' : 'text.secondary'}>
                          {stats.notificationsNonLues}
                        </Typography>
                        <Typography variant="body2" color={stats.notificationsNonLues > 0 ? 'error.dark' : 'text.secondary'}>
                          Non lues
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} color="primary.dark">
                          {stats.notificationsRecues}
                        </Typography>
                        <Typography variant="body2" color="primary.dark">
                          Total notifications
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Informations générales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Informations générales</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Code utilisateur
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{user.code_user}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Nom complet
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{user.nom_user}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Téléphone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{user.telephone_user || 'Non défini'}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{user.email_user}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Informations système</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Statut
                      </Typography>
                      <Box mt={0.5}>
                        <Chip 
                          label={user.etat_users === 1 ? 'Actif' : 'Inactif'}
                          color={user.etat_users === 1 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Créé le
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(user.created_at_user).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Modifié le
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(user.updated_at_user).toLocaleDateString('fr-FR')}
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