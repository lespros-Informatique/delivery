import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockLivraisons, mockCommandes, mockLivreurs } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const livraison = mockLivraisons.find(l => l.code_livraison === code);
  
  if (!livraison) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Livraison non trouvée</Typography>
          <Button onClick={() => navigate('/deliveries')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  const commande = mockCommandes.find(c => c.code_commande === livraison.commande_code);
  const livreur = mockLivreurs.find(l => l.code_livreur === livraison.livreur_code);

  // Statut color mapping
  const statutColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    en_attente: 'default',
    assignee: 'info',
    en_cours: 'warning',
    livree: 'success',
    annulee: 'error'
  };

  return (
    <>
      <Helmet>
        <title>Livraison {livraison.code_livraison} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Accueil
                </Link>
                <Link component="button" variant="body2" onClick={() => navigate('/deliveries')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Livraisons
                </Link>
                <Typography variant="body2" color="text.primary">{livraison.code_livraison}</Typography>
              </Breadcrumbs>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={() => navigate('/deliveries')}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    Livraison {livraison.code_livraison}
                  </Typography>
                  <Chip 
                    label={livraison.statut_livraison} 
                    color={statutColors[livraison.statut_livraison] || 'default'} 
                    size="small" 
                  />
                </Stack>
                <Button variant="outlined" startIcon={<EditIcon />}>Modifier le statut</Button>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <ReceiptIcon /> Commande
                            </Stack>
                          </Typography>
                          <Divider />
                        </Box>
                        
                        {commande ? (
                          <Box 
                            sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                            onClick={() => navigate(`/orders/${commande.code_commande}`)}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" fontWeight={600}>{commande.code_commande}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Total: {commande.total_commande.toLocaleString()} XOF
                                </Typography>
                              </Box>
                              <Chip 
                                label={commande.statut_commande} 
                                size="small"
                                color={commande.statut_commande === 'livree' ? 'success' : 
                                       commande.statut_commande === 'annulee' ? 'error' : 'default'}
                              />
                            </Stack>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Commande non trouvée</Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PersonIcon /> Livreur assigné
                            </Stack>
                          </Typography>
                          <Divider />
                        </Box>
                        
                        {livreur ? (
                          <Box 
                            sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                            onClick={() => navigate(`/livreurs/${livreur.code_livreur}`)}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" fontWeight={600}>{livreur.nom_livreur}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {livreur.telephone_livreur || 'Aucun téléphone'}
                                </Typography>
                              </Box>
                              <Chip 
                                label={livreur.statut_livreurs === 1 ? 'Actif' : 'Inactif'} 
                                size="small"
                                color={livreur.statut_livreurs === 1 ? 'success' : 'error'}
                              />
                            </Stack>
                          </Box>
                        ) : (
                          <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, textAlign: 'center' }}>
                            <Typography variant="body2" color="warning.main">
                              Aucun livreur assigné
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTimeIcon /> Historique
                        </Stack>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date de création</Typography>
                          <Typography variant="body2">
                            {new Date(livraison.created_at_livraison).toLocaleString('fr-FR')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Dernière mise à jour</Typography>
                          <Typography variant="body2">
                            {new Date(livraison.updated_at_livraison).toLocaleString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Statut actuel</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Chip 
                          label={livraison.statut_livraison.replace('_', ' ').toUpperCase()} 
                          color={statutColors[livraison.statut_livraison] || 'default'}
                          sx={{ fontSize: '1rem', py: 2 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        {livraison.statut_livraison === 'en_attente' && 'En attente d\'assignation'}
                        {livraison.statut_livraison === 'assignee' && 'Livreur assigné, en attente de retrait'}
                        {livraison.statut_livraison === 'en_cours' && 'En cours de livraison'}
                        {livraison.statut_livraison === 'livree' && 'Livrée avec succès'}
                        {livraison.statut_livraison === 'annulee' && 'Livraison annulée'}
                      </Typography>
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