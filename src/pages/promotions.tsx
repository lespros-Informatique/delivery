import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { PromotionForm } from 'src/components/forms/promotion-form';
import { mockPromotions } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_promotion', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'type_promotion', 
    headerName: 'TYPE', 
    width: 130 
  },
  { 
    field: 'valeur', 
    headerName: 'VALEUR', 
    width: 100,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => {
      const type = params.row?.type_promotion as string;
      const value = params.value as number;
      if (type === 'pourcentage') return `${value}%`;
      if (type === 'montant_fixe') return `${Number(value).toLocaleString()} XOF`;
      if (type === 'Livraison_gratuite') return 'GRATUIT';
      return `${value}`;
    }
  },
  { 
    field: 'code_reduction', 
    headerName: 'CODE PROMO', 
    width: 120 
  },
  { 
    field: 'date_debut', 
    headerName: 'DÉBUT', 
    width: 110,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
  { 
    field: 'date_fin', 
    headerName: 'FIN', 
    width: 110,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
  { 
    field: 'utilisations_actuelles', 
    headerName: 'UTILISATIONS', 
    width: 120,
    align: 'center',
    headerAlign: 'center'
  },
];

// Page Promotions - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  
  const rows = mockPromotions.map((p) => ({
    ...p,
    statut_promotion: p.statut_promotion
  }));

  const actions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/promotions/${row.code_promotion}`);
    } else if (action === 'edit') {
      setSelectedPromotion(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      console.log('Delete', row.code_promotion);
    }
  };

  const handleOpenModal = () => {
    setSelectedPromotion(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleSubmitPromotion = (data: any) => {
    console.log('Nouvelle promotion:', data);
    handleCloseModal();
  };

  return (
    <>
      <Helmet>
        <title>Promotions | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Promotions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les promotions
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Ajouter une promotion
              </Button>
            </Stack>

            {/* DataTable - ADMIN */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_promotion',
                mapping: {
                  active: 'success',
                  desactive: 'error',
                  expiree: 'warning'
                }
              }}
              actions={actions}
              onActionClick={handleActionClick}
            />

            {/* Modal d'ajout/modification de promotion */}
            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedPromotion ? 'Modifier la promotion' : 'Ajouter une promotion'}
              maxWidth="md"
              size="large"
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedPromotion ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <PromotionForm 
                initialData={selectedPromotion ? {
                  code_promotion: selectedPromotion.code_promotion,
                  restaurant_code: selectedPromotion.restaurant_code,
                  type_promotion: selectedPromotion.type_promotion,
                  valeur: selectedPromotion.valeur,
                  code_reduction: selectedPromotion.code_reduction,
                  date_debut: selectedPromotion.date_debut,
                  date_fin: selectedPromotion.date_fin,
                  utilisations_max: selectedPromotion.utilisations_max,
                  statut_promotion: selectedPromotion.statut_promotion
                } : undefined}
                onSubmit={handleSubmitPromotion}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
