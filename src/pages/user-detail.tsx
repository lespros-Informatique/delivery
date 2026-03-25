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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { usersService, User } from 'src/lib/api';
import { PageContainer } from 'src/components/page-container';

// Page Détail Utilisateur
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de l'utilisateur depuis l'API
  const loadUser = useCallback(async () => {
    if (!code) return;
    
    try {
      setLoading(true);
      const response = await usersService.getByCode(code);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || 'Utilisateur non trouvé');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Supprimer l'utilisateur
  const handleDelete = async () => {
    if (!user) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        const response = await usersService.delete(user.id);
        if (response.success) {
          navigate('/users');
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
    if (!user) return;
    
    try {
      const response = await usersService.toggleActive(user.id);
      if (response.success && response.data) {
        setUser(response.data);
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

  if (error || !user) {
    return (
      <>
        <Helmet>
          <title>Utilisateur non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {error || 'Utilisateur non trouvé'}
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
        <title>{user.nomUser} | Woli Delivery</title>
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
              <IconButton onClick={() => navigate('/users')}>
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700}>
                  {user.nomUser}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {user.codeUser}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => console.log('Edit', user.codeUser)}
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
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '2rem'
                }}
              >
                {user.nomUser.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={600}>
                  {user.nomUser}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip 
                    label={user.active ? 'Actif' : 'Inactif'}
                    color={user.active ? 'success' : 'error'}
                    size="small"
                    onClick={handleToggleActive}
                    style={{ cursor: 'pointer' }}
                  />
                  {user.roles?.map((role, idx) => (
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
                {user.telephoneUser && (
                  <Box sx={{ textAlign: 'center' }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="caption" display="block">
                      {user.telephoneUser}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ textAlign: 'center' }}>
                  <EmailIcon color="primary" />
                  <Typography variant="caption" display="block">
                    {user.email}
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
                  <Typography variant="h5" fontWeight={700}>{user.roles?.length || 0}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                  <RestaurantIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Permissions</Typography>
                  <Typography variant="h5" fontWeight={700}>{user.permissions?.length || 0}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                  <CalendarTodayIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Dernière connexion</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Statut</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {user.active ? 'Actif' : 'Inactif'}
                  </Typography>
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
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, idx) => (
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

            {/* Section Permissions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <SupervisorAccountIcon color="success" />
                  <Typography variant="h6" fontWeight={600}>Permissions</Typography>
                </Stack>
                
                {user.permissions && user.permissions.length > 0 ? (
                  <Stack spacing={2}>
                    {user.permissions.map((permission, idx) => (
                      <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" fontWeight={500}>
                            {permission}
                          </Typography>
                          <Chip label="Autorisé" color="success" size="small" />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucune permission</Typography>
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
                      Code utilisateur
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>{user.codeUser}</Typography>
                  </Box>
                  <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                      Nom complet
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>{user.nomUser}</Typography>
                  </Box>
                  <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Téléphone
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{user.telephoneUser || 'Non défini'}</Typography>
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
                        <Typography variant="body1" fontWeight={500}>{user.email}</Typography>
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
                        label={user.active ? 'Actif' : 'Inactif'}
                        color={user.active ? 'success' : 'error'}
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
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
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
                          {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
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