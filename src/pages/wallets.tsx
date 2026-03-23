import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Button, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { mockWalletLivreurs, mockLivreurs } from 'src/data/mock';

const columns: ColumnConfig[] = [
  { 
    field: 'livreur', 
    headerName: 'LIVREUR', 
    flex: 1, 
    minWidth: 200,
    renderCell: (params) => {
      const livreur = mockLivreurs.find(l => l.code_livreur === params.row.livreur_code);
      return livreur ? livreur.nom_livreur : params.row.livreur_code;
    }
  },
  { 
    field: 'solde', 
    headerName: 'SOLDE', 
    width: 140,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'total_retire', 
    headerName: 'RETIRÉ', 
    width: 140,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
];

const Page = () => {
  const rows = mockWalletLivreurs.map((w) => ({
    ...w,
    statut_wallet: w.statut_wallet
  }));

  const totalSolde = mockWalletLivreurs.reduce((sum, w) => sum + w.solde, 0);
  const totalRetire = mockWalletLivreurs.reduce((sum, w) => sum + w.total_retire, 0);

  return (
    <>
      <Helmet>
        <title>Wallets Livreurs | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Wallets Livreurs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestion des portefeuilles et retraits
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Nouveau retrait
              </Button>
            </Stack>

            {/* KPI Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ bgcolor: 'success.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'success.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="success.contrastText">Solde Total Disponible</Typography>
                        <Typography variant="h4" fontWeight={700} color="success.contrastText">
                          {totalSolde.toLocaleString()} XOF
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ bgcolor: 'info.light' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TrendingDownIcon sx={{ fontSize: 40, color: 'info.contrastText' }} />
                      <Box>
                        <Typography variant="caption" color="info.contrastText">Total Retiré</Typography>
                        <Typography variant="h4" fontWeight={700} color="info.contrastText">
                          {totalRetire.toLocaleString()} XOF
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Liste des wallets */}
            <Stack spacing={2}>
              {mockWalletLivreurs.map((wallet) => {
                const livreur = mockLivreurs.find(l => l.code_livreur === wallet.livreur_code);
                return (
                  <Card key={wallet.id_wallet}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {livreur?.nom_livreur?.charAt(0) || 'L'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {livreur?.nom_livreur || wallet.livreur_code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {livreur?.telephone_livreur || 'Aucun téléphone'}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">Solde</Typography>
                            <Typography variant="h6" fontWeight={700} color="success.main">
                              {wallet.solde.toLocaleString()} XOF
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">Retiré</Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {wallet.total_retire.toLocaleString()} XOF
                            </Typography>
                          </Box>
                          <Chip 
                            label={wallet.statut_wallet} 
                            size="small"
                            color={wallet.statut_wallet === 'actif' ? 'success' : 
                                   wallet.statut_wallet === 'bloqué' ? 'error' : 'default'}
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;