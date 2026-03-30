import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StarIcon from '@mui/icons-material/Star';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RateReviewIcon from '@mui/icons-material/RateReview';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MapIcon from '@mui/icons-material/Map';
import { SvgIcon } from '@mui/material';
import { ReactElement } from 'react';

interface NavItem {
  href: string;
  icon: ReactElement;
  label: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// Organisation des menus par groupes
export const navGroups: NavGroup[] = [
  {
    title: 'Général',
    items: [
      {
        href: '/',
        icon: <SvgIcon component={DashboardIcon} inheritViewBox />,
        label: 'Dashboard'
      }
    ]
  },
  {
    title: 'Gestion',
    items: [
      {
        href: '/orders',
        icon: <SvgIcon component={ShoppingCartIcon} inheritViewBox />,
        label: 'Commandes'
      },
      {
        href: '/products',
        icon: <SvgIcon component={InventoryIcon} inheritViewBox />,
        label: 'Produits'
      },
      {
        href: '/categories',
        icon: <SvgIcon component={CategoryIcon} inheritViewBox />,
        label: 'Catégories'
      },
      {
        href: '/clients',
        icon: <SvgIcon component={PeopleIcon} inheritViewBox />,
        label: 'Clients'
      }
    ]
  },
  {
    title: 'Livraison',
    items: [
      {
        href: '/livreurs',
        icon: <SvgIcon component={LocalShippingIcon} inheritViewBox />,
        label: 'Livreurs'
      },
      {
        href: '/deliveries',
        icon: <SvgIcon component={LocalShippingIcon} inheritViewBox />,
        label: 'Livraisons'
      },
      {
        href: '/payments',
        icon: <SvgIcon component={PaymentIcon} inheritViewBox />,
        label: 'Paiements'
      }
    ]
  },
  {
    title: 'Administration',
    items: [
      {
        href: '/users',
        icon: <SvgIcon component={PersonIcon} inheritViewBox />,
        label: 'Utilisateurs'
      },
      {
        href: '/roles',
        icon: <SvgIcon component={SecurityIcon} inheritViewBox />,
        label: 'Rôles'
      },
      {
        href: '/restaurants',
        icon: <SvgIcon component={RestaurantIcon} inheritViewBox />,
        label: 'Restaurants'
      },
      {
        href: '/familles',
        icon: <SvgIcon component={RestaurantMenuIcon} inheritViewBox />,
        label: 'Types cuisine'
      },
      {
        href: '/villes',
        icon: <SvgIcon component={LocationCityIcon} inheritViewBox />,
        label: 'Villes'
      },
      {
        href: '/zones-livraison',
        icon: <SvgIcon component={MapIcon} inheritViewBox />,
        label: 'Zones livraison'
      },
      {
        href: '/promotions',
        icon: <SvgIcon component={LocalOfferIcon} inheritViewBox />,
        label: 'Promotions'
      }
    ]
  },
  {
    title: 'Finances',
    items: [
      {
        href: '/gains',
        icon: <SvgIcon component={TrendingUpIcon} inheritViewBox />,
        label: 'Gains'
      },
      {
        href: '/wallets',
        icon: <SvgIcon component={AccountBalanceWalletIcon} inheritViewBox />,
        label: 'Wallets livreurs'
      }
    ]
  },
  {
    title: 'Rapports',
    items: [
      {
        href: '/analytics',
        icon: <SvgIcon component={AnalyticsIcon} inheritViewBox />,
        label: 'Analytiques'
      },
      {
        href: '/evaluations',
        icon: <SvgIcon component={RateReviewIcon} inheritViewBox />,
        label: 'Évaluations'
      }
    ]
  },
  {
    title: 'Système',
    items: [
      {
        href: '/settings',
        icon: <SvgIcon component={SettingsIcon} inheritViewBox />,
        label: 'Paramètres'
      },
      {
        href: '/profile',
        icon: <SvgIcon component={PersonIcon} inheritViewBox />,
        label: 'Mon Profil'
      },
      {
        href: '/all-notifications',
        icon: <SvgIcon component={NotificationsActiveIcon} inheritViewBox />,
        label: 'Notifications'
      },
      {
        href: '/icons',
        icon: <SvgIcon component={StarIcon} inheritViewBox />,
        label: 'Icônes'
      }
    ]
  }
];

// Export plat pour compatibilité
export const items: NavItem[] = navGroups.flatMap(group => group.items);
