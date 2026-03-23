import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Grid, Avatar, Chip, useTheme } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { SvgIcon } from '@mui/material';
import Chart from 'react-apexcharts';
import { mockCommandes, mockAnalytics, mockClients, mockLivreurs, getTodayCommandesCount, calculateTotalRevenus } from 'src/data/mock';

// Composant carte KPI
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const KPICard = ({ title, value, icon, trend, color = 'primary' }: KPICardProps) => {
  const theme = useTheme();
  // Utilise les couleurs du theme
  const colorValue = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Avatar
          sx={{
            bgcolor: colorValue,
            width: 56,
            height: 56
          }}
        >
          <SvgIcon sx={{ color: 'white' }}>{icon}</SvgIcon>
        </Avatar>
        {trend && (
          <Chip 
            icon={<TrendingUpIcon fontSize="small" />} 
            label={trend} 
            color="success" 
            size="small" 
            variant="filled"
          />
        )}
      </Stack>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {title}
      </Typography>
    </Box>
  );
};

// Configuration du graphique
const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false
    },
    fontFamily: 'IBM Plex Sans, sans-serif'
  },
  colors: ['#4caf50', '#2196f3'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 100]
    }
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    labels: {
      style: {
        colors: '#9ca3af'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#9ca3af'
      },
      formatter: (value: number) => value.toLocaleString() + ' XOF'
    }
  },
  grid: {
    borderColor: '#374151',
    strokeDashArray: 4
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: '#9ca3af'
    }
  },
  tooltip: {
    theme: 'dark'
  }
};

const chartSeries = [
  {
    name: 'Revenus',
    data: [45000, 52000, 48000, 61000, 55000, 67000, 72000]
  },
  {
    name: 'Commandes',
    data: [12, 15, 14, 18, 16, 21, 24]
  }
];

// Page Dashboard
const Page = () => {
  const todayCommandes = getTodayCommandesCount();
  const totalRevenus = calculateTotalRevenus();
  const totalCommandes = mockCommandes.length;
  const totalClients = mockClients.length;
  const totalLivreurs = mockLivreurs.length;

  // Statistiques du jour
  const todayRevenue = mockAnalytics
    .filter(a => a.type_analytics === 'revenus')
    .reduce((sum, a) => sum + a.montant, 0);

  return (
    <>
      <Helmet>
        <title>Dashboard | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <div>
              <Typography variant="h4" fontWeight={700}>
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                Vue d'ensemble de votre activité
              </Typography>
            </div>

            {/* Cartes KPI */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard
                  title="Commandes aujourd'hui"
                  value={todayCommandes}
                  icon={<ShoppingBagIcon />}
                  color="primary"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard
                  title="Revenus aujourd'hui"
                  value={`${todayRevenue.toLocaleString()} XOF`}
                  icon={<AttachMoneyIcon />}
                  color="success"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard
                  title="Total commandes"
                  value={totalCommandes}
                  icon={<ShoppingCartIcon />}
                  color="warning"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard
                  title="Livreurs actifs"
                  value={totalLivreurs}
                  icon={<LocalShippingIcon />}
                  color="error"
                />
              </Grid>
            </Grid>

            {/* Graphique */}
            <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Performances hebdomadaire
              </Typography>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={300}
              />
            </Box>

            {/* Section Clients et activité */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Activité récente
                  </Typography>
                  <Stack spacing={2}>
                    {mockCommandes.slice(0, 5).map((commande) => (
                      <Box
                        key={commande.id_commande}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'grey.50',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Stack>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {commande.code_commande}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(commande.created_at_commande).toLocaleString('fr-FR')}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            {commande.total_commande.toLocaleString()} XOF
                          </Typography>
                          <Chip
                            label={commande.statut_commande}
                            size="small"
                            color={
                              commande.statut_commande === 'livree' ? 'success' :
                              commande.statut_commande === 'en_preparation' ? 'warning' :
                              commande.statut_commande === 'annulee' ? 'error' : 'default'
                            }
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Clients fidèles
                  </Typography>
                  <Stack spacing={2}>
                    {mockClients.slice(0, 4).map((client) => (
                      <Box
                        key={client.id_client}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {client.nom_client.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2">
                            {client.nom_client}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {client.telephone_client}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
