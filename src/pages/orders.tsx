import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
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
import { PageContainer } from 'src/components/page-container';
import { AsyncPage } from 'src/components/AsyncPage';
import { StatusChip } from 'src/components/StatusChip';
import { ordersService, type Order } from 'src/lib/api';
import { useApiList } from 'src/hooks/useApiList';
import { useApiPagination } from 'src/hooks/useApiPagination';

// Filtres de statut
const statutFilters = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Payée', value: 'payee' },
  { label: 'En préparation', value: 'en_preparation' },
  { label: 'Livrée', value: 'livree' },
  { label: 'Annulée', value: 'annulee' },
];

/**
 * Page Commandes - Liste Réelle
 * ===========================================
 * Utilise React Query et l'API réellle.
 */
const Page = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  // Pagination
  // Pagination (page starts at 1, DataGrid logic handles the state)
  const { page, limit, onPageChange, onLimitChange } = useApiPagination(1, 10);

  // Fetching
  const { data: response, isLoading, error, refetch } = useApiList<Order>(
    'commandes',
    (params) => ordersService.getAll(params),
    { page, limit }
  );

  const data = response?.data || [];

  // Filtrage local (optionnel si le backend supporte le filtrage par statut)
  const filteredRows = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    return data.filter((item: Order) => item.statutCommande === filter);
  }, [data, filter]);

  // Actions disponibles
  const actions: ActionOption[] = [
    { label: 'Voir détails', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" color="error" />, action: 'delete', color: 'error' },
  ];

  // Gestion des actions
  const handleActionClick = (row: Record<string, unknown>, action: string) => {
    const code = row.codeCommande as string;
    switch (action) {
      case 'view':
        navigate(`/orders/${code}`);
        break;
      case 'edit':
        console.log('Edit', code);
        break;
      case 'delete':
        if (window.confirm('Voulez-vous vraiment supprimer cette commande ?')) {
          ordersService.delete(code).then(() => refetch());
        }
        break;
    }
  };

  // KPIs calculés sur les données réelles
  const kpis = useMemo(() => {
    if (!data) return { total: 0, delivered: 0, inProgress: 0, revenue: 0 };
    return {
      total: data.length,
      delivered: data.filter((c: Order) => c.statutCommande === 'livree').length,
      inProgress: data.filter((c: Order) => ['payee', 'en_preparation'].includes(c.statutCommande)).length,
      revenue: data.filter((c: Order) => c.statutCommande !== 'annulee').reduce((sum: number, c: Order) => sum + (c.totalCommande || 0), 0)
    };
  }, [data]);

  // Configuration des colonnes
  const columns: ColumnConfig[] = [
    {
      field: 'codeCommande',
      headerName: 'COMMANDE',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'createdAtCommande',
      headerName: 'DATE',
      flex: 1,
      minWidth: 180,
      valueFormatter: (value) => value ? new Date(value as string).toLocaleString('fr-FR') : ''
    },
    {
      field: 'clientCode',
      headerName: 'CLIENT',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.row.clients?.nomClient || params.value
    },
    {
      field: 'statutCommande',
      headerName: 'STATUT',
      width: 140,
      renderCell: (params) => <StatusChip status={params.value as string} />
    },
    {
      field: 'totalCommande',
      headerName: 'TOTAL',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '0 XOF',
    },
  ];

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
              Gestion des commandes clients
            </Typography>
          </Box>

          <AsyncPage isLoading={isLoading} error={error} isEmpty={filteredRows.length === 0} onRetry={() => refetch()}>
            {/* KPI Cards */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="h5" fontWeight={700}>{kpis.total}</Typography>
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
                    <Typography variant="h5" fontWeight={700}>{kpis.delivered}</Typography>
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
                    <Typography variant="h5" fontWeight={700}>{kpis.inProgress}</Typography>
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
                    <Typography variant="h5" fontWeight={700}>{kpis.revenue.toLocaleString()} XOF</Typography>
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

            {/* DataTable */}
            <DataTable
              rows={filteredRows as unknown as Record<string, unknown>[]}
              columns={columns}
              actions={actions}
              onActionClick={handleActionClick}
              rowCount={response?.pagination?.total || 0}
              page={page - 1}
              pageSize={limit}
              onPageChange={(p) => onPageChange(p + 1)}
              onPageSizeChange={onLimitChange}
              loading={isLoading}
            />
          </AsyncPage>
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
