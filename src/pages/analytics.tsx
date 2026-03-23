import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Card, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

// Page Analytics - Simple placeholder avec KPI
const Page = () => {
  return (
    <>
      <Helmet>
        <title>Analytiques | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>Analytiques</Typography>
              <Typography variant="body2" color="text.secondary">Statistiques et performances</Typography>
            </Box>
            
            {/* KPI Cards */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main' }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Revenus</Typography>
                    <Typography variant="h5" fontWeight={700}>0 XOF</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.main' }}>
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Commandes</Typography>
                    <Typography variant="h5" fontWeight={700}>0</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'info.light', color: 'info.main' }}>
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Clients</Typography>
                    <Typography variant="h5" fontWeight={700}>0</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.main' }}>
                    <DeliveryDiningIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Livraisons</Typography>
                    <Typography variant="h5" fontWeight={700}>0</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Graphiques en cours de développement</Typography>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
export default Page;
