import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, Card, Grid, IconButton, 
  Stack, Typography, Chip, Avatar, LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { mockLivreurs, mockLivraisons, mockWalletLivreurs, mockWalletTransactions, mockGains } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Types pour les données du livreur
interface LivreurStats {
  totalLivraisons: number;
  livraisonsLivrees: number;
  livraisonsEnCours: number;
  wallet: {
    code_wallet: string;
    solde: number;
    total_retire: number;
    statut_wallet: string;
  } | null;
  totalGains: number;
  gainsVerses: number;
  gainsEnAttente: number;
  transactionsRecentes: { type: string; montant: number; description: string; date: string }[];
}

// Fonction pour obtenir les statistiques du livreur
const getLivreurStats = (livreurCode: string): LivreurStats => {
  const livraisons = mockLivraisons.filter(l => l.livreur_code === livreurCode);
  const wallet = mockWalletLivreurs.find(w => w.livreur_code === livreurCode);
  const gains = mockGains.filter(g => {
    const livraison = mockLivraisons.find(l => l.code_livraison === g.commande_code);
    return livraison?.livreur_code === livreurCode;
  });
  const transactions = mockWalletTransactions.filter(t => {
    const w = mockWalletLivreurs.find(w => w.code_wallet === t.wallet_code);
    return w?.livreur_code === livreurCode;
  });

  return {
    totalLivraisons: livraisons.length,
    livraisonsLivrees: livraisons.filter(l => l.statut_livraison === 'livree').length,
    livraisonsEnCours: livraisons.filter(l => l.statut_livraison === 'en_cours').length,
    wallet: wallet ? {
      code_wallet: wallet.code_wallet,
      solde: wallet.solde,
      total_retire: wallet.total_retire,
      statut_wallet: wallet.statut_wallet
    } : null,
    totalGains: gains.reduce((sum, g) => sum + g.montant_delivery, 0),
    gainsVerses: gains.filter(g => g.statut_gain === 'verse').reduce((sum, g) => sum + g.montant_delivery, 0),
    gainsEnAttente: gains.filter(g => g.statut_gain === 'en_attente').reduce((sum, g) => sum + g.montant_delivery, 0),
    transactionsRecentes: transactions.slice(0, 5).map(t => ({
      type: t.type_transaction,
      montant: t.montant,
      description: t.description || '',
      date: t.created_at_transaction
    }))
  };
};

// Convertir les données mock vers le format détail
const getLivreurDetailData = (code: string) => {
  const livreur = mockLivreurs.find(l => l.code_livreur === code);
  if (!livreur) return null;
  return livreur;
};

// Page Détail Livreur
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const livreur = code ? getLivreurDetailData(code) : null;
  const stats = code ? getLivreurStats(code) : null;

  if (!livreur || !stats) {
    return (
      <>
        <Helmet>
          <title>Livreur non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Livreur non trouvé
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/livreurs')}>
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
        <title>{livreur.nom_livreur} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête avec navigation */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <IconButton onClick={() => navigate('/livreurs')}>
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {livreur.nom_livreur}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {livreur.code_livreur}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => console.log('Edit', livreur.code_livreur)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => console.log('Delete', livreur.code_livreur)}
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
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                    fontSize: '2rem'
                  }}
                >
                  {livreur.nom_livreur.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {livreur.nom_livreur}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip 
                      label={livreur.statut_livreurs === 1 ? 'Actif' : 'Inactif'}
                      color={livreur.statut_livreurs === 1 ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={livreur.restaurant_code || 'Indépendant'}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={3}>
                  {livreur.telephone_livreur && (
                    <Box sx={{ textAlign: 'center' }}>
                      <PhoneIcon color="warning" />
                      <Typography variant="caption" display="block">
                        {livreur.telephone_livreur}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Card>

            {/* KPI Cards - Statistiques principales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <LocalShippingIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Livraisons</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalLivraisons}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Livrées</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.livraisonsLivrees}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <HourglassEmptyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">En cours</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.livraisonsEnCours}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Gains</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalGains.toLocaleString('fr-FR')} XOF</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Section Livraisons par statut */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <LocalShippingIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Livraisons</Typography>
                  </Stack>
                  
                  {/* Stats rapides en haut */}
                  <Grid container spacing={1.5} mb={3}>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="success.dark">{stats.livraisonsLivrees}</Typography>
                        <Typography variant="caption" color="success.dark" fontWeight={500}>Livrées</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="warning.dark">{stats.livraisonsEnCours}</Typography>
                        <Typography variant="caption" color="warning.dark" fontWeight={500}>En cours</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="info.dark">{stats.totalLivraisons}</Typography>
                        <Typography variant="caption" color="info.dark" fontWeight={500}>Total</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="body2">Livrées</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.livraisonsLivrees}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.livraisonsLivrees / stats.totalLivraisons) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <HourglassEmptyIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                          <Typography variant="body2">En cours</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.livraisonsEnCours}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.livraisonsEnCours / stats.totalLivraisons) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' } }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Section Wallet */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AccountBalanceWalletIcon color="success" />
                    <Typography variant="h6" fontWeight={600}>Wallet</Typography>
                  </Stack>
                  {stats.wallet ? (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="success.dark">{stats.wallet.solde.toLocaleString('fr-FR')}</Typography>
                          <Typography variant="body2" color="success.dark">Solde (XOF)</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="info.dark">{stats.wallet.total_retire.toLocaleString('fr-FR')}</Typography>
                          <Typography variant="body2" color="info.dark">Retiré (XOF)</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Statut du wallet</Typography>
                          <Chip 
                            label={stats.wallet.statut_wallet === 'actif' ? 'Actif' : stats.wallet.statut_wallet}
                            color={stats.wallet.statut_wallet === 'actif' ? 'success' : 'error'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="body2" color="primary.dark">Total gains</Typography>
                          <Typography variant="h5" fontWeight={700} color="primary.dark">
                            {stats.totalGains.toLocaleString('fr-FR')} XOF
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Typography color="text.secondary">Aucun wallet associé</Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* Section Gains et Transactions */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <TrendingUpIcon color="info" />
                    <Typography variant="h6" fontWeight={600}>Gains</Typography>
                  </Stack>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">Versés</Typography>
                          <Typography variant="h5" fontWeight={700} color="success.main">{stats.gainsVerses.toLocaleString('fr-FR')} XOF</Typography>
                        </Box>
                        <CheckCircleIcon sx={{ fontSize: 40, color: 'success.light' }} />
                      </Stack>
                    </Box>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">En attente</Typography>
                          <Typography variant="h5" fontWeight={700} color="warning.main">{stats.gainsEnAttente.toLocaleString('fr-FR')} XOF</Typography>
                        </Box>
                        <HourglassEmptyIcon sx={{ fontSize: 40, color: 'warning.light' }} />
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AttachMoneyIcon color="warning" />
                    <Typography variant="h6" fontWeight={600}>Transactions récentes</Typography>
                  </Stack>
                  {stats.transactionsRecentes.length > 0 ? (
                    <Stack spacing={1}>
                      {stats.transactionsRecentes.map((tx, idx) => (
                        <Box key={idx} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                                {tx.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(tx.date).toLocaleDateString('fr-FR')}
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={600} color={tx.type === 'retrait' ? 'error.main' : 'success.main'}>
                              {tx.type === 'retrait' ? '-' : '+'}{tx.montant.toLocaleString('fr-FR')} XOF
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Typography color="text.secondary">Aucune transaction</Typography>
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
                        Code livreur
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{livreur.code_livreur}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Nom complet
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{livreur.nom_livreur}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Téléphone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{livreur.telephone_livreur || 'Non défini'}</Typography>
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
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StoreIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Restaurant
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{livreur.restaurant_code || 'Indépendant'}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Statut
                      </Typography>
                      <Box mt={0.5}>
                        <Chip 
                          label={livreur.statut_livreurs === 1 ? 'Actif' : 'Inactif'}
                          color={livreur.statut_livreurs === 1 ? 'success' : 'error'}
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
                            {new Date(livreur.created_at_livreur).toLocaleDateString('fr-FR')}
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
