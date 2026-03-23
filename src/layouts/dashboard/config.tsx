import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
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
import PersonIcon from '@mui/icons-material/Person';
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
        icon: <SvgIcon><DashboardIcon /></SvgIcon>,
        label: 'Dashboard'
      }
    ]
  },
  {
    title: 'Gestion',
    items: [
      {
        href: '/orders',
        icon: <SvgIcon><ShoppingCartIcon /></SvgIcon>,
        label: 'Commandes'
      },
      {
        href: '/products',
        icon: <SvgIcon><InventoryIcon /></SvgIcon>,
        label: 'Produits'
      },
      {
        href: '/categories',
        icon: <SvgIcon><CategoryIcon /></SvgIcon>,
        label: 'Catégories'
      },
      {
        href: '/clients',
        icon: <SvgIcon><PeopleIcon /></SvgIcon>,
        label: 'Clients'
      }
    ]
  },
  {
    title: 'Livraison',
    items: [
      {
        href: '/livreurs',
        icon: <SvgIcon><LocalShippingIcon /></SvgIcon>,
        label: 'Livreurs'
      },
      {
        href: '/deliveries',
        icon: <SvgIcon><LocalShippingIcon /></SvgIcon>,
        label: 'Livraisons'
      },
      {
        href: '/payments',
        icon: <SvgIcon><PaymentIcon /></SvgIcon>,
        label: 'Paiements'
      }
    ]
  },
  {
    title: 'Administration',
    items: [
      {
        href: '/users',
        icon: <SvgIcon><PersonIcon /></SvgIcon>,
        label: 'Utilisateurs'
      },
      {
        href: '/roles',
        icon: <SvgIcon><SecurityIcon /></SvgIcon>,
        label: 'Rôles'
      },
      {
        href: '/restaurants',
        icon: <SvgIcon><RestaurantIcon /></SvgIcon>,
        label: 'Restaurants'
      },
      {
        href: '/familles',
        icon: <SvgIcon><RestaurantMenuIcon /></SvgIcon>,
        label: 'Types cuisine'
      },
      {
        href: '/villes',
        icon: <SvgIcon><LocationCityIcon /></SvgIcon>,
        label: 'Villes'
      },
      {
        href: '/zones-livraison',
        icon: <SvgIcon><MapIcon /></SvgIcon>,
        label: 'Zones livraison'
      },
      {
        href: '/promotions',
        icon: <SvgIcon><LocalOfferIcon /></SvgIcon>,
        label: 'Promotions'
      }
    ]
  },
  {
    title: 'Finances',
    items: [
      {
        href: '/gains',
        icon: <SvgIcon><TrendingUpIcon /></SvgIcon>,
        label: 'Gains'
      },
      {
        href: '/wallets',
        icon: <SvgIcon><AccountBalanceWalletIcon /></SvgIcon>,
        label: 'Wallets livreurs'
      }
    ]
  },
  {
    title: 'Rapports',
    items: [
      {
        href: '/analytics',
        icon: <SvgIcon><AnalyticsIcon /></SvgIcon>,
        label: 'Analytiques'
      },
      {
        href: '/evaluations',
        icon: <SvgIcon><RateReviewIcon /></SvgIcon>,
        label: 'Évaluations'
      }
    ]
  },
  {
    title: 'Système',
    items: [
      {
        href: '/settings',
        icon: <SvgIcon><SettingsIcon /></SvgIcon>,
        label: 'Paramètres'
      },
      {
        href: '/icons',
        icon: <SvgIcon><StarIcon /></SvgIcon>,
        label: 'Icônes'
      }
    ]
  }
];

// Export plat pour compatibilité
export const items: NavItem[] = navGroups.flatMap(group => group.items);
