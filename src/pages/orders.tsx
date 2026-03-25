import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Stack, Typography, Chip, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockCommandes } from 'src/data/mock';
import { StatutCommande } from 'src/types';
import { PageContainer } from 'src/components/page-container';

// Filtres de statut
const statutFilters: { label: string; value: StatutCommande | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Payée', value: 'payee' },
  { label: 'En préparation', value: 'en_preparation' },
  { label: 'Livrée', value: 'livree' },
  { label: 'Annulée', value: 'annulee' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_commande', 
    headerName: 'COMMANDE', 
    flex: 1, 
    minWidth: 120,
  },
  { 
    field: 'created_at_commande', 
    headerName: 'DATE', 
    flex: 1, 
    minWidth: 180,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
  { 
    field: 'client_code', 
    headerName: 'CLIENT', 
    flex: 1, 
    minWidth: 120 
  },
  { 
    field: 'statut_commande', 
    headerName: 'STATUT', 
    width: 140,
    align: 'center',
    headerAlign: 'center',
  },
  { 
    field: 'total_commande', 
    headerName: 'TOTAL', 
    flex: 1, 
    minWidth: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
];

// Page Commandes - Liste SIMPLE (sans bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatutCommande | 'all'>('all');

  // Actions disponibles
  const actions: ActionOption[] = [
    { label: 'Voir détails', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" color="error" />, action: 'delete', color: 'error' },
  ];

  // Gestion des actions
  const handleActionClick = (row: Record<string, unknown>, action: string) => {
    const code = row.code_commande as string;
    switch (action) {
      case 'view':
        navigate(`/orders/${code}`);
        break;
      case 'edit':
        console.log('Edit', code);
        break;
      case 'delete':
        console.log('Delete', code);
        break;
    }
  };

  // Filtrer les commandes
  const filteredCommandes = filter === 'all' 
    ? mockCommandes 
    : mockCommandes.filter(c => c.statut_commande === filter);

  const rows = filteredCommandes.map((cmd) => ({
    ...cmd,
    statut_commande: cmd.statut_commande
  }));

  return (
    <>
      <Helmet>
        <title>Commandes | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Commandes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Liste des commandes
              </Typography>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="h5" fontWeight={700}>{mockCommandes.length}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Livrées</Typography>
                    <Typography variant="h5" fontWeight={700}>{mockCommandes.filter(c => c.statut_commande === 'livree').length}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <HourglassEmptyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">En cours</Typography>
                    <Typography variant="h5" fontWeight={700}>{mockCommandes.filter(c => ['payee', 'en_preparation'].includes(c.statut_commande)).length}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Revenus</Typography>
                    <Typography variant="h5" fontWeight={700}>{mockCommandes.filter(c => c.statut_commande !== 'annulee').reduce((sum, c) => sum + c.total_commande, 0).toLocaleString()} XOF</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

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

            {/* DataTable - Liste simple sans bouton ajouter */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              actions={actions}
              onActionClick={handleActionClick}
              statusColumn={{
                field: 'statut_commande',
                mapping: {
                  en_attente: 'default',
                  payee: 'primary',
                  en_preparation: 'warning',
                  livree: 'success',
                  annulee: 'error'
                }
              }}
            />
          </Stack>
        </PageContainer>
    </>
  );
};

export default Page;
