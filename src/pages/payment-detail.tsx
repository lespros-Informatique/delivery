import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockPaiements, mockCommandes } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const paiement = mockPaiements.find(p => p.code_paiement === code);
  
  if (!paiement) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Paiement non trouvé</Typography>
          <Button onClick={() => navigate('/payments')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  const commande = mockCommandes.find(c => c.code_commande === paiement.commande_code);

  // Statut color mapping
  const statutColors: Record<string, 'warning' | 'success' | 'error'> = {
    en_attente: 'warning',
    valide: 'success',
    echoue: 'error'
  };

  // Méthode icon
  const getMethodeIcon = () => {
    switch (paiement.methode_paiement) {
      case 'mobile_money': return '📱';
      case 'carte_bancaire': return '💳';
      case 'espèces': return '💵';
      case 'paypal': return '🅿️';
      default: return '💰';
    }
  };

  return (
    <>
      <Helmet>
        <title>Paiement {paiement.code_paiement} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Accueil
                </Link>
                <Link component="button" variant="body2" onClick={() => navigate('/payments')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Paiements
                </Link>
                <Typography variant="body2" color="text.primary">{paiement.code_paiement}</Typography>
              </Breadcrumbs>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={() => navigate('/payments')}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight={700}>
                  Paiement {paiement.code_paiement}
                </Typography>
                <Chip 
                  label={paiement.statut_paiement} 
                  color={statutColors[paiement.statut_paiement] || 'default'} 
                  size="small" 
                />
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
                              <ReceiptIcon /> Commande associée
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
                                  Client: {commande.client_code}
                                </Typography>
                              </Box>
                              <Typography variant="h6" fontWeight={700} color="primary.main">
                                {commande.total_commande.toLocaleString()} XOF
                              </Typography>
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
                              <AccountBalanceIcon /> Détails du paiement
                            </Stack>
                          </Typography>
                          <Divider />
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">MÉTHODE DE PAIEMENT</Typography>
                              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                <Typography variant="h6">{getMethodeIcon()}</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {paiement.methode_paiement || 'Non défini'}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
                              <Typography variant="caption" color="success.contrastText">MONTANT</Typography>
                              <Typography variant="h4" color="success.contrastText" fontWeight={700}>
                                {paiement.montant_paiement.toLocaleString()} XOF
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">RÉFÉRENCE EXTERNE</Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {paiement.reference_externe || 'Aucune référence'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
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
                          <AccessTimeIcon /> Dates
                        </Stack>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date du paiement</Typography>
                          <Typography variant="body2">
                            {new Date(paiement.created_at_paiement).toLocaleString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Statut du paiement</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Chip 
                          label={paiement.statut_paiement.toUpperCase()} 
                          color={statutColors[paiement.statut_paiement] || 'default'}
                          sx={{ fontSize: '1rem', py: 2 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        {paiement.statut_paiement === 'en_attente' && 'En attente de validation'}
                        {paiement.statut_paiement === 'valide' && 'Paiement confirmé'}
                        {paiement.statut_paiement === 'echoue' && 'Paiement échoué'}
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