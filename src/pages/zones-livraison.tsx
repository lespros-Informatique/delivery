import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Box, Container, Stack, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { ZoneLivraisonForm } from 'src/components/forms/zone-livraison-form';
import { mockZones, mockVilles } from 'src/data/mock';

const columns: ColumnConfig[] = [
  { field: 'code_zone', headerName: 'CODE', width: 130 },
  { field: 'nom_zone', headerName: 'ZONE', flex: 1, minWidth: 150 },
  { field: 'ville_code', headerName: 'VILLE', width: 130 },
  { 
    field: 'frais_livraison', 
    headerName: 'FRAIS', 
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'delai_minutes', 
    headerName: 'DÉLAI (MIN)', 
    width: 120,
    align: 'center',
    headerAlign: 'center',
  },
];

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  
  const rows = mockZones.map((z) => ({
    ...z,
    statut_zone: z.statut_zone === 1 ? 'active' : 'inactive'
  }));

  const handleOpenModal = () => {
    setSelectedZone(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedZone(null);
  };

  const handleSubmitZone = (data: any) => {
    console.log('Nouvelle zone:', data);
    handleCloseModal();
  };

  return (
    <>
      <Helmet>
        <title>Zones de livraison | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Zones de livraison
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les zones de livraison par ville
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Ajouter une zone
              </Button>
            </Stack>

            {/* Stats par ville */}
            <Grid container spacing={2}>
              {mockVilles.map((ville) => {
                const zoneCount = mockZones.filter(z => z.ville_code === ville.code_ville).length;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ville.id_ville}>
                    <Card sx={{ bgcolor: 'primary.light' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="primary.contrastText" fontWeight={600}>
                              {ville.nom_ville}
                            </Typography>
                            <Typography variant="caption" color="primary.contrastText">
                              {zoneCount} zone{zoneCount !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          <LocalShippingIcon sx={{ color: 'primary.contrastText', fontSize: 32 }} />
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
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_zone',
                mapping: { active: 'success', inactive: 'error' }
              }}
            />

            {/* Modal d'ajout de zone de livraison */}
            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title="Ajouter une zone de livraison"
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    Ajouter
                  </Button>
                </>
              }
            >
              <ZoneLivraisonForm 
                onSubmit={handleSubmitZone}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;