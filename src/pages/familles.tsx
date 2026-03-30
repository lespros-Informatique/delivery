import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Box, Container, Stack, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { FamilleForm } from 'src/components/forms/famille-form';
import { mockRestaurants } from 'src/data/mock';

// Données familles basées sur db.sql
const famillesData = [
  { id_famille: 1, code_famille: 'AFRICAIN', libelle_famille: 'Cuisine Africaine', statut_famille: 1 },
  { id_famille: 2, code_famille: 'EUROPEEN', libelle_famille: 'Cuisine Européenne', statut_famille: 1 },
  { id_famille: 3, code_famille: 'ASIE', libelle_famille: 'Cuisine Asiatique', statut_famille: 1 },
];

const columns: ColumnConfig[] = [
  { field: 'code_famille', headerName: 'CODE', width: 130 },
  { field: 'libelle_famille', headerName: 'TYPE DE CUISINE', flex: 1, minWidth: 200 },
  { field: 'restaurant_count', headerName: 'RESTAURANTS', width: 130, align: 'center', headerAlign: 'center' },
];

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFamille, setSelectedFamille] = useState<any>(null);
  
  const rows = famillesData.map((f) => {
    const restaurantCount = mockRestaurants.filter(r => r.famille_code === f.code_famille).length;
    return {
      ...f,
      restaurant_count: restaurantCount,
      statut_famille: f.statut_famille === 1 ? 'active' : 'inactive'
    };
  });

  return (
    <>
      <Helmet>
        <title>Types de cuisine | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Types de cuisine
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les familles de restaurants
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
                Ajouter un type
              </Button>
            </Stack>

            {/* Cartes des types */}
            <Grid container spacing={2}>
              {famillesData.map((famille) => {
                const restaurantCount = mockRestaurants.filter(r => r.famille_code === famille.code_famille).length;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={famille.id_famille}>
                    <Card sx={{ 
                      bgcolor: famille.code_famille === 'AFRICAIN' ? 'warning.light' :
                               famille.code_famille === 'EUROPEEN' ? 'info.light' : 'error.light',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' }
                    }}>
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <RestaurantMenuIcon sx={{ fontSize: 40, color: 'inherit', opacity: 0.7 }} />
                            <Chip label={restaurantCount} size="small" sx={{ bgcolor: 'background.paper' }} />
                          </Stack>
                          <Box>
                            <Typography variant="h6" fontWeight={700} color="inherit">
                              {famille.libelle_famille}
                            </Typography>
                            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                              {restaurantCount} restaurant{restaurantCount !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              statusColumn={{
                field: 'statut_famille',
                mapping: { active: 'success', inactive: 'error' }
              }}
            />

            {/* Modal d'ajout de type de cuisine */}
            <FormModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Ajouter un type de cuisine"
              actions={
                <>
                  <Button onClick={() => setModalOpen(false)} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    Ajouter
                  </Button>
                </>
              }
            >
              <FamilleForm 
                onSubmit={(data) => {
                  console.log('Nouveau type de cuisine:', data);
                  setModalOpen(false);
                }}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;