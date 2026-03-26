import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { UserForm } from 'src/components/forms/user-form';
import { usersService, User, CreateUserRequest, UpdateUserRequest } from 'src/lib/api';

// Options d'actions pour la liste des utilisateurs
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration -适配后端API字段
const columns: ColumnConfig[] = [
  { 
    field: 'codeUser', 
    headerName: 'CODE', 
    width: 100 
  },
  { 
    field: 'nomUser', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'emailUser', 
    headerName: 'EMAIL', 
    flex: 1, 
    minWidth: 180 
  },
  { 
    field: 'telephoneUser', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'createdAtUser', 
    headerName: 'DATE CRÉATION', 
    width: 160,
    valueFormatter: (value: any) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('fr-FR');
    }
  },
];

// Page Utilisateurs - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les utilisateurs depuis l'API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setUsers(response.data.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Préparer les données pour le DataTable
  const rows = users.map((u) => ({
    ...u,
    etat_users: u.etatUsers ? 'actif' : 'inactif'
  }));

  // Gestionnaire de clic sur les actions
  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/users/${row.codeUser}`);
    } else if (action === 'edit') {
      setSelectedUser(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      handleDelete(row.codeUser);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (codeUser: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        const response = await usersService.delete(codeUser);
        if (response.success) {
          loadUsers();
        } else {
          setError(response.message || 'Erreur lors de la suppression');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (data: unknown) => {
    try {
      if (selectedUser) {
        // Modifier un utilisateur existant
        const response = await usersService.update(selectedUser.codeUser, data as UpdateUserRequest);
        if (response.success) {
          setModalOpen(false);
          setSelectedUser(null);
          loadUsers();
        } else {
          setError(response.message || 'Erreur lors de la modification');
        }
      } else {
        // Créer un nouvel utilisateur
        const response = await usersService.create(data as CreateUserRequest);
        if (response.success) {
          setModalOpen(false);
          loadUsers();
        } else {
          setError(response.message || 'Erreur lors de la création');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'opération');
    }
  };

  return (
    <>
      <Helmet>
        <title>Utilisateurs | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Utilisateurs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les utilisateurs
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
                Ajouter un utilisateur
              </Button>
            </Stack>

            {/* Message d'erreur */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Indicateur de chargement */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              /* DataTable - ADMIN */
              <DataTable
                rows={rows}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                actions={actionOptions}
                onActionClick={handleActionClick}
                statusColumn={{
                  field: 'etat_users',
                  mapping: {
                    actif: 'success',
                    inactif: 'error'
                  }
                }}
              />
            )}

            {/* Modal d'ajout/modification d'utilisateur */}
            <FormModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedUser(null);
              }}
              title={selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              actions={
                <>
                  <Button onClick={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                  }} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedUser ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <UserForm 
                initialData={selectedUser ? {
                  nomUser: selectedUser.nomUser,
                  emailUser: selectedUser.emailUser,
                  telephoneUser: selectedUser.telephoneUser,
                  etatUsers: selectedUser.etatUsers
                } : undefined}
                onSubmit={handleSubmit}
                isEdit={!!selectedUser}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
