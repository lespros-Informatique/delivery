import { useState } from 'react';
import { styled, useTheme, useMediaQuery } from '@mui/material';
import { Box, Drawer } from '@mui/material';
import { Footer } from './footer';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { ReactNode } from 'react';

const SIDE_NAV_WIDTH = 73;
const SIDE_NAV_WIDTH_EXPANDED = 240;
const TOP_NAV_HEIGHT = 64;
const MOBILE_DRAWER_WIDTH = 280;

const LayoutRoot = styled('div')<{ sidebarcollapsed?: number }>(({ theme, sidebarcollapsed }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: TOP_NAV_HEIGHT,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: sidebarcollapsed ? SIDE_NAV_WIDTH : SIDE_NAV_WIDTH_EXPANDED
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <TopNav onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: MOBILE_DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SideNav collapsed={false} onToggle={toggleSidebar} />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          position: 'fixed',
          left: 0,
          top: TOP_NAV_HEIGHT,
          height: `calc(100% - ${TOP_NAV_HEIGHT}px)`,
          width: sidebarCollapsed ? SIDE_NAV_WIDTH : SIDE_NAV_WIDTH_EXPANDED,
          transition: 'width 0.2s ease-in-out',
          zIndex: (theme) => theme.zIndex.appBar - 100,
        }}
      >
        <SideNav collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </Box>

      <LayoutRoot sidebarcollapsed={sidebarCollapsed ? 1 : 0}>
        <LayoutContainer>
          {children}
          <Footer />
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
