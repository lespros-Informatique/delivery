import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, Grid, IconButton,
  Stack, Typography, Chip, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockCommandes, mockLignesCommandes, mockClients, mockRestaurants, mockLivreurs, mockLivraisons, mockPaiements, mockEvaluations, mockProduits } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Types pour les données de la commande
interface CommandeStats {
  lignes: { code: string; produit: string; quantite: number; prix: number; total: number }[];
  client: { code: string; nom: string; telephone: string | null; email: string } | null;
  restaurant: { code: string; nom: string; adresse: string | null } | null;
  livraison: { code: string; statut: string; livreur: string | null; created_at: string } | null;
  paiement: { code: string; methode: string | null; montant: number; statut: string; reference: string | null } | null;
  evaluation: { note: number; commentaire: string | null; note_livraison: number | null; commentaire_livraison: string | null } | null;
}

// Fonction pour obtenir les détails de la commande
const getCommandeStats = (commandeCode: string): CommandeStats => {
  const lignes = mockLignesCommandes.filter(l => l.commande_code === commandeCode).map(l => {
    const produit = mockProduits.find(p => p.code_produit === l.produit_code);
    return {
      code: l.code_commande_ligne,
      produit: produit?.libelle_produit || l.produit_code,
      quantite: l.quantite_ligne_commande,
      prix: l.prix_unitaire_ligne_commande,
      total: l.total_ligne_commande
    };
  });

  const commande = mockCommandes.find(c => c.code_commande === commandeCode);
  const client = commande ? mockClients.find(c => c.code_client === commande.client_code) : null;
  const restaurant = commande ? mockRestaurants.find(r => r.code_restaurant === commande.restaurant_code) : null;
  const livraison = mockLivraisons.find(l => l.commande_code === commandeCode);
  const paiement = mockPaiements.find(p => p.commande_code === commandeCode);
  const evaluation = mockEvaluations.find(e => e.commande_code === commandeCode);

  const livreur = livraison ? mockLivreurs.find(l => l.code_livreur === livraison.livreur_code) : null;

  return {
    lignes,
    client: client ? {
      code: client.code_client,
      nom: client.nom_client,
      telephone: client.telephone_client,
      email: client.email_client || ''
    } : null,
    restaurant: restaurant ? {
      code: restaurant.code_restaurant,
      nom: restaurant.libelle_restaurant,
      adresse: restaurant.adresse_restaurant
    } : null,
    livraison: livraison ? {
      code: livraison.code_livraison,
      statut: livraison.statut_livraison,
      livreur: livreur ? livreur.nom_livreur : null,
      created_at: livraison.created_at_livraison
    } : null,
    paiement: paiement ? {
      code: paiement.code_paiement,
      methode: paiement.methode_paiement,
      montant: paiement.montant_paiement,
      statut: paiement.statut_paiement,
      reference: paiement.reference_externe
    } : null,
    evaluation: evaluation ? {
      note: evaluation.note,
      commentaire: evaluation.commentaire,
      note_livraison: evaluation.note_livraison,
      commentaire_livraison: evaluation.commentaire_livraison
    } : null
  };
};

// Obtenir les données de la commande
const getCommandeDetailData = (code: string) => {
  const commande = mockCommandes.find(c => c.code_commande === code);
  if (!commande) return null;
  return commande;
};

// Helper pour le statut de commande
const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'livree': return 'success';
    case 'en_preparation': return 'warning';
    case 'en_attente': return 'info';
    case 'payee': return 'success';
    case 'annulee': return 'error';
    default: return 'default';
  }
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'livree': return 'Livrée';
    case 'en_preparation': return 'En préparation';
    case 'en_attente': return 'En attente';
    case 'payee': return 'Payée';
    case 'annulee': return 'Annulée';
    default: return statut;
  }
};

// Page Détail Commande
const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const commande = code ? getCommandeDetailData(code) : null;
  const stats = code ? getCommandeStats(code) : null;

  if (!commande || !stats) {
    return (
      <>
        <Helmet>
          <title>Commande non trouvée | Woli Delivery</title>
        </Helmet>
        <PageContainer>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Commande non trouvée
            </Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>
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
        <title>{commande.code_commande} | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
          {/* En-tête avec navigation */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <IconButton onClick={() => navigate('/orders')}>
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ReceiptIcon color="primary" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {commande.code_commande}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Passée le {new Date(commande.created_at_commande).toLocaleDateString('fr-FR', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={getStatutLabel(commande.statut_commande)}
                  color={getStatutColor(commande.statut_commande) as any}
                  sx={{ fontWeight: 600 }}
                />
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => console.log('Edit', commande.code_commande)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => console.log('Delete', commande.code_commande)}
                >
                  Supprimer
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* KPI Cards - Statistiques principales */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                  <ReceiptIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Commande</Typography>
                  <Typography variant="h5" fontWeight={700}>{commande.total_commande.toLocaleString('fr-FR')} XOF</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                  <RestaurantIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Articles</Typography>
                  <Typography variant="h5" fontWeight={700}>{stats.lignes.length}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                  <PaymentIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Paiement</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {stats.paiement ? stats.paiement.montant.toLocaleString('fr-FR') : '0'} XOF
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: stats.livraison ? 'info.light' : 'grey.200', color: stats.livraison ? 'info.main' : 'grey.500' }}>
                  <LocalShippingIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Livraison</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {stats.livraison ? stats.livraison.statut : 'Non assignée'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Section Détails principales */}
          <Grid container spacing={3}>
            {/* Client */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Client</Typography>
                </Stack>
                {stats.client ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Nom</Typography>
                      <Typography variant="body1" fontWeight={500}>{stats.client.nom}</Typography>
                    </Box>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Téléphone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>{stats.client.telephone}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    {stats.client.email && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{stats.client.email}</Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucun client</Typography>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Restaurant */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <StoreIcon color="warning" />
                  <Typography variant="h6" fontWeight={600}>Restaurant</Typography>
                </Stack>
                {stats.restaurant ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Nom</Typography>
                      <Typography variant="body1" fontWeight={500}>{stats.restaurant.nom}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Adresse
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>{stats.restaurant.adresse}</Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucun restaurant</Typography>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Paiement */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <PaymentIcon color="success" />
                  <Typography variant="h6" fontWeight={600}>Paiement</Typography>
                </Stack>
                {stats.paiement ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Montant</Typography>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {stats.paiement.montant.toLocaleString('fr-FR')} XOF
                      </Typography>
                    </Box>
                    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                        Méthode
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                        {stats.paiement.methode}
                      </Typography>
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Statut
                        </Typography>
                        <Chip 
                          label={stats.paiement.statut === 'valide' ? 'Validé' : stats.paiement.statut}
                          color={stats.paiement.statut === 'valide' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Stack>
                    </Box>
                    {stats.paiement.reference && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Référence
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{stats.paiement.reference}</Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucun paiement</Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>

          {/* Articles de la commande */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <ReceiptIcon color="info" />
              <Typography variant="h6" fontWeight={600}>Articles de la commande</Typography>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Article</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Quantité</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Prix unitaire</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.lignes.map((ligne) => (
                    <TableRow key={ligne.code} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>{ligne.produit}</Typography>
                        <Typography variant="caption" color="text.secondary">{ligne.code}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={ligne.quantite} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{ligne.prix.toLocaleString('fr-FR')} XOF</TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>{ligne.total.toLocaleString('fr-FR')} XOF</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body1" fontWeight={600}>Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {commande.total_commande.toLocaleString('fr-FR')} XOF
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Livraison et Évaluation */}
          <Grid container spacing={3}>
            {/* Livraison */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <LocalShippingIcon color="info" />
                  <Typography variant="h6" fontWeight={600}>Livraison</Typography>
                </Stack>
                {stats.livraison ? (
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">Code livraison</Typography>
                          <Typography variant="body1" fontWeight={500}>{stats.livraison.code}</Typography>
                        </Box>
                        <Chip 
                          label={stats.livraison.statut === 'livree' ? 'Livrée' : stats.livraison.statut === 'en_cours' ? 'En cours' : 'En attente'}
                          color={stats.livraison.statut === 'livree' ? 'success' : stats.livraison.statut === 'en_cours' ? 'warning' : 'info'}
                          size="small"
                        />
                      </Stack>
                    </Box>
                    {stats.livraison.livreur && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Livreur assigné
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{stats.livraison.livreur}</Typography>
                      </Box>
                    )}
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                            Créée le
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(stats.livraison.created_at).toLocaleDateString('fr-FR', { 
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucune livraison associée</Typography>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Évaluation */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6" fontWeight={600}>Évaluation</Typography>
                </Stack>
                {stats.evaluation ? (
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700} color="success.dark">{stats.evaluation.note}/5</Typography>
                      <Typography variant="body2" color="success.dark">Note restaurant</Typography>
                    </Box>
                    {stats.evaluation.commentaire && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Commentaire
                        </Typography>
                        <Typography variant="body1">{stats.evaluation.commentaire}</Typography>
                      </Box>
                    )}
                    {stats.evaluation.note_livraison && (
                      <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="info.dark">{stats.evaluation.note_livraison}/5</Typography>
                        <Typography variant="body2" color="info.dark">Note livraison</Typography>
                      </Box>
                    )}
                    {stats.evaluation.commentaire_livraison && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Commentaire livraison
                        </Typography>
                        <Typography variant="body1">{stats.evaluation.commentaire_livraison}</Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography color="text.secondary">Aucune évaluation</Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>

          {/* Historique et informations système */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Informations de la commande</Typography>
                <Stack spacing={2}>
                  <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                      Code commande
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>{commande.code_commande}</Typography>
                  </Box>
                  <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                      Statut
                    </Typography>
                    <Box mt={0.5}>
                      <Chip 
                        label={getStatutLabel(commande.statut_commande)}
                        color={getStatutColor(commande.statut_commande) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Créée le
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(commande.created_at_commande).toLocaleDateString('fr-FR', { 
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Mise à jour</Typography>
                <Stack spacing={2}>
                  <Box sx={{ py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          Dernière mise à jour
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(commande.updated_at_commande).toLocaleDateString('fr-FR', { 
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
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
