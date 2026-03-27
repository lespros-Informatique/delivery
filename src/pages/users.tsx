import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-hot-toast';

import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { PageContainer } from 'src/components/page-container';
import { AsyncPage } from 'src/components/AsyncPage';
import { FormModal } from 'src/components/modal/form-modal';
import { ConfirmModal } from 'src/components/modal/confirm-modal';
import { UserForm } from 'src/components/forms/user-form';
import { usersService, type User } from 'src/lib/api';
import { useApiList } from 'src/hooks/useApiList';
import { useApiPagination } from 'src/hooks/useApiPagination';
import { useApiMutation } from 'src/hooks/useApiMutation';

/**
 * Page Utilisateurs - Migration React Query + API Réelle
 */
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination
  const { page, limit, onPageChange, onLimitChange } = useApiPagination(1, 10);

  // Fetching
  const { data: response, isLoading, error, refetch } = useApiList<User>(
    'utilisateurs',
    (params) => usersService.getAll(params),
    { page, limit }
  );

  const data = response?.data || [];

  // Mutations
  const createUser = useApiMutation(
    (newData: any) => usersService.create(newData),
    {
      onSuccess: () => {
        toast.success('Utilisateur créé avec succès');
        refetch();
        handleCloseModal();
      },
      onError: (error) => {
        toast.error('Erreur lors de la création');
        console.error('Mutation failed:', error);
      }
    }
  );

  const updateUser = useApiMutation(
    (updateData: { code: string; data: any }) => usersService.update(updateData.code, updateData.data),
    {
      onSuccess: () => {
        toast.success('Utilisateur modifié avec succès');
        refetch();
        handleCloseModal();
      },
      onError: () => {
        toast.error('Erreur lors de la modification');
      }
    }
  );

  const deleteUser = useApiMutation(
    (code: string) => usersService.update(code, { etatUsers: false }),
    {
      onSuccess: () => {
        toast.success('Utilisateur archivé avec succès');
        refetch();
        setConfirmModalOpen(false);
        setSelectedUser(null);
      },
      onError: () => {
        toast.error("Erreur lors de l'archivage");
        setConfirmModalOpen(false);
      }
    }
  );

  // Actions
  const actionOptions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" color="error" />, action: 'delete', color: 'error' },
  ];

  const handleActionClick = (row: Record<string, unknown>, action: string) => {
    const user = row as unknown as User;
    if (action === 'view') {
      navigate(`/users/${user.codeUser}`);
    } else if (action === 'edit') {
      setSelectedUser(user);
      setModalOpen(true);
    } else if (action === 'delete') {
      setSelectedUser(user);
      setConfirmModalOpen(true);
    }
  };

  const handleOpenModal = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (formData: any) => {
    if (selectedUser) {
      updateUser.mutate({ code: selectedUser.codeUser, data: formData });
    } else {
      createUser.mutate(formData);
    }
  };

  // Columns configuration
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
      minWidth: 200
    },
    {
      field: 'telephoneUser',
      headerName: 'TÉLÉPHONE',
      width: 150
    },
    {
      field: 'etatUsers',
      headerName: 'STATUT',
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          color: params.value ? 'success.main' : 'error.main',
          fontWeight: 'bold',
          textTransform: 'capitalize'
        }}>
          {params.value ? 'Actif': 'Inactif'}
        </Box>
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Utilisateurs | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Utilisateurs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestion des comptes administrateurs et gestionnaires
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
              Nouvel utilisateur
            </Button>
          </Stack>

          <AsyncPage isLoading={isLoading} error={error} isEmpty={data.length === 0} onRetry={() => refetch()}>
            <DataTable
              rows={data as unknown as Record<string, unknown>[]}
              columns={columns}
              actions={actionOptions}
              onActionClick={handleActionClick}
              rowCount={response?.pagination?.total || 0}
              page={page - 1}
              pageSize={limit}
              onPageChange={(p) => onPageChange(p + 1)}
              onPageSizeChange={onLimitChange}
              loading={isLoading || deleteUser.isPending}
            />
          </AsyncPage>

          <FormModal
            open={modalOpen}
            onClose={handleCloseModal}
            title={selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
            maxWidth="sm"
            actions={
              <>
                <Button onClick={handleCloseModal} color="inherit">
                  Annuler
                </Button>
                <LoadingButton variant="contained" type="submit" form="modal-form" loading={createUser.isPending || updateUser.isPending}>
                  {selectedUser ? 'Enregistrer' : 'Ajouter'}
                </LoadingButton>
              </>
            }
          >
            <UserForm
              key={selectedUser ? selectedUser.codeUser : 'new-user'}
              initialData={selectedUser || undefined}
              onSubmit={handleSubmit}
              isEdit={!!selectedUser}
            />
          </FormModal>

          <ConfirmModal
            open={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={() => selectedUser && deleteUser.mutate(selectedUser.codeUser)}
            title="Confirmer la suppression"
            message={<>Voulez-vous vraiment supprimer l'utilisateur <strong>{selectedUser?.nomUser}</strong> ? Cette action archivera l'utilisateur.</>}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            color="error"
            isLoading={deleteUser.isPending}
          />
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
