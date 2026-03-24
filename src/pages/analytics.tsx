import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Card, CardContent, Grid, Avatar, Chip, useTheme, Button, ButtonGroup, Popover, TextField, InputAdornment } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { SvgIcon } from '@mui/material';
import Chart from 'react-apexcharts';
import { useState, useMemo } from 'react';
import { 
  mockCommandes, mockClients, mockLivreurs, mockRestaurants, 
  mockProduits, mockVilles, mockZones, mockEvaluations, mockPromotions,
  mockLivraisons 
} from 'src/data/mock';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, format,
  isWithinInterval, isValid, startOfDay, endOfDay
} from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant carte KPI avec trend
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const KPICard = ({ title, value, icon, trend, trendUp = true, color = 'primary' }: KPICardProps) => {
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
              icon={trendUp ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />} 
              label={trend} 
              color={trendUp ? "success" : "error"} 
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

// Page Analytics complète avec filtrage
const Page = () => {
  const theme = useTheme();
  
  // État pour le filtre de date
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Calculer les dates de début et fin selon le filtre
  const { startDate, endDate, dateLabel } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;
    let label: string;

    switch (dateRange) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        label = `Semaine du ${format(start, 'dd MMM', { locale: fr })}`;
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMMM yyyy', { locale: fr });
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        label = format(now, 'yyyy', { locale: fr });
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          start = new Date(customStartDate + 'T00:00:00');
          end = new Date(customEndDate + 'T00:00:00');
          if (!isValid(start)) start = startOfMonth(now);
          if (!isValid(end)) end = endOfMonth(now);
          label = `${format(start, 'dd MMM yyyy', { locale: fr })} - ${format(end, 'dd MMM yyyy', { locale: fr })}`;
        } else {
          start = startOfMonth(now);
          end = endOfMonth(now);
          label = format(now, 'MMMM yyyy', { locale: fr });
        }
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMMM yyyy', { locale: fr });
    }

    return { startDate: start, endDate: end, dateLabel: label };
  }, [dateRange, customStartDate, customEndDate]);

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

    // Top restaurants par revenus dans la période
    const topRestaurants = mockRestaurants.map(r => {
      const commandes = filteredCommandes.filter(c => c.restaurant_code === r.code_restaurant);
      const revenus = commandes.reduce((sum, c) => sum + c.total_commande, 0);
      return { ...r, revenus, commandes: commandes.length };
    }).sort((a, b) => b.revenus - a.revenus).slice(0, 5);

    // Top livreurs par livraisons
    const topLivreurs = mockLivreurs.map(l => {
      const livreurLivraisons = mockLivraisons.filter(liv => 
        liv.livreur_code === l.code_livreur && 
        filteredCommandes.some(cmd => cmd.code_commande === liv.commande_code)
      );
      return { ...l, livraisons: livreurLivraisons.length };
    }).sort((a, b) => b.livraisons - a.livraisons).slice(0, 5);

    // Revenus par ville
    const revenusParVille = mockVilles.map(v => {
      const restaurants = mockRestaurants.filter(r => r.ville_code === v.code_ville);
      const restaurantCodes = restaurants.map(r => r.code_restaurant);
      const commandes = filteredCommandes.filter(c => restaurantCodes.includes(c.restaurant_code));
      const revenus = commandes.reduce((sum, c) => sum + c.total_commande, 0);
      return { ...v, revenus };
    }).sort((a, b) => b.revenus - a.revenus);

    // Evaluations dans la période
    const evaluations = mockEvaluations.filter(eval_ => {
      const dateStr = eval_.created_at_evaluation.split(' ')[0];
      const evalDate = new Date(dateStr + 'T00:00:00');
      if (!isValid(evalDate)) return false;
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      return isWithinInterval(evalDate, { start, end });
    });

    const moyenneEvaluations = evaluations.length > 0 
      ? (evaluations.reduce((sum, e) => sum + e.note, 0) / evaluations.length).toFixed(1)
      : '0';

    // Promotions actives dans la période
    const promotionsActives = mockPromotions.filter(p => {
      const debutStr = p.date_debut.split(' ')[0];
      const finStr = p.date_fin.split(' ')[0];
      const debut = new Date(debutStr + 'T00:00:00');
      const fin = new Date(finStr + 'T00:00:00');
      if (!isValid(debut) || !isValid(fin)) return false;
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      return p.statut_promotion === 'active' && 
        (isWithinInterval(debut, { start, end }) || 
         isWithinInterval(fin, { start, end }) ||
         (debut <= start && fin >= end));
    });

    return {
      filteredCommandes,
      totalRevenus,
      totalCommandes: filteredCommandes.length,
      commandesParStatut,
      topRestaurants,
      topLivreurs,
      revenusParVille,
      evaluations,
      moyenneEvaluations,
      promotionsActives: promotionsActives.length
    };
  }, [startDate, endDate]);

  // Données pour les graphiques - générer des données basées sur la période
  const chartData = useMemo(() => {
    const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Revenus par jour simulé pour la période
    const revenusParJour: number[] = [];
    const commandesParJour: number[] = [];
    const labels: string[] = [];
    
    if (daysInRange <= 31) {
      // Journalier
      for (let d = 0; d <= daysInRange; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + d);
        labels.push(format(currentDate, 'dd MMM', { locale: fr }));
        // Simuler des données
        revenusParJour.push(Math.floor(Math.random() * 50000) + 20000);
        commandesParJour.push(Math.floor(Math.random() * 15) + 5);
      }
    } else if (daysInRange <= 365) {
      // Mensuel
      const monthsCount = Math.min(Math.floor(daysInRange / 30), 12);
      for (let m = 0; m < monthsCount; m++) {
        const currentDate = new Date(startDate);
        currentDate.setMonth(currentDate.getMonth() + m);
        labels.push(format(currentDate, 'MMM yyyy', { locale: fr }));
        revenusParJour.push(Math.floor(Math.random() * 500000) + 100000);
        commandesParJour.push(Math.floor(Math.random() * 200) + 50);
      }
    } else {
      // Annuel
      for (let y = 0; y < Math.min(Math.floor(daysInRange / 365), 5); y++) {
        const currentDate = new Date(startDate);
        currentDate.setFullYear(currentDate.getFullYear() + y);
        labels.push(format(currentDate, 'yyyy', { locale: fr }));
        revenusParJour.push(Math.floor(Math.random() * 5000000) + 1000000);
        commandesParJour.push(Math.floor(Math.random() * 2000) + 500);
      }
    }

    return { labels, revenusParJour, commandesParJour, daysInRange };
  }, [startDate, endDate]);

  // Handlers
  const handleDateRangeChange = (range: 'week' | 'month' | 'year' | 'custom') => {
    setDateRange(range);
    setAnchorEl(null);
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
    }
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Statistiques de base
  const totalClients = mockClients.length;
  const totalLivreurs = mockLivreurs.length;
  const totalRestaurants = mockRestaurants.length;
  const totalProduits = mockProduits.length;
  const totalVilles = mockVilles.length;
  const totalZones = mockZones.length;
  
  // Revenus du jour (toujours aujourd'hui)
  const todayRevenue = mockCommandes
    .filter(c => c.created_at_commande.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum: number, c: typeof mockCommandes[number]) => sum + c.total_commande, 0);

  // Commandes aujourd'hui
  const todayCommandes = mockCommandes
    .filter(c => c.created_at_commande.startsWith(new Date().toISOString().split('T')[0])).length;

  // Graphique aires - Revenus
  const areaChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 320, toolbar: { show: false }, fontFamily: 'IBM Plex Sans, sans-serif', zoom: { enabled: false } },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] } },
    xaxis: { categories: chartData.labels, labels: { style: { colors: theme.palette.text.secondary } } },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary }, formatter: (value: number) => value.toLocaleString() + ' XOF' } },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: theme.palette.text.secondary } },
    tooltip: { theme: 'dark', y: { formatter: (val: number) => val.toLocaleString() + ' XOF' } }
  };

  const areaChartSeries = [
    { name: 'Revenus', data: chartData.revenusParJour },
    { name: 'Objectif', data: chartData.revenusParJour.map(() => Math.max(...chartData.revenusParJour) * 0.9) }
  ];

  // Graphique lignes - Commandes
  const lineChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', height: 320, toolbar: { show: false }, fontFamily: 'IBM Plex Sans, sans-serif' },
    colors: [theme.palette.info.main, theme.palette.warning.main],
    dataLabels: { enabled: true, style: { colors: [theme.palette.background.paper] } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: chartData.labels, labels: { style: { colors: theme.palette.text.secondary } } },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: theme.palette.text.secondary } },
    markers: { size: 5, strokeWidth: 2, hover: { size: 7 } },
    tooltip: { theme: 'dark' }
  };

  const lineChartSeries = [
    { name: 'Commandes', data: chartData.commandesParJour },
    { name: 'Livraisons', data: chartData.commandesParJour.map(n => Math.floor(n * 0.85)) }
  ];

  // Graphique donut
  const donutChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', height: 300 },
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.primary.main, theme.palette.error.main],
    labels: ['Livrées', 'En préparation', 'Payée', 'En attente', 'Annulées'],
    legend: { position: 'bottom' as const, labels: { colors: theme.palette.text.secondary } },
    plotOptions: { 
      pie: { 
        donut: { 
          size: '65%', 
          labels: { 
            show: true, 
            total: { 
              show: true, 
              label: 'Total', 
              color: theme.palette.text.secondary,
              formatter: () => filteredData.totalCommandes.toString()
            } 
          } 
        } 
      } 
    },
    dataLabels: { enabled: false }
  };

  const donutChartSeries = [
    filteredData.commandesParStatut.livree, 
    filteredData.commandesParStatut.en_preparation, 
    filteredData.commandesParStatut.payee, 
    filteredData.commandesParStatut.en_attente, 
    filteredData.commandesParStatut.annulee
  ];

  // Graphique barres
  const barChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', height: 320, toolbar: { show: false }, fontFamily: 'IBM Plex Sans, sans-serif' },
    colors: [theme.palette.primary.main],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%', horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: { labels: { style: { colors: theme.palette.text.secondary }, formatter: (val: string | number) => Number(val).toLocaleString() + ' XOF' } },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    tooltip: { theme: 'dark', y: { formatter: (val: number) => val.toLocaleString() + ' XOF' } }
  };

  const barChartSeries = [{ 
    name: 'Revenus', 
    data: filteredData.revenusParVille.slice(0, 6).map(v => ({ x: v.nom_ville, y: v.revenus }))
  }];

  // Graphique radar
  const radarChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'radar', height: 300, toolbar: { show: false } },
    colors: [theme.palette.primary.main],
    xaxis: { categories: ['Commandes', 'Revenus', 'Clients', 'Livreurs', 'Restaurants', 'Produits'], labels: { style: { colors: theme.palette.text.secondary } } },
    yaxis: { show: false },
    legend: { position: 'bottom' as const, labels: { colors: theme.palette.text.secondary } },
    tooltip: { theme: 'dark' }
  };

  const radarChartSeries = [{
    name: 'Performance',
    data: [
      Math.min(filteredData.totalCommandes / 30, 100),
      Math.min(filteredData.totalRevenus / 30000000 * 100, 100),
      Math.min(totalClients / 500 * 100, 100),
      Math.min(totalLivreurs / 50 * 100, 100),
      Math.min(totalRestaurants / 100 * 100, 100),
      Math.min(totalProduits / 200 * 100, 100)
    ]
  }];

  return (
    <>
      <Helmet>
        <title>Analytiques | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" fontWeight={700}>Analytiques</Typography>
                <Typography variant="body2" color="text.secondary">Statistiques et performances détaillées</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <ButtonGroup variant="outlined" size="small">
                  <Button 
                    variant={dateRange === 'week' ? 'contained' : 'outlined'} 
                    onClick={() => handleDateRangeChange('week')}
                  >
                    Semaine
                  </Button>
                  <Button 
                    variant={dateRange === 'month' ? 'contained' : 'outlined'} 
                    onClick={() => handleDateRangeChange('month')}
                  >
                    Mois
                  </Button>
                  <Button 
                    variant={dateRange === 'year' ? 'contained' : 'outlined'} 
                    onClick={() => handleDateRangeChange('year')}
                  >
                    Année
                  </Button>
                </ButtonGroup>
                <Button 
                  variant="outlined" 
                  startIcon={<CalendarTodayIcon />}
                  onClick={handleClick}
                >
                  {dateLabel}
                </Button>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <Box sx={{ p: 2, width: 280 }}>
                    <Typography variant="subtitle2" gutterBottom>Date personnalisée</Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Date de début"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <TextField
                        label="Date de fin"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <Button variant="contained" onClick={handleCustomDateApply} fullWidth>
                        Appliquer
                      </Button>
                    </Stack>
                  </Box>
                </Popover>
              </Stack>
            </Stack>
            
            {/* KPI Cards - Row 1 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Revenus totaux" value={`${filteredData.totalRevenus.toLocaleString()} XOF`} icon={<AttachMoneyIcon />} trend="+18%" trendUp={true} color="success" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Total commandes" value={filteredData.totalCommandes} icon={<ShoppingCartIcon />} trend="+12%" trendUp={true} color="primary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Revenus aujourd'hui" value={`${todayRevenue.toLocaleString()} XOF`} icon={<AttachMoneyIcon />} color="warning" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Commandes aujourd'hui" value={todayCommandes} icon={<ShoppingCartIcon />} trend="+5%" trendUp={true} color="info" />
              </Grid>
            </Grid>

            {/* KPI Cards - Row 2 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Total clients" value={totalClients} icon={<PeopleIcon />} trend="+8%" trendUp={true} color="info" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Livreurs actifs" value={totalLivreurs} icon={<DeliveryDiningIcon />} color="error" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Restaurants" value={totalRestaurants} icon={<RestaurantIcon />} color="primary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Produits" value={totalProduits} icon={<FastfoodIcon />} color="warning" />
              </Grid>
            </Grid>

            {/* KPI Cards - Row 3 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Villes" value={totalVilles} icon={<TrendingUpIcon />} color="success" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Zones de livraison" value={totalZones} icon={<DeliveryDiningIcon />} color="info" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Note moyenne" value={`${filteredData.moyenneEvaluations}/5`} icon={<StarIcon />} color="warning" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KPICard title="Promotions actives" value={filteredData.promotionsActives} icon={<LocalOfferIcon />} color="error" />
              </Grid>
            </Grid>

            {/* Graphiques - Row 1 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Revenus</Typography>
                    <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={320} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Commandes par statut</Typography>
                    <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={300} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Graphiques - Row 2 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Commandes vs Livraisons</Typography>
                    <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={320} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Revenus par ville</Typography>
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" height={320} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Graphiques - Row 3 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Top Restaurants</Typography>
                    <Stack spacing={2}>
                      {filteredData.topRestaurants.map((resto, idx) => (
                        <Stack key={resto.code_restaurant} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 32, height: 32 }}>{idx + 1}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>{resto.libelle_restaurant}</Typography>
                              <Typography variant="caption" color="text.secondary">{resto.commandes} commandes</Typography>
                            </Box>
                          </Stack>
                          <Typography variant="subtitle2" fontWeight={700} color="success.main">{resto.revenus.toLocaleString()} XOF</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Top Livreurs</Typography>
                    <Stack spacing={2}>
                      {filteredData.topLivreurs.map((livreur) => (
                        <Stack key={livreur.code_livreur} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 32, height: 32 }}>
                              {livreur.nom_livreur.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>{livreur.nom_livreur}</Typography>
                              <Typography variant="caption" color="text.secondary">{livreur.telephone_livreur}</Typography>
                            </Box>
                          </Stack>
                          <Chip label={`${livreur.livraisons} liv`} size="small" color="success" variant="outlined" />
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Performance Overview */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Indicateurs de performance</Typography>
                    <Chart options={radarChartOptions} series={radarChartSeries} type="radar" height={300} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Statistiques détaillées</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="success.main">
                            {filteredData.totalCommandes > 0 ? ((filteredData.commandesParStatut.livree / filteredData.totalCommandes) * 100).toFixed(1) : 0}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">Taux de livraison</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="warning.main">
                            {filteredData.totalCommandes > 0 ? ((filteredData.commandesParStatut.annulee / filteredData.totalCommandes) * 100).toFixed(1) : 0}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">Taux d'annulation</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="info.main">
                            {filteredData.totalCommandes > 0 ? (filteredData.totalRevenus / filteredData.totalCommandes).toLocaleString() : 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">Panier moyen (XOF)</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="primary.main">{filteredData.promotionsActives}</Typography>
                          <Typography variant="body2" color="text.secondary">Promotions actives</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="error.main">{filteredData.evaluations.filter(e => e.note >= 4).length}</Typography>
                          <Typography variant="body2" color="text.secondary">Évaluations positives</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} color="success.main">{filteredData.moyenneEvaluations}</Typography>
                          <Typography variant="body2" color="text.secondary">Note moyenne</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

          </Stack>
        </Container>
      </Box>
    </>
  );
};
export default Page;
