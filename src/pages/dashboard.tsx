import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Grid, Avatar, Chip, useTheme, Card, CardContent, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { SvgIcon } from '@mui/material';
import Chart from 'react-apexcharts';
import { useMemo } from 'react';
import { 
  mockCommandes, mockClients, mockLivreurs, mockRestaurants, 
  mockProduits, mockVilles, mockZones, mockEvaluations, mockNotifications, 
  mockPromotions, getTodayCommandesCount
} from 'src/data/mock';
import { useDateRangeFilter } from '../hooks/useDateRangeFilter';
import { isWithinInterval, isValid, startOfDay, endOfDay } from 'date-fns';
import DateRangeFilter from '../components/date-range-filter';

// Composant carte KPI
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const KPICard = ({ title, value, icon, trend, color = 'primary' }: KPICardProps) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: colorValue, width: 48, height: 48 }}>
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
        <Typography variant="h4" fontWeight={700}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>{title}</Typography>
      </CardContent>
    </Card>
  );
};

// Page Dashboard
const Page = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Utiliser le hook de filtre de date
  const { startDate, endDate, dateLabel } = useDateRangeFilter();
  
  // Filtrer les données selon la période
  const filteredData = useMemo(() => {
    // Filtrer les commandes
    const filteredCommandes = mockCommandes.filter(cmd => {
      // Extraire la date du format '2026-03-22 12:30:00'
      const dateStr = cmd.created_at_commande.split(' ')[0];
      const cmdDate = new Date(dateStr + 'T00:00:00');
      
      // Vérifier si la date est valide et dans l'intervalle
      if (!isValid(cmdDate)) return false;
      
      // Comparer avec les dates de début et fin (incluant toute la journée)
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      return isWithinInterval(cmdDate, { start, end });
    });

    // Revenus totaux filtrés
    const totalRevenus = filteredCommandes
      .filter(c => c.statut_commande !== 'annulee')
      .reduce((sum, c) => sum + c.total_commande, 0);

    // Commandes par statut
    const commandesParStatut = {
      livree: filteredCommandes.filter(c => c.statut_commande === 'livree').length,
      en_preparation: filteredCommandes.filter(c => c.statut_commande === 'en_preparation').length,
      payee: filteredCommandes.filter(c => c.statut_commande === 'payee').length,
      en_attente: filteredCommandes.filter(c => c.statut_commande === 'en_attente').length,
      annulee: filteredCommandes.filter(c => c.statut_commande === 'annulee').length,
    };

    // Top restaurants par revenus
    const topRestaurants = mockRestaurants.map(r => {
      const commandes = filteredCommandes.filter(c => c.restaurant_code === r.code_restaurant);
      const revenus = commandes.reduce((sum, c) => sum + c.total_commande, 0);
      return { ...r, revenus, commandes: commandes.length };
    }).sort((a, b) => b.revenus - a.revenus).slice(0, 5);

    // Top produits
    const topProduits = mockProduits.slice(0, 5);

    // Villes actives
    const topVilles = mockVilles.slice(0, 4);

    // Promotions actives
    const promotionsActives = mockPromotions.filter(p => p.statut_promotion === 'active');

    // Évaluations
    const lastEvaluations = mockEvaluations.slice(0, 3);

    return {
      filteredCommandes,
      totalRevenus,
      totalCommandes: filteredCommandes.length,
      commandesParStatut,
      topRestaurants,
      topProduits,
      topVilles,
      promotionsActives,
      lastEvaluations
    };
  }, [startDate, endDate]);

  // Statistiques du jour (toujours aujourd'hui)
  const todayCommandes = getTodayCommandesCount();
  const todayRevenue = mockCommandes
    .filter(c => c.created_at_commande.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum: number, c: typeof mockCommandes[number]) => sum + c.total_commande, 0);

  // Statistiques de base (totaux globaux)
  const totalClients = mockClients.length;
  const totalLivreurs = mockLivreurs.length;
  const totalRestaurants = mockRestaurants.length;
  const totalProduits = mockProduits.length;
  const totalVilles = mockVilles.length;
  const unreadNotifications = mockNotifications.filter(n => n.lu === 0);

  // Graphique aires - Revenus filtrés
  const areaChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 280, toolbar: { show: false }, fontFamily: 'IBM Plex Sans, sans-serif' },
    colors: [theme.palette.success.main, theme.palette.info.main],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] } },
    xaxis: { categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], labels: { style: { colors: theme.palette.text.secondary } } },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary }, formatter: (value: number) => value.toLocaleString() + ' XOF' } },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: theme.palette.text.secondary } },
    tooltip: { theme: 'dark' }
  };

  const areaChartSeries = [
    { name: 'Revenus', data: [45000, 52000, 48000, 61000, 55000, 67000, 72000] },
    { name: 'Commandes', data: [12, 15, 14, 18, 16, 21, 24] }
  ];

  // Graphique barres - Revenus par jour
  const barChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'IBM Plex Sans, sans-serif' },
    colors: [theme.palette.primary.main],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], labels: { style: { colors: theme.palette.text.secondary } } },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary }, formatter: (value: number) => value.toLocaleString() } },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    tooltip: { theme: 'dark' }
  };

  const barChartSeries = [{ name: 'Revenus', data: [45000, 52000, 48000, 61000, 55000, 67000, 72000] }];

  // Graphique donut - Commandes par statut
  const donutChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', height: 280 },
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.primary.main, theme.palette.error.main],
    labels: ['Livrées', 'En préparation', 'Payée', 'En attente', 'Annulée'],
    legend: { position: 'bottom', labels: { colors: theme.palette.text.secondary } },
    plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', color: theme.palette.text.secondary } } } } },
    dataLabels: { enabled: false }
  };

  const donutChartSeries = [
    filteredData.commandesParStatut.livree, 
    filteredData.commandesParStatut.en_preparation, 
    filteredData.commandesParStatut.payee, 
    filteredData.commandesParStatut.en_attente, 
    filteredData.commandesParStatut.annulee
  ];

  return (
    <>
      <Helmet><title>Dashboard | Woli Delivery</title></Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Vue d'ensemble de votre activité - {dateLabel}</Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <DateRangeFilter />
                <Button 
                  variant="outlined" 
                  startIcon={<AnalyticsIcon />} 
                  onClick={() => navigate('/analytics')}
                >
                  Voir analytiques
                </Button>
              </Stack>
            </Stack>

            {/* Cartes KPI - Row 1 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Commandes aujourd'hui" value={todayCommandes} icon={<ShoppingBagIcon />} color="primary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Revenus aujourd'hui" value={`${todayRevenue.toLocaleString()} XOF`} icon={<AttachMoneyIcon />} color="success" trend="+12%" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title={`Commandes (${dateLabel})`} value={filteredData.totalCommandes} icon={<ShoppingCartIcon />} color="warning" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Livreurs actifs" value={totalLivreurs} icon={<LocalShippingIcon />} color="error" />
              </Grid>
            </Grid>

            {/* Cartes KPI - Row 2 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Total clients" value={totalClients} icon={<PeopleIcon />} color="info" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Restaurants" value={totalRestaurants} icon={<RestaurantIcon />} color="primary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Produits" value={totalProduits} icon={<FastfoodIcon />} color="warning" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Villes" value={totalVilles} icon={<LocationCityIcon />} color="success" />
              </Grid>
            </Grid>

            {/* Graphiques - Row 1 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Performances hebdomadaire ({dateLabel})</Typography>
                    <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={280} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Commandes par statut ({dateLabel})</Typography>
                    <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={280} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Graphiques - Row 2 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Revenus par jour ({dateLabel})</Typography>
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" height={280} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>Top Restaurants ({dateLabel})</Typography>
                      <Chip label={filteredData.topRestaurants.length} size="small" color="primary" />
                    </Stack>
                    <Stack spacing={2}>
                      {filteredData.topRestaurants.map((resto, idx) => (
                        <Stack key={resto.code_restaurant} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 36, height: 36 }}>{idx + 1}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>{resto.libelle_restaurant}</Typography>
                              <Typography variant="caption" color="text.secondary">{resto.commandes} commandes</Typography>
                            </Box>
                          </Stack>
                          <Chip label={`${resto.revenus.toLocaleString()} XOF`} size="small" color="success" variant="outlined" />
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Section Row 3 */}
            <Grid container spacing={3}>
              {/* Top Produits */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>Top Produits</Typography>
                      <FastfoodIcon color="primary" />
                    </Stack>
                    <Stack spacing={2}>
                      {filteredData.topProduits.map((produit, idx) => (
                        <Stack key={produit.code_produit} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" fontWeight={600}>{idx + 1}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 150 }}>{produit.libelle_produit}</Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight={600} color="primary.main">{produit.prix_produit.toLocaleString()} XOF</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Dernières évaluations */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>Dernières évaluations</Typography>
                      <StarIcon color="warning" />
                    </Stack>
                    <Stack spacing={2}>
                      {filteredData.lastEvaluations.map((eval_) => (
                        <Box key={eval_.code_evaluation} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <StarIcon sx={{ color: 'star.main', fontSize: 16 }} />
                              <Typography variant="subtitle2" fontWeight={600}>{eval_.note}/5</Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">{new Date(eval_.created_at_evaluation).toLocaleDateString('fr-FR')}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" noWrap>{eval_.commentaire}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Notifications & Promos */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={3}>
                  {/* Notifications non lues */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                          {unreadNotifications.length > 0 && <Chip label={unreadNotifications.length} size="small" color="error" />}
                        </Stack>
                        <NotificationsIcon color="primary" />
                      </Stack>
                      <Stack spacing={1.5}>
                        {unreadNotifications.slice(0, 3).map((notif) => (
                          <Box key={notif.code_notification} sx={{ p: 1.5, bgcolor: 'error.light', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'error.main' } }}>
                            <Typography variant="subtitle2" fontWeight={600} color="error.primary">{notif.titre}</Typography>
                            <Typography variant="caption" color="error.secondary" sx={{ opacity: 0.8 }}>{notif.message}</Typography>
                          </Box>
                        ))}
                        {unreadNotifications.length === 0 && (
                          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>Aucune notification</Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Promotions actives */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6" fontWeight={600}>Promotions</Typography>
                          <Chip label={filteredData.promotionsActives.length} size="small" color="warning" />
                        </Stack>
                        <LocalOfferIcon color="warning" />
                      </Stack>
                      <Stack spacing={1.5}>
                        {filteredData.promotionsActives.map((promo) => (
                          <Box key={promo.code_promotion} sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" fontWeight={600} color="warning.dark">{promo.code_reduction}</Typography>
                              <Typography variant="body2" fontWeight={600} color="warning.dark">
                                {promo.type_promotion === 'pourcentage' ? `-${promo.valeur}%` : `-${promo.valeur} XOF`}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" color="warning.dark" sx={{ opacity: 0.8 }}>Valide jusqu'au {new Date(promo.date_fin).toLocaleDateString('fr-FR')}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            {/* Section Row 4 - Villes actives */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6" fontWeight={600}>Villes les plus actives</Typography>
                    <Chip label={filteredData.topVilles.length} size="small" color="primary" />
                  </Stack>
                  <LocationCityIcon color="primary" />
                </Stack>
                <Grid container spacing={2}>
                  {filteredData.topVilles.map((ville) => {
                    const zoneCount = mockZones.filter(z => z.ville_code === ville.code_ville).length;
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ville.code_ville}>
                        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight={700} color="primary.dark">{ville.nom_ville}</Typography>
                          <Stack direction="row" justifyContent="center" spacing={2} mt={1}>
                            <Box>
                              <Typography variant="h5" fontWeight={700} color="primary.dark">{zoneCount}</Typography>
                              <Typography variant="caption" color="primary.contrastText">zones</Typography>
                            </Box>
                            <Box>
                              <Typography variant="h5" fontWeight={700} color="primary.dark">{ville.frais_livraison_defaut}</Typography>
                              <Typography variant="caption" color="primary.contrastText">XOF livraison</Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>

          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
