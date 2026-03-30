import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Stack, Typography, Button, Grid, Card, CardContent, 
  Chip, Divider, IconButton, Breadcrumbs, Link 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { mockVilles, mockZones } from 'src/data/mock';

const Page = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const ville = mockVilles.find(v => v.code_ville === code);
  
  if (!ville) {
    return (
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h5">Ville non trouvée</Typography>
          <Button onClick={() => navigate('/villes')} sx={{ mt: 2 }}>
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }

  const zones = mockZones.filter(z => z.ville_code === ville.code_ville);
  const statut = ville.statut_ville === 1 ? 'Active' : 'Inactive';

  return (
    <>
      <Helmet>
        <title>{ville.nom_ville} | Woli Delivery</title>
      </Helmet>
      
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Accueil
                </Link>
                <Link component="button" variant="body2" onClick={() => navigate('/villes')} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                  Villes
                </Link>
                <Typography variant="body2" color="text.primary">{ville.code_ville}</Typography>
              </Breadcrumbs>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={() => navigate('/villes')}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    {ville.nom_ville}
                  </Typography>
                  <Chip label={statut} color={ville.statut_ville === 1 ? 'success' : 'error'} size="small" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />}>Modifier</Button>
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Supprimer</Button>
                </Stack>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom>Informations de la ville</Typography>
                        <Divider />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">CODE VILLE</Typography>
                            <Typography variant="body1" fontWeight={600}>{ville.code_ville}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">PAYS</Typography>
                            <Typography variant="body1" fontWeight={600}>{ville.pays}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">LATITUDE</Typography>
                            <Typography variant="body1" fontWeight={600}>{ville.latitude || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">LONGITUDE</Typography>
                            <Typography variant="body1" fontWeight={600}>{ville.longitude || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="primary.contrastText">FRAIS DE LIVRAISON PAR DÉFAUT</Typography>
                            <Typography variant="h4" color="primary.contrastText" fontWeight={700}>
                              {Number(ville.frais_livraison_defaut).toLocaleString()} XOF
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip label={statut} color={ville.statut_ville === 1 ? 'success' : 'error'} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalShippingIcon /> Zones de livraison ({zones.length})
                      </Stack>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1}>
                      {zones.map((zone) => (
                        <Box 
                          key={zone.id_zone}
                          sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{zone.nom_zone}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Délai: {zone.delai_minutes} min
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {zone.frais_livraison.toLocaleString()} XOF
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                      {zones.length === 0 && (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Aucune zone définie
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;