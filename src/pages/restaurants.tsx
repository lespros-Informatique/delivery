import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Card, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockRestaurants } from 'src/data/mock';

// Options d'actions
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Filtres de statut
const statutFilters: { label: string; value: string | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Actifs', value: 'actif' },
  { label: 'Inactifs', value: 'inactif' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_restaurant', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'libelle_restaurant', 
    headerName: 'RESTAURANT', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'adresse_restaurant', 
    headerName: 'ADRESSE', 
    flex: 1, 
    minWidth: 180 
  },
  { 
    field: 'ville_code', 
    headerName: 'VILLE', 
    width: 120 
  },
  { 
    field: 'famille_code', 
    headerName: 'TYPE', 
    width: 100 
  },
];

// Page Restaurants - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | 'all'>('all');

  // Préparer les données
  const rowsWithStatus = mockRestaurants.map((r) => ({
    ...r,
    etat_restaurant: r.etat_restaurant === 1 ? 'actif' : 'inactif'
  }));

  // Filtrer les restaurants
  const filteredRows = filter === 'all' 
    ? rowsWithStatus 
    : rowsWithStatus.filter(r => r.etat_restaurant === filter);

  return (
    <>
      <Helmet>
        <title>Restaurants | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Restaurants
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les restaurants
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Ajouter un restaurant
              </Button>
            </Stack>

            {/* Filtres */}
            <Card sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {statutFilters.map((statut) => (
                  <Chip
                    key={statut.value}
                    label={statut.label}
                    onClick={() => setFilter(statut.value)}
                    color={filter === statut.value ? 'primary' : 'default'}
                    variant={filter === statut.value ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Card>

            {/* DataTable - ADMIN */}
            <DataTable
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              actions={actionOptions}
              onActionClick={(row, action) => {
                if (action === 'view') {
                  navigate(`/restaurants/${row.code_restaurant}`);
                } else {
                  console.log(action, row);
                }
              }}
              statusColumn={{
                field: 'etat_restaurant',
                mapping: {
                  actif: 'success',
                  inactif: 'error'
                }
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
