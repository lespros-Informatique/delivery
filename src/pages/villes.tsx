import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Card, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockVilles } from 'src/data/mock';

// Filtres de statut
const statutFilters: { label: string; value: string | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Actives', value: 'actif' },
  { label: 'Inactives', value: 'inactif' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_ville', 
    headerName: 'CODE', 
    width: 100 
  },
  { 
    field: 'nom_ville', 
    headerName: 'VILLE', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'pays', 
    headerName: 'PAYS', 
    width: 130 
  },
  { 
    field: 'frais_livraison_defaut', 
    headerName: 'FRAIS LIVRAISON', 
    width: 140,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'latitude', 
    headerName: 'LATITUDE', 
    width: 100 
  },
  { 
    field: 'longitude', 
    headerName: 'LONGITUDE', 
    width: 100 
  },
];

// Page Villes - ADMIN (avec bouton ajouter)
const Page = () => {
  const [filter, setFilter] = useState<string | 'all'>('all');
  const navigate = useNavigate();

  // Préparer les données
  const rowsWithStatus = mockVilles.map((v) => ({
    ...v,
    statut_ville: v.statut_ville === 1 ? 'actif' : 'inactif'
  }));

  // Filtrer les villes
  const filteredRows = filter === 'all' 
    ? rowsWithStatus 
    : rowsWithStatus.filter(v => v.statut_ville === filter);

  const actions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view' || action === 'edit') {
      navigate(`/villes/${row.code_ville}`);
    } else if (action === 'delete') {
      console.log('Delete', row.code_ville);
    }
  };

  return (
    <>
      <Helmet>
        <title>Villes | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Villes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les villes de livraison
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Ajouter une ville
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
              statusColumn={{
                field: 'statut_ville',
                mapping: {
                  actif: 'success',
                  inactif: 'error'
                }
              }}
              actions={actions}
              onActionClick={handleActionClick}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
