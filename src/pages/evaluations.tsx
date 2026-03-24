import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Grid, Card, CardContent, Chip, Avatar, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { mockEvaluations, mockCommandes, mockRestaurants } from 'src/data/mock';

const columns: ColumnConfig[] = [
  { field: 'code_evaluation', headerName: 'CODE', width: 130 },
  { field: 'commande_code', headerName: 'COMMANDE', width: 130 },
  { 
    field: 'note', 
    headerName: 'NOTE', 
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <StarIcon sx={{ color: 'star.main', fontSize: 16 }} />
        <Typography variant="body2" fontWeight={600}>{params.value}/5</Typography>
      </Stack>
    )
  },
  { field: 'commentaire', headerName: 'COMMENTAIRE', flex: 1, minWidth: 200 },
];

const Page = () => {
  const rows = mockEvaluations.map((e) => ({
    ...e,
    statut_evaluation: 'publiée'
  }));

  // Calculer les statistiques
  const avgNote = mockEvaluations.reduce((sum, e) => sum + e.note, 0) / mockEvaluations.length || 0;
  const avgNoteLivraison = mockEvaluations.filter(e => e.note_livraison).reduce((sum, e) => sum + (e.note_livraison || 0), 0) / mockEvaluations.filter(e => e.note_livraison).length || 0;
  const totalReviews = mockEvaluations.length;

  return (
    <>
      <Helmet>
        <title>Évaluations | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Évaluations & Avis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notes et commentaires des clients
              </Typography>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: 'warning.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <StarIcon sx={{ fontSize: 40, color: 'warning.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="warning.contrastText">Note Moyenne Restaurant</Typography>
                        <Typography variant="h4" fontWeight={700} color="warning.contrastText">
                          {avgNote.toFixed(1)}/5
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: 'info.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <StarIcon sx={{ fontSize: 40, color: 'info.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="info.contrastText">Note Moyenne Livraison</Typography>
                        <Typography variant="h4" fontWeight={700} color="info.contrastText">
                          {avgNoteLivraison.toFixed(1)}/5
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <RestaurantIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="primary.contrastText">Total Évaluations</Typography>
                        <Typography variant="h4" fontWeight={700} color="primary.contrastText">
                          {totalReviews}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: 'success.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <StarIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="success.contrastText">Note 5 étoiles</Typography>
                        <Typography variant="h4" fontWeight={700} color="success.contrastText">
                          {mockEvaluations.filter(e => e.note === 5).length}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Dernières évaluations */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Dernières évaluations</Typography>
                <Stack spacing={2}>
                  {mockEvaluations.map((evaluation) => {
                    const commande = mockCommandes.find(c => c.code_commande === evaluation.commande_code);
                    const restaurant = commande ? mockRestaurants.find(r => r.code_restaurant === commande.restaurant_code) : null;
                    return (
                      <Box key={evaluation.id_evaluation} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.main' }}>C</Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={600}>Commande {evaluation.commande_code}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Restaurant: {restaurant?.libelle_restaurant || evaluation.restaurant_code}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack alignItems="flex-end" spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <StarIcon sx={{ color: 'star.main', fontSize: 20 }} />
                              <Typography variant="h6" fontWeight={700}>{evaluation.note}/5</Typography>
                            </Stack>
                            {evaluation.note_livraison && (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">Livraison:</Typography>
                                <StarIcon sx={{ color: 'star.main', fontSize: 14 }} />
                                <Typography variant="caption">{evaluation.note_livraison}/5</Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                        {evaluation.commentaire && (
                          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="body2">{evaluation.commentaire}</Typography>
                          </Box>
                        )}
                        {evaluation.commentaire_livraison && (
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">Avis livraison: </Typography>
                            <Typography variant="body2">{evaluation.commentaire_livraison}</Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;