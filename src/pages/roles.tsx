import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  Box, Button, Card, Container, Chip, Grid, IconButton, 
  Stack, Switch, TextField, Typography, Checkbox, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// Types
interface Role {
  id_role: number;
  code_role: string;
  libelle_role: string;
  description_role: string | null;
  etat_role: number;
}

interface Permission {
  id_permission: number;
  code_permission: string;
  description_permission: string | null;
  etat_permission: number;
}

interface RolePermission {
  role_code: string;
  permission_code: string;
  active: boolean;
}

// Rôles mock
const mockRoles: Role[] = [
  { id_role: 1, code_role: 'admin', libelle_role: 'Administrateur Woli', description_role: 'Accès total à la plateforme Woli', etat_role: 1 },
  { id_role: 2, code_role: 'restaurant_owner', libelle_role: 'Propriétaire Restaurant', description_role: 'Gestion complète de son restaurant', etat_role: 1 },
  { id_role: 3, code_role: 'livreur', libelle_role: 'Livreur', description_role: 'Gestion des livraisons et du wallet', etat_role: 1 },
  { id_role: 4, code_role: 'manager', libelle_role: 'Gestionnaire', description_role: 'Gestion quotidienne du restaurant', etat_role: 1 },
  { id_role: 5, code_role: 'client', libelle_role: 'Client', description_role: 'Commande et suivi des livraisons', etat_role: 1 },
];

// Permissions mock
const mockPermissions: Permission[] = [
  { id_permission: 1, code_permission: 'user.view', description_permission: 'Voir les utilisateurs', etat_permission: 1 },
  { id_permission: 2, code_permission: 'user.create', description_permission: 'Créer un utilisateur', etat_permission: 1 },
  { id_permission: 3, code_permission: 'user.update', description_permission: 'Modifier un utilisateur', etat_permission: 1 },
  { id_permission: 4, code_permission: 'user.delete', description_permission: 'Supprimer un utilisateur', etat_permission: 1 },
  { id_permission: 5, code_permission: 'role.view', description_permission: 'Voir les rôles', etat_permission: 1 },
  { id_permission: 6, code_permission: 'role.assign', description_permission: 'Attribuer des rôles', etat_permission: 1 },
  { id_permission: 7, code_permission: 'restaurant.view', description_permission: 'Voir les restaurants', etat_permission: 1 },
  { id_permission: 8, code_permission: 'restaurant.create', description_permission: 'Créer un restaurant', etat_permission: 1 },
  { id_permission: 9, code_permission: 'restaurant.update', description_permission: 'Modifier un restaurant', etat_permission: 1 },
  { id_permission: 10, code_permission: 'restaurant.delete', description_permission: 'Supprimer un restaurant', etat_permission: 1 },
  { id_permission: 11, code_permission: 'category.manage', description_permission: 'Gérer les catégories', etat_permission: 1 },
  { id_permission: 12, code_permission: 'product.manage', description_permission: 'Gérer les produits', etat_permission: 1 },
  { id_permission: 13, code_permission: 'order.view', description_permission: 'Voir les commandes', etat_permission: 1 },
  { id_permission: 14, code_permission: 'order.update_status', description_permission: 'Changer le statut des commandes', etat_permission: 1 },
  { id_permission: 15, code_permission: 'delivery.manage', description_permission: 'Gérer les livraisons', etat_permission: 1 },
  { id_permission: 16, code_permission: 'driver.manage', description_permission: 'Gérer les livreurs', etat_permission: 1 },
  { id_permission: 17, code_permission: 'payment.view', description_permission: 'Voir les paiements', etat_permission: 1 },
  { id_permission: 18, code_permission: 'commission.manage', description_description: 'Gérer les commissions', etat_permission: 1 },
  { id_permission: 19, code_permission: 'platform.settings', description_permission: 'Gérer les paramètres globaux', etat_permission: 1 },
  { id_permission: 20, code_permission: 'report.view', description_permission: 'Voir les rapports globaux', etat_permission: 1 },
];

// Permissions par défaut pour chaque rôle
const defaultRolePermissions: Record<string, string[]> = {
  'admin': ['user.view', 'user.create', 'user.update', 'user.delete', 'role.view', 'role.assign', 'restaurant.view', 'restaurant.create', 'restaurant.update', 'restaurant.delete', 'category.manage', 'product.manage', 'order.view', 'order.update_status', 'delivery.manage', 'driver.manage', 'payment.view', 'commission.manage', 'platform.settings', 'report.view'],
  'restaurant_owner': ['restaurant.view', 'restaurant.update', 'category.manage', 'product.manage', 'order.view', 'order.update_status', 'delivery.manage', 'driver.manage', 'payment.view'],
  'livreur': ['delivery.manage', 'order.view'],
  'manager': ['restaurant.view', 'category.manage', 'product.manage', 'order.view', 'order.update_status', 'delivery.manage', 'payment.view'],
  'client': ['order.view', 'order.create'],
};

const Page = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});

  // Ouvrir le dialog des permissions
  const handleOpenPermissions = (role: Role) => {
    setSelectedRole(role);
    setRolePermissions({
      [role.code_role]: defaultRolePermissions[role.code_role] || []
    });
    setPermissionsDialog(true);
  };

  // Basculer une permission
  const handleTogglePermission = (permissionCode: string) => {
    if (!selectedRole) return;
    
    const currentPermissions = rolePermissions[selectedRole.code_role] || [];
    const newPermissions = currentPermissions.includes(permissionCode)
      ? currentPermissions.filter(p => p !== permissionCode)
      : [...currentPermissions, permissionCode];
    
    setRolePermissions({
      ...rolePermissions,
      [selectedRole.code_role]: newPermissions
    });
  };

  // Sauvegarder les permissions
  const handleSavePermissions = () => {
    console.log('Permissions saves:', rolePermissions);
    setPermissionsDialog(false);
  };

  return (
    <>
      <Helmet>
        <title>Rôles et Permissions | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* En-tête */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Rôles et Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les rôles utilisateurs et leurs permissions
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Nouveau rôle
              </Button>
            </Stack>

            {/* Liste des rôles */}
            <Grid container spacing={3}>
              {mockRoles.map((role) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={role.id_role}>
                  <Card 
                    sx={{ 
                      p: 3,
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}>
                        <SecurityIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {role.libelle_role}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.code_role}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {role.description_role}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Chip 
                        size="small" 
                        label={role.etat_role === 1 ? 'Actif' : 'Inactif'}
                        color={role.etat_role === 1 ? 'success' : 'default'}
                      />
                      <Stack direction="row">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenPermissions(role)}
                          title="Gérer les permissions"
                        >
                          <VpnKeyIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Liste des permissions */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Toutes les permissions
              </Typography>
              <Grid container spacing={2}>
                {mockPermissions.map((permission) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission.id_permission}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 1, 
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {permission.code_permission}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.description_permission}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Dialog Permissions */}
      <Dialog 
        open={permissionsDialog} 
        onClose={() => setPermissionsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Permissions - {selectedRole?.libelle_role}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Cochez les permissions à attribuer à ce rôle
          </Typography>
          <Grid container spacing={2}>
            {mockPermissions.map((permission) => (
              <Grid size={{ xs: 12, sm: 6 }} key={permission.id_permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rolePermissions[selectedRole?.code_role || '']?.includes(permission.code_permission) || false}
                      onChange={() => handleTogglePermission(permission.code_permission)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {permission.code_permission}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.description_permission}
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    p: 1, 
                    borderRadius: 1,
                    bgcolor: rolePermissions[selectedRole?.code_role || '']?.includes(permission.code_permission) ? 'primary.light' : 'transparent',
                    width: '100%',
                    mx: 0
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialog(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSavePermissions}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
