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
import LockIcon from '@mui/icons-material/Lock';
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
        const response = await usersService.delete(user.codeUser);
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
      const response = await usersService.toggleActive(user.codeUser);
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
                  onClick={() => navigate(`/users?edit=${user.codeUser}`)}
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
                    label={user.etatUsers ? 'Actif' : 'Inactif'}
                    color={user.etatUsers ? 'success' : 'error'}
                    size="small"
                    onClick={handleToggleActive}
                    style={{ cursor: 'pointer' }}
                  />
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
                    {user.emailUser}
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
                  <Typography variant="body2" color="text.secondary">Statut</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {user.etatUsers ? 'Actif' : 'Inactif'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                  <CalendarTodayIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Date création</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    {user.createdAtUser ? new Date(user.createdAtUser).toLocaleDateString('fr-FR') : 'N/A'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    {user.telephoneUser || 'Non défini'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                  <LockIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Sécurité</Typography>
                  <Typography variant="h6" fontWeight={500}>
                    Mot de passe hashé
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
                        <Typography variant="body1" fontWeight={500}>{user.emailUser}</Typography>
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
                        label={user.etatUsers ? 'Actif' : 'Inactif'}
                        color={user.etatUsers ? 'success' : 'error'}
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
                          {user.createdAtUser ? new Date(user.createdAtUser).toLocaleDateString('fr-FR') : 'N/A'}
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
                          {user.updatedAtUser ? new Date(user.updatedAtUser).toLocaleDateString('fr-FR') : 'Jamais'}
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