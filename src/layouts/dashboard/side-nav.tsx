import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, IconButton, Typography, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { navGroups } from './config';

const SIDE_NAV_WIDTH = 73;
const SIDE_NAV_WIDTH_EXPANDED = 240;
const TOP_NAV_HEIGHT = 64;

interface SideNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SideNav = ({ collapsed, onToggle }: SideNavProps) => {
  const location = useLocation();
  const currentWidth = collapsed ? SIDE_NAV_WIDTH : SIDE_NAV_WIDTH_EXPANDED;

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${TOP_NAV_HEIGHT}px)`,
        width: currentWidth,
        transition: 'width 0.2s ease-in-out',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowX: 'hidden'
      }}
    >
      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', p: 1 }}>
        <IconButton onClick={onToggle} size="small">
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation avec groupes */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {navGroups.map((group, groupIndex) => (
          <Box key={group.title}>
            {/* Titre du groupe - caché si collapsed */}
            {!collapsed && (
              <Typography 
                variant="caption" 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {group.title}
              </Typography>
            )}
            
            <List sx={{ width: '100%' }}>
              {group.items.map((item) => {
                const active = matchPath({ path: item.href, end: true }, location.pathname);

                return (
                  <ListItem
                    key={item.href}
                    disablePadding
                    sx={{ display: 'block' }}
                  >
                    <ListItemButton
                      component={RouterLink}
                      to={item.href}
                      sx={{
                        minHeight: 44,
                        justifyContent: collapsed ? 'center' : 'initial',
                        px: collapsed ? 1 : 2,
                        borderRadius: 1,
                        mx: 1,
                        mb: 0.5,
                        backgroundColor: active ? 'primary.main' : 'transparent',
                        color: active ? 'primary.contrastText' : 'text.primary',
                        '&:hover': {
                          backgroundColor: active ? 'primary.dark' : 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: collapsed ? 0 : 2,
                          justifyContent: 'center',
                          color: 'inherit'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: active ? 600 : 400,
                            noWrap: true
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            {/* Séparateur entre groupes */}
            {!collapsed && groupIndex < navGroups.length - 1 && (
              <Divider sx={{ mx: 2, my: 1 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
