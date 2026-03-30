import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Box, Container, Stack, Typography, Card, Button, Chip,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Divider, ToggleButtonGroup, ToggleButton, Avatar, Badge,
  List, ListItem, TextField, InputAdornment, Paper,
  Popper, Fade, ClickAwayListener, ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { mockNotifications } from 'src/data/mock';

// Type pour les notifications (selon la nouvelle structure DB)
interface NotificationItem {
  id: number;
  code: string;
  targetCode: string | null;
  targetType: 'user' | 'livreur' | 'client' | null;
  type: string;
  titre: string;
  message: string;
  canal: 'push' | 'email' | 'sms' | 'in_app';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  isRead: boolean;
  link: string | null;
  date: string;
  icon: React.ReactNode;
  color: string;
}

// Fonction pour formater la date
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// Fonction pour obtenir l'icône selon le type
const getNotificationIcon = (type: string): { icon: React.ReactNode; color: string } => {
  switch (type) {
    case 'commande':
      return { icon: <ShoppingCartIcon />, color: 'primary.main' };
    case 'paiement':
      return { icon: <PaymentIcon />, color: 'success.main' };
    case 'livraison':
      return { icon: <LocalShippingIcon />, color: 'info.main' };
    case 'restaurant':
      return { icon: <RestaurantIcon />, color: 'warning.main' };
    case 'alerte':
      return { icon: <WarningIcon />, color: 'error.main' };
    default:
      return { icon: <InfoIcon />, color: 'grey.500' };
  }
};

// Fonction pour obtenir la couleur selon la priorité
const getPrioriteColor = (priorite: string): 'error' | 'warning' | 'info' | 'default' => {
  switch (priorite) {
    case 'urgente': return 'error';
    case 'haute': return 'warning';
    case 'moyenne': return 'info';
    case 'basse': return 'default';
    default: return 'default';
  }
};

// Page Notifications - Design moderne et complet
const Page = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [searchAnchor, setSearchAnchor] = useState<HTMLElement | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Types de notifications disponibles
  const notificationTypes = useMemo(() => {
    const types = notifications.map(n => n.type);
    return [...new Set(types)];
  }, [notifications]);

  // Suggestions de recherche
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions: string[] = [];
    
    notifications.forEach(n => {
      if (n.titre.toLowerCase().includes(query) && !suggestions.includes(n.titre)) {
        suggestions.push(n.titre);
      }
    });
    
    notifications.forEach(n => {
      if (n.message.toLowerCase().includes(query)) {
        const idx = n.message.toLowerCase().indexOf(query);
        const start = Math.max(0, idx - 25);
        const end = Math.min(n.message.length, idx + 50);
        const excerpt = (start > 0 ? '...' : '') + n.message.slice(start, end) + (end < n.message.length ? '...' : '');
        if (!suggestions.includes(excerpt)) {
          suggestions.push(excerpt);
        }
      }
    });
    
    return suggestions.slice(0, 6);
  }, [searchQuery, notifications]);

  // Charger les notifications
  useEffect(() => {
    const loadedNotifications = mockNotifications.map(n => {
      const { icon, color } = getNotificationIcon(n.type_notification);
      return {
        id: n.id_notification,
        code: n.code_notification,
        targetCode: null,
        targetType: null,
        type: n.type_notification,
        titre: n.titre,
        message: n.message,
        canal: 'in_app' as const,
        priorite: 'moyenne' as const,
        isRead: n.lu === 1,
        link: null,
        date: n.created_at_notification,
        icon,
        color,
      };
    });
    setNotifications(loadedNotifications);
  }, []);

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !n.isRead) || 
      (filter === 'read' && n.isRead);
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      n.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesType && matchesSearch;
  });

  const total = notifications.length;
  const unread = notifications.filter(n => !n.isRead).length;
  const read = notifications.filter(n => n.isRead).length;

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedNotification(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    handleMenuClose();
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
    handleMenuClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value.length >= 2) {
      setSearchAnchor(searchInputRef.current);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchAnchor(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchAnchor(null);
  };

  const handleSearchFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsSearchFocused(true);
    setSearchAnchor(event.currentTarget);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    setTimeout(() => setSearchAnchor(null), 200);
  };

  const handleNotificationClick = (link: string | null) => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <>
      <Helmet>
        <title>Notifications | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">Gérez vos notifications et alertes</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip icon={<NotificationsIcon />} label={`${unread} non lues`} color="primary" variant="outlined" />
                  <Button variant="outlined" size="small" startIcon={<DoneAllIcon />} onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Filtres et recherche */}
            <Card sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange} size="small">
                  <ToggleButton value="all">Toutes ({total})</ToggleButton>
                  <ToggleButton value="unread">Non lues ({unread})</ToggleButton>
                  <ToggleButton value="read">Lues ({read})</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  select
                  size="small"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                  SelectProps={{ native: true }}
                >
                  <option value="all">Tous les types</option>
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </TextField>

                <ClickAwayListener onClickAway={() => setSearchAnchor(null)}>
                  <Box sx={{ position: 'relative', flex: 1, minWidth: 250 }}>
                    <TextField
                      fullWidth
                      inputRef={searchInputRef}
                      placeholder="Rechercher par titre, message ou type..."
                      size="small"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                        endAdornment: searchQuery ? (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={handleClearSearch} edge="end">
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                        sx: {
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isSearchFocused ? 'primary.main' : 'divider',
                          },
                        }
                      }}
                    />
                    
                    <Popper
                      open={Boolean(searchAnchor) && searchSuggestions.length > 0}
                      anchorEl={searchAnchor}
                      placement="bottom-start"
                      sx={{ zIndex: 1300, width: searchAnchor?.offsetWidth }}
                    >
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={200}>
                          <Paper sx={{ mt: 1, maxHeight: 250, overflow: 'auto', boxShadow: 3, borderRadius: 2 }}>
                            <List dense disablePadding>
                              {searchSuggestions.map((suggestion, idx) => (
                                <ListItem key={idx} disablePadding>
                                  <ListItemButton onClick={() => handleSuggestionClick(suggestion)} sx={{ py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <AutoAwesomeIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={suggestion}
                                      primaryTypographyProps={{ 
                                        variant: 'body2',
                                        sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </Box>
                </ClickAwayListener>

                <Chip label={`${filteredNotifications.length} résultat${filteredNotifications.length !== 1 ? 's' : ''}`} size="small" variant="outlined" />
              </Stack>
            </Card>

            {/* Liste des notifications */}
            <Box>
              {filteredNotifications.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <NotificationsIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary">Aucune notification</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filter === 'unread' ? 'Vous avez lu toutes vos notifications' : searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Aucune notification ne correspond à votre recherche'}
                  </Typography>
                </Card>
              ) : (
                <Stack spacing={1}>
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.link)}
                      sx={{ 
                        p: 2,
                        cursor: notification.link ? 'pointer' : 'default',
                        bgcolor: notification.isRead ? 'background.paper' : 'action.hover',
                        borderLeft: notification.isRead ? 'none' : '3px solid',
                        borderColor: notification.isRead ? 'divider' : 'primary.main',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'action.hover', transform: 'translateX(4px)' }
                      }}
                    >
                      <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={!notification.isRead && (
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', border: '2px solid white' }} />
                          )}
                        >
                          <Avatar sx={{ bgcolor: notification.color }}>{notification.icon}</Avatar>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={notification.isRead ? 400 : 600}>{notification.titre}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{notification.message}</Typography>
                            </Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="caption" color="text.secondary">{formatDate(notification.date)}</Typography>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuClick(e, notification.id); }}>
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                          
                          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                            <Chip label={notification.type} size="small" variant="outlined" />
                            <Chip label={notification.canal} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                            <Chip label={notification.priorite} size="small" color={getPrioriteColor(notification.priorite)} variant="outlined" sx={{ textTransform: 'capitalize' }} />
                          </Stack>
                        </Box>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Menu contextuel */}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { minWidth: 200 } }}
            >
              {!notifications.find(n => n.id === selectedNotification)?.isRead && (
                <MenuItem onClick={() => selectedNotification && markAsRead(selectedNotification)}>
                  <ListItemIcon><MarkEmailReadIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Marquer comme lu</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={() => selectedNotification && deleteNotification(selectedNotification)}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Supprimer</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={deleteAllRead}>
                <ListItemIcon><DoneAllIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Supprimer les notifications lues</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;