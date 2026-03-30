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
import { LivreurForm } from 'src/components/forms/livreur-form';
import { livreursService, type Livreur } from 'src/lib/api';
import { useApiList } from 'src/hooks/useApiList';
import { useApiPagination } from 'src/hooks/useApiPagination';
import { useApiMutation } from 'src/hooks/useApiMutation';
import { ETAT_DEFAUT } from '../../backend/src/shared/constants/tables.js';

const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState<Livreur | null>(null);

  // Pagination
  const { page, limit, onPageChange, onLimitChange } = useApiPagination(1, 10);

  // Fetching
  const { data: response, isLoading, error, refetch } = useApiList<Livreur>(
    'livreurs',
    (params) => livreursService.getAll(params) as any,
    { page, limit }
  );

  const data = response?.data || [];
  
  // Appliquer le mapping attendu par le DataTable si besoin pour les status
  const rows = data.map((l: any) => ({
    ...l,
    statut_livreurs: l.active || l.statut_livreurs ? 'actif' : 'inactif'
  }));

  // Mutations
  const createLivreur = useApiMutation(
    (newData: any) => livreursService.create(newData),
    {
      onSuccess: () => {
        toast.success("Livreur créé avec succès");
        refetch();
        handleCloseModal();
      },
      onError: (err) => {
        toast.error("Erreur lors de la création");
        console.error(err);
      }
    }
  );

  const updateLivreur = useApiMutation(
    (updateData: { code: string; data: any }) => livreursService.update(updateData.code, updateData.data),
    {
      onSuccess: () => {
        toast.success("Livreur modifié avec succès");
        refetch();
        handleCloseModal();
      },
      onError: () => {
        toast.error("Erreur lors de la modification");
      }
    }
  );

  const deleteLivreur = useApiMutation(
    (code: string) => livreursService.update(code, { statut_livreurs: false } as any),
    {
      onSuccess: () => {
        toast.success("Livreur archivé avec succès");
        refetch();
        setConfirmModalOpen(false);
        setSelectedLivreur(null);
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
    const livreur = row as unknown as Livreur;
    if (action === 'view') {
      navigate(`/livreurs/${livreur.codeLivreur || (livreur as any).code_livreur}`);
    } else if (action === 'edit') {
      setSelectedLivreur(livreur);
      setModalOpen(true);
    } else if (action === 'delete') {
      setSelectedLivreur(livreur);
      setConfirmModalOpen(true);
    }
  };

  const handleOpenModal = () => {
    setSelectedLivreur(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLivreur(null);
  };

  const handleSubmit = (formData: any) => {
    if (selectedLivreur) {
      updateLivreur.mutate({ code: selectedLivreur.codeLivreur || (selectedLivreur as any).code_livreur, data: formData });
    } else {
      createLivreur.mutate(formData);
    }
  };

  const columns: ColumnConfig[] = [
    { field: 'codeLivreur', headerName: 'CODE', width: 120, renderCell: (params: any) => params.value || params.row?.code_livreur },
    { field: 'nomLivreur', headerName: 'NOM', flex: 1, minWidth: 150, renderCell: (params: any) => params.value || params.row?.nom_livreur || params.row?.prenom_livreur },
    { field: 'telephoneLivreur', headerName: 'TÉLÉPHONE', width: 150, renderCell: (params: any) => params.value || params.row?.telephone_livreur },
    { field: 'Ville', headerName: 'VILLE', width: 130, valueFormatter: (value: any) => value?.nomVille || '-' },
    { field: 'disponible', headerName: 'DISPONIBLE', width: 120, valueFormatter: (value: any) => value ? 'Oui' : 'Non' },
    { field: 'createdAt', headerName: 'DATE CRÉATION', width: 160, renderCell: (params: any) => {
      const dateVal = params.value || params.row?.created_at_livreur;
      if (!dateVal) return '';
      return new Date(dateVal).toLocaleDateString('fr-FR');
    }},
    {
      field: 'statut_livreurs',
      headerName: 'STATUT',
      width: 120,
      renderCell: (params) => {
        const estActif = params.row.statut_livreurs;
        console.log(estActif,params.row);
        return (
          <Box sx={{
            color: estActif == ETAT_DEFAUT.ACTIF ? 'success.main' : 'error.main',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>
            {estActif == ETAT_DEFAUT.ACTIF ? 'Actif' : 'Inactif'}
          </Box>
        );
      }
    },
  ];

  return (
    <>
      <Helmet>
        <title>Livreurs | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Livreurs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez vos livreurs
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
              Nouveau livreur
            </Button>
          </Stack>

          <AsyncPage isLoading={isLoading} error={error} isEmpty={data.length === 0} onRetry={() => refetch()}>
            <DataTable
              rows={rows as unknown as Record<string, unknown>[]}
              columns={columns}
              actions={actionOptions}
              onActionClick={handleActionClick}
              rowCount={response?.pagination?.total || 0}
              page={page - 1}
              pageSize={limit}
              onPageChange={(p) => onPageChange(p + 1)}
              onPageSizeChange={onLimitChange}
              loading={isLoading || deleteLivreur.isPending}
            />
          </AsyncPage>

          <FormModal
            open={modalOpen}
            onClose={handleCloseModal}
            title={selectedLivreur ? 'Modifier le livreur' : 'Ajouter un livreur'}
            maxWidth="md"
            actions={
              <>
                <Button onClick={handleCloseModal} color="inherit">
                  Annuler
                </Button>
                <LoadingButton variant="contained" type="submit" form="modal-form" loading={createLivreur.isPending || updateLivreur.isPending}>
                  {selectedLivreur ? 'Enregistrer' : 'Ajouter'}
                </LoadingButton>
              </>
            }
          >
            <LivreurForm 
              key={selectedLivreur ? selectedLivreur.codeLivreur || (selectedLivreur as any).code_livreur : 'new-livreur'}
              initialData={selectedLivreur ? {
                nom_livreur: selectedLivreur.nomLivreur || (selectedLivreur as any).nom_livreur,
                prenom_livreur: (selectedLivreur as any).prenom_livreur,
                telephone_livreur: selectedLivreur.telephoneLivreur || (selectedLivreur as any).telephone_livreur,
                email_livreur: selectedLivreur.emailLivreur || (selectedLivreur as any).email_livreur,
                restaurant_code: (selectedLivreur as any).restaurant_code,
                moyen_transport: (selectedLivreur as any).moyen_transport,
                plaque_vehicule: (selectedLivreur as any).plaque_vehicule,
                statut_livreurs: selectedLivreur.active !== undefined ? selectedLivreur.active : Boolean((selectedLivreur as any).statut_livreurs)
              } : undefined}
              onSubmit={handleSubmit}
            />
          </FormModal>

          <ConfirmModal
            open={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setSelectedLivreur(null);
            }}
            onConfirm={() => selectedLivreur && deleteLivreur.mutate(selectedLivreur.codeLivreur || (selectedLivreur as any).code_livreur)}
            title="Confirmer la suppression"
            message={<>Voulez-vous vraiment supprimer le livreur <strong>{selectedLivreur?.nomLivreur || (selectedLivreur as any)?.nom_livreur}</strong> ? Cette action archivera le livreur.</>}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            color="error"
            isLoading={deleteLivreur.isPending}
          />
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
