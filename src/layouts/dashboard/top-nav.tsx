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
  Tooltip
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeMode } from 'src/theme/ThemeContext';
import { Logo } from 'src/components/logo';

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
  const { isDark, toggleTheme } = useThemeMode();
  
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
                Chen Simmons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                chen@exemple.com
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
            <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
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
