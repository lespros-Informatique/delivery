import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Avatar, 
  Box, 
  Stack, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  InputBase,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useThemeMode } from 'src/theme/ThemeContext';
import { Logo } from 'src/components/logo';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const TOP_NAV_HEIGHT = 64;

// Notifications data
const notifications = [
  { id: 1, title: 'Nouvelle commande', message: 'Commande #1234 reçue', time: 'Il y a 5 min', read: false },
  { id: 2, title: 'Paiement confirmé', message: 'Paiement de $150.00 validé', time: 'Il y a 1h', read: false },
  { id: 3, title: 'Stock faible', message: '5 produits en stock bas', time: 'Il y a 2h', read: true },
];

interface TopNavProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const TopNav = ({ onToggleSidebar }: TopNavProps) => {
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Données de recherche simulées
  const searchResults = [
    { type: 'Commande', label: 'Commande #1234', icon: <ReceiptIcon />, path: '/orders' },
    { type: 'Restaurant', label: 'Burger King', icon: <RestaurantIcon />, path: '/restaurants' },
    { type: 'Client', label: 'John Doe', icon: <PeopleIcon />, path: '/clients' },
    { type: 'Livreur', label: 'Jean Kouassi', icon: <LocalShippingIcon />, path: '/livreurs' },
    { type: 'Produit', label: 'Burger', icon: <ShoppingCartIcon />, path: '/products' },
  ].filter(item => 
    searchQuery && item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    setSearchAnchor(event.currentTarget);
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setSearchAnchor(null);
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  // Fermer la recherche mobile quand on appuie sur Escape
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMobileSearchOpen(false);
    }
  };

  const notificationOpen = Boolean(notificationAnchor);
  const userOpen = Boolean(userAnchor);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchor(null);
    setUserAnchor(null);
    setSearchAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'neutral.900',
        color: 'common.white',
        position: 'fixed',
        width: '100%',
        zIndex: (theme) => theme.zIndex.appBar
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 3
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <IconButton 
            color="inherit" 
            onClick={onToggleSidebar}
            sx={{ mr: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ width: 20, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
                <Box sx={{ width: 20, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
                <Box sx={{ width: 20, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
              </Box>
            </Box>
          </IconButton>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'inline-flex',
              height: 24,
              width: 24
            }}
          >
            <Logo />
          </Box>

          {/* Icône de recherche mobile */}
          <Tooltip title="Rechercher">
            <IconButton 
              color="inherit" 
              onClick={handleMobileSearchToggle}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Barre de recherche - centrée (desktop uniquement) */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', px: 2 }}>
            <Paper
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 500,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
              }}
              onClick={handleSearchClick}
            >
              <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  color: 'white',
                  '& input::placeholder': {
                    color: 'grey.400',
                    opacity: 1,
                  },
                }}
              />
            </Paper>
          </Box>

          {/* Popper de résultats de recherche */}
          <Popper
            open={Boolean(searchAnchor) && searchResults.length > 0}
            anchorEl={searchAnchor}
            placement="bottom-start"
            sx={{ zIndex: 1300 }}
          >
            <Paper sx={{ width: 320, mt: 1, maxHeight: 280, overflow: 'auto', boxShadow: 3 }}>
              <List dense>
                {searchResults.map((result, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleSearchResultClick(result.path)}>
                      <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                        {result.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={result.label} 
                        secondary={result.type}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>

          {/* Barre de recherche mobile - affichée sous la nav (toggle) */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              top: TOP_NAV_HEIGHT,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'neutral.900',
              borderBottom: '1px solid',
              borderColor: 'divider',
              transform: mobileSearchOpen ? 'translateY(0)' : 'translateY(-100%)',
              opacity: mobileSearchOpen ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              zIndex: 1200,
            }}
            onKeyDown={handleKeyDown}
          >
            <Paper
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: 'grey.100',
              }}
            >
              <SearchIcon sx={{ color: 'grey.500', mr: 1 }} />
              <InputBase
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ flex: 1, color: 'grey.900' }}
                autoFocus
              />
            </Paper>
            {/* Résultats de recherche mobile */}
            {mobileSearchOpen && searchResults.length > 0 && (
              <Paper sx={{ width: '100%', mt: 1, maxHeight: 200, overflow: 'auto', boxShadow: 3 }}>
                <List dense>
                  {searchResults.map((result, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => handleSearchResultClick(result.path)}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                          {result.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={result.label} 
                          secondary={result.type}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Stack>

        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Mode clair' : 'Mode sombre'}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <IconButton 
            color="inherit" 
            onClick={handleNotificationClick}
            sx={{ 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  height: 18,
                  minWidth: 18
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={notificationAnchor}
            open={notificationOpen}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vous avez {unreadCount} notification(s) non lue(s)
              </Typography>
            </Box>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={handleClose}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  bgcolor: notification.read ? 'transparent' : 'action.hover'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={notification.read ? 400 : 600}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleClose} sx={{ justifyContent: 'center', py: 1.5 }}>
              <Typography variant="body2" color="primary">
                Voir toutes les notifications
              </Typography>
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <IconButton 
            onClick={handleUserClick}
            sx={{ 
              p: 0.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Avatar
              src="/assets/avatars/avatar-chen-simmons.jpg"
              variant="rounded"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          
          <Menu
            anchorEl={userAnchor}
            open={userOpen}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.name || 'Utilisateur'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'email@exemple.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Paramètres</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Déconnexion</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};
