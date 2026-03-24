import { lazy, useEffect, useState, Suspense, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout as DashboardLayout } from './layouts/dashboard/layout';
import { Box, CircularProgress, Typography, keyframes } from '@mui/material';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy loading des pages pour optimiser les performances
const DashboardPage = lazy(() => import('./pages/dashboard'));
const OrdersPage = lazy(() => import('./pages/orders'));
const ProductsPage = lazy(() => import('./pages/products'));
const ProductDetailPage = lazy(() => import('./pages/product-detail'));
const CategoriesPage = lazy(() => import('./pages/categories'));
const CategoryDetailPage = lazy(() => import('./pages/category-detail'));
const ClientsPage = lazy(() => import('./pages/clients'));
const ClientDetailPage = lazy(() => import('./pages/client-detail'));
const LivreursPage = lazy(() => import('./pages/livreurs'));
const LivreurDetailPage = lazy(() => import('./pages/livreur-detail'));
const DeliveriesPage = lazy(() => import('./pages/deliveries'));
const DeliveryDetailPage = lazy(() => import('./pages/delivery-detail'));
const PaymentsPage = lazy(() => import('./pages/payments'));
const PaymentDetailPage = lazy(() => import('./pages/payment-detail'));
const AnalyticsPage = lazy(() => import('./pages/analytics'));
const SettingsPage = lazy(() => import('./pages/settings'));
const IconsPage = lazy(() => import('./pages/icons'));
const UsersPage = lazy(() => import('./pages/users'));
const UserDetailPage = lazy(() => import('./pages/user-detail'));
const RestaurantsPage = lazy(() => import('./pages/restaurants'));
const RestaurantDetailPage = lazy(() => import('./pages/restaurant-detail'));
const VillesPage = lazy(() => import('./pages/villes'));
const VilleDetailPage = lazy(() => import('./pages/ville-detail'));
const PromotionsPage = lazy(() => import('./pages/promotions'));
const PromotionDetailPage = lazy(() => import('./pages/promotion-detail'));
const RolesPage = lazy(() => import('./pages/roles'));
const ZonesLivraisonPage = lazy(() => import('./pages/zones-livraison'));
const FamillesPage = lazy(() => import('./pages/familles'));
const GainsPage = lazy(() => import('./pages/gains'));
const WalletsPage = lazy(() => import('./pages/wallets'));
const EvaluationsPage = lazy(() => import('./pages/evaluations'));
const LoginPage = lazy(() => import('./pages/login'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password'));
const NotFoundPage = lazy(() => import('./pages/404'));

// Animation de la barre de progression
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

// Barre de chargement animée
const LoadingBar = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 3,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <Box
        sx={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #4caf50, transparent)',
          animation: `${shimmer} 1.5s ease-in-out infinite`,
          width: '100%',
        }}
      />
    </Box>
  );
};

// Fallback pour le chargement
const PageFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px - 100px)',
      gap: 2,
      py: 8,
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      Chargement...
    </Typography>
  </Box>
);

// Wrapper avec gestion du chargement de navigation
const PageWrapper = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Effet pour gérer le chargement lors des changements de route
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsLoading(true);
    }
  }, [location.pathname]);

  // Effet pour arrêter le chargement avec temps minimum
  useEffect(() => {
    const minDisplayTime = 300;
    
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading]);

  // Animation d'entrée de page
  const pageStyles = {
    animation: 'fadeInUp 0.3s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  };

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <Box sx={pageStyles}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Box>
    </>
  );
};

export const routes: RouteObject[] = [
  // Page de connexion (sans layout)
  {
    path: 'login',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LoginPage />
      </Suspense>
    )
  },
  // Page mot de passe oublié (sans layout)
  {
    path: 'forgot-password',
    element: (
      <Suspense fallback={<PageFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    )
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PageWrapper />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      // Dashboard - Vue principale
      {
        index: true,
        element: <DashboardPage />
      },
      // Commandes
      {
        path: 'orders',
        element: <OrdersPage />
      },
      // Produits
      {
        path: 'products',
        element: <ProductsPage />
      },
      // Product Detail
      {
        path: 'products/:code',
        element: <ProductDetailPage />
      },
      // Catégories
      {
        path: 'categories',
        element: <CategoriesPage />
      },
      // Category Detail
      {
        path: 'categories/:code',
        element: <CategoryDetailPage />
      },
      // Clients
      {
        path: 'clients',
        element: <ClientsPage />
      },
      // Client Detail
      {
        path: 'clients/:code',
        element: <ClientDetailPage />
      },
      // Livreurs
      {
        path: 'livreurs',
        element: <LivreursPage />
      },
      // Livreur Detail
      {
        path: 'livreurs/:code',
        element: <LivreurDetailPage />
      },
      // Livraisons
      {
        path: 'deliveries',
        element: <DeliveriesPage />
      },
      // Delivery Detail
      {
        path: 'deliveries/:code',
        element: <DeliveryDetailPage />
      },
      // Paiements
      {
        path: 'payments',
        element: <PaymentsPage />
      },
      // Payment Detail
      {
        path: 'payments/:code',
        element: <PaymentDetailPage />
      },
      // Analytics & Rapports
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      // Utilisateurs
      {
        path: 'users',
        element: <UsersPage />
      },
      // User Detail
      {
        path: 'users/:code',
        element: <UserDetailPage />
      },
      // Restaurants
      {
        path: 'restaurants',
        element: <RestaurantsPage />
      },
      // Restaurant Detail
      {
        path: 'restaurants/:code',
        element: <RestaurantDetailPage />
      },
      // Villes
      {
        path: 'villes',
        element: <VillesPage />
      },
      // Ville Detail
      {
        path: 'villes/:code',
        element: <VilleDetailPage />
      },
      // Promotions
      {
        path: 'promotions',
        element: <PromotionsPage />
      },
      // Promotion Detail
      {
        path: 'promotions/:code',
        element: <PromotionDetailPage />
      },
      // Rôles et Permissions
      {
        path: 'roles',
        element: <RolesPage />
      },
      // Zones de livraison
      {
        path: 'zones-livraison',
        element: <ZonesLivraisonPage />
      },
      // Types de cuisine (familles)
      {
        path: 'familles',
        element: <FamillesPage />
      },
      // Gains & Commissions
      {
        path: 'gains',
        element: <GainsPage />
      },
      // Wallets Livreurs
      {
        path: 'wallets',
        element: <WalletsPage />
      },
      // Évaluations
      {
        path: 'evaluations',
        element: <EvaluationsPage />
      },
      // Paramètres
      {
        path: 'settings',
        element: <SettingsPage />
      },
      // Icônes (page utilitaire)
      {
        path: 'icons',
        element: <IconsPage />
      }
    ]
  },
  // Pages d'erreur
  {
    path: '404',
    element: (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage />
      </Suspense>
    )
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage />
      </Suspense>
    )
  }
];
