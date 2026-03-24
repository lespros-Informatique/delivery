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
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { mockClients, mockCommandes, mockPaiements, mockLivraisons, mockNotifications, mockPaniers, mockLignesPanier, mockProduits } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Types pour les données du client
interface ClientStats {
  totalCommandes: number;
  montantTotal: number;
  panierMoyen: number;
  commandesParStatut: {
    en_attente: number;
    payee: number;
    en_preparation: number;
    livree: number;
    annulee: number;
  };
  totalPaiements: number;
  paiementsValides: number;
  paiementsEchoues: number;
  methodePreferee: string;
  livraisonsLivrees: number;
  livraisonsEnCours: number;
  notificationsNonLues: number;
  panierActif: {
    code_panier: string;
    restaurant_code: string;
    total_panier: number;
    statut_panier: string;
    articles: { produit_code: string; libelle_produit: string; quantite: number; prix: number; total: number }[];
  } | null;
}

// Fonction pour obtenir les statistiques du client
const getClientStats = (clientCode: string): ClientStats => {
  const commandes = mockCommandes.filter(c => c.client_code === clientCode);
  const paiements = mockPaiements.filter(p => {
    const cmd = mockCommandes.find(c => c.code_commande === p.commande_code);
    return cmd?.client_code === clientCode;
  });
  const livraisons = mockLivraisons.filter(l => {
    const cmd = mockCommandes.find(c => c.code_commande === l.commande_code);
    return cmd?.client_code === clientCode;
  });
  const notifications = mockNotifications.filter(n => n.client_code === clientCode);

  const montantTotal = commandes
    .filter(c => c.statut_commande !== 'annulee')
    .reduce((sum, c) => sum + c.total_commande, 0);

  const paiementsValides = paiements.filter(p => p.statut_paiement === 'valide').length;
  const paiementsEchoues = paiements.filter(p => p.statut_paiement === 'echoue').length;
  
  // Méthode de paiement préférée
  const methodes: Record<string, number> = {};
  paiements.forEach(p => {
    if (p.methode_paiement) {
      methodes[p.methode_paiement] = (methodes[p.methode_paiement] || 0) + 1;
    }
  });
  const methodePreferee = Object.entries(methodes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalCommandes: commandes.length,
    montantTotal,
    panierMoyen: commandes.length > 0 ? montantTotal / commandes.length : 0,
    commandesParStatut: {
      en_attente: commandes.filter(c => c.statut_commande === 'en_attente').length,
      payee: commandes.filter(c => c.statut_commande === 'payee').length,
      en_preparation: commandes.filter(c => c.statut_commande === 'en_preparation').length,
      livree: commandes.filter(c => c.statut_commande === 'livree').length,
      annulee: commandes.filter(c => c.statut_commande === 'annulee').length,
    },
    totalPaiements: paiements.reduce((sum, p) => sum + p.montant_paiement, 0),
    paiementsValides,
    paiementsEchoues,
    methodePreferee,
    livraisonsLivrees: livraisons.filter(l => l.statut_livraison === 'livree').length,
    livraisonsEnCours: livraisons.filter(l => l.statut_livraison === 'en_cours').length,
    notificationsNonLues: notifications.filter(n => n.lu === 0).length,
    
    // Panier actif
    panierActif: (() => {
      const panier = mockPaniers.find(p => p.client_code === clientCode && p.statut_panier === 'en_cours');
      if (!panier) return null;
      
      const lignes = mockLignesPanier.filter(lp => lp.panier_code === panier.code_panier);
      const articles = lignes.map(lp => {
        const produit = mockProduits.find(pr => pr.code_produit === lp.produit_code);
        return {
          produit_code: lp.produit_code,
          libelle_produit: produit?.libelle_produit || lp.produit_code,
          quantite: lp.quantite_ligne_panier,
          prix: lp.prix_unitaire_ligne__panier,
          total: lp.total_ligne_panier
        };
      });
      
      return {
        code_panier: panier.code_panier,
        restaurant_code: panier.restaurant_code,
        total_panier: panier.total_panier,
        statut_panier: panier.statut_panier,
        articles
      };
    })(),
  };
};

// Convertir les données mock vers le format détail
const getClientDetailData = (code: string) => {
  const client = mockClients.find(c => c.code_client === code);
  if (!client) return null;
  return client;
};

// Page Détail Client
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const client = code ? getClientDetailData(code) : null;
  const stats = code ? getClientStats(code) : null;

  if (!client || !stats) {
    return (
      <>
        <Helmet>
          <title>Client non trouvé | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Client non trouvé
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')}>
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
        <title>{client.nom_client} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête avec navigation */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <IconButton onClick={() => navigate('/clients')}>
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {client.nom_client}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {client.code_client}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => console.log('Edit', client.code_client)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => console.log('Delete', client.code_client)}
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
                  {client.nom_client.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {client.nom_client}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip 
                      label={client.statut_client === 1 ? 'Actif' : 'Inactif'}
                      color={client.statut_client === 1 ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={client.restaurant_code}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={3}>
                  {client.telephone_client && (
                    <Box sx={{ textAlign: 'center' }}>
                      <PhoneIcon color="primary" />
                      <Typography variant="caption" display="block">
                        {client.telephone_client}
                      </Typography>
                    </Box>
                  )}
                  {client.email_client && (
                    <Box sx={{ textAlign: 'center' }}>
                      <EmailIcon color="primary" />
                      <Typography variant="caption" display="block">
                        {client.email_client}
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
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Commandes</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.totalCommandes}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Montant Total</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.montantTotal.toLocaleString('fr-FR')} XOF</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Panier Moyen</Typography>
                    <Typography variant="h5" fontWeight={700}>{Math.round(stats.panierMoyen).toLocaleString('fr-FR')} XOF</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <LocalShippingIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Livraisons</Typography>
                    <Typography variant="h5" fontWeight={700}>{stats.livraisonsLivrees}</Typography>
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
                        <Typography variant="h5" fontWeight={700} color="success.dark">{stats.commandesParStatut.livree}</Typography>
                        <Typography variant="caption" color="success.dark" fontWeight={500}>Livrées</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="warning.dark">{stats.commandesParStatut.en_preparation + stats.commandesParStatut.payee}</Typography>
                        <Typography variant="caption" color="warning.dark" fontWeight={500}>En cours</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'error.light', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={700} color="error.dark">{stats.commandesParStatut.annulee}</Typography>
                        <Typography variant="caption" color="error.dark" fontWeight={500}>Annulées</Typography>
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
                        <Typography variant="body2" fontWeight={600}>{stats.commandesParStatut.livree}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesParStatut.livree / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PendingIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                          <Typography variant="body2">En préparation</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesParStatut.en_preparation}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesParStatut.en_preparation / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' } }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <HourglassEmptyIcon sx={{ fontSize: 18, color: 'info.main' }} />
                          <Typography variant="body2">Payées</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesParStatut.payee}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesParStatut.payee / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'info.main' } }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <HourglassEmptyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">En attente</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesParStatut.en_attente}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesParStatut.en_attente / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'grey.500' } }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CancelIcon sx={{ fontSize: 18, color: 'error.main' }} />
                          <Typography variant="body2">Annulées</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{stats.commandesParStatut.annulee}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.commandesParStatut.annulee / stats.totalCommandes) * 100 || 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'error.main' } }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Section Paiements */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6" fontWeight={600}>Paiements</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} color="success.dark">{stats.paiementsValides}</Typography>
                        <Typography variant="body2" color="success.dark">Validés</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} color="error.dark">{stats.paiementsEchoues}</Typography>
                        <Typography variant="body2" color="error.dark">Échoués</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">Méthode préférée</Typography>
                        <Typography variant="h6" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                          {stats.methodePreferee === 'mobile_money' ? 'Mobile Money' : stats.methodePreferee}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                        <Typography variant="body2" color="primary.dark">Total payé</Typography>
                        <Typography variant="h5" fontWeight={700} color="primary.dark">
                          {stats.totalPaiements.toLocaleString('fr-FR')} XOF
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>

            {/* Section Livraisons et Notifications + Panier */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <LocalShippingIcon color="warning" />
                    <Typography variant="h6" fontWeight={600}>Livraisons</Typography>
                  </Stack>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">Livrées</Typography>
                          <Typography variant="h4" fontWeight={700} color="success.main">{stats.livraisonsLivrees}</Typography>
                        </Box>
                        <CheckCircleIcon sx={{ fontSize: 40, color: 'success.light' }} />
                      </Stack>
                    </Box>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">En cours</Typography>
                          <Typography variant="h4" fontWeight={700} color="warning.main">{stats.livraisonsEnCours}</Typography>
                        </Box>
                        <LocalShippingIcon sx={{ fontSize: 40, color: 'warning.light' }} />
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <NotificationsIcon color="info" />
                    <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                  </Stack>
                  <Box sx={{ p: 3, bgcolor: stats.notificationsNonLues > 0 ? 'error.light' : 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color={stats.notificationsNonLues > 0 ? 'error.dark' : 'text.secondary'}>
                      {stats.notificationsNonLues}
                    </Typography>
                    <Typography variant="body2" color={stats.notificationsNonLues > 0 ? 'error.dark' : 'text.secondary'}>
                      {stats.notificationsNonLues > 0 ? 'Non lues' : 'Aucune notification'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {stats.panierActif && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 3, height: '100%', border: '2px solid', borderColor: 'warning.main' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <AddShoppingCartIcon color="warning" />
                      <Typography variant="h6" fontWeight={600}>Panier en cours</Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="body2" color="warning.dark">Restaurant</Typography>
                        <Typography variant="body1" fontWeight={600} color="warning.dark">{stats.panierActif.restaurant_code}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>Articles</Typography>
                        {stats.panierActif.articles.map((article, idx) => (
                          <Stack key={idx} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                            <Typography variant="body2">
                              {article.quantite}x {article.libelle_produit}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {article.total.toLocaleString('fr-FR')} XOF
                            </Typography>
                          </Stack>
                        ))}
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body1" fontWeight={600}>Total</Typography>
                          <Typography variant="h5" fontWeight={700} color="warning.main">
                            {stats.panierActif.total_panier.toLocaleString('fr-FR')} XOF
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Informations générales */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Informations générales</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Code client
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{client.code_client}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Nom complet
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{client.nom_client}</Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Téléphone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{client.telephone_client || 'Non défini'}</Typography>
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
                          <Typography variant="body1" fontWeight={500}>{client.email_client || 'Non défini'}</Typography>
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
                          <Typography variant="body1" fontWeight={500}>{client.restaurant_code}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Statut
                      </Typography>
                      <Box mt={0.5}>
                        <Chip 
                          label={client.statut_client === 1 ? 'Actif' : 'Inactif'}
                          color={client.statut_client === 1 ? 'success' : 'error'}
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
                            {new Date(client.created_at_client).toLocaleDateString('fr-FR')}
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
                            {new Date(client.updated_at_client).toLocaleDateString('fr-FR')}
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
