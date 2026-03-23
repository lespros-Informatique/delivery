import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { mockGains } from 'src/data/mock';

const columns: ColumnConfig[] = [
  { field: 'code_gain', headerName: 'CODE', width: 130 },
  { field: 'commande_code', headerName: 'COMMANDE', width: 130 },
  { field: 'restaurant_code', headerName: 'RESTAURANT', width: 130 },
  { 
    field: 'montant_restaurant', 
    headerName: 'RESTO', 
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'montant_delivery', 
    headerName: 'PLATEFORME', 
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
];

const Page = () => {
  const rows = mockGains.map((g) => ({
    ...g,
    statut_gain: g.statut_gain
  }));

  const totalResto = mockGains.reduce((sum, g) => sum + g.montant_restaurant, 0);
  const totalPlatform = mockGains.reduce((sum, g) => sum + g.montant_delivery, 0);
  const totalGeneral = totalResto + totalPlatform;

  return (
    <>
      <Helmet>
        <title>Gains & Commissions | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Gains & Commissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Suivi des revenus et commissions
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Configurer les commissions
              </Button>
            </Stack>

            {/* KPI Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: 'success.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="success.contrastText">Total Gains Restaurateurs</Typography>
                        <Typography variant="h5" fontWeight={700} color="success.contrastText">
                          {totalResto.toLocaleString()} XOF
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PercentIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="primary.contrastText">Total Commissions Platform</Typography>
                        <Typography variant="h5" fontWeight={700} color="primary.contrastText">
                          {totalPlatform.toLocaleString()} XOF
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: 'warning.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="warning.contrastText">Total Général</Typography>
                        <Typography variant="h5" fontWeight={700} color="warning.contrastText">
                          {totalGeneral.toLocaleString()} XOF
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              statusColumn={{
                field: 'statut_gain',
                mapping: { en_attente: 'warning', verse: 'success', annule: 'error' }
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;