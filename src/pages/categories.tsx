import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { CategoryForm } from 'src/components/forms/category-form';
import { mockCategories } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_categorie', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'libelle_categorie', 
    headerName: 'CATÉGORIE', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'restaurant_code', 
    headerName: 'RESTAURANT', 
    width: 130 
  },
  { 
    field: 'updated_at_categorie', 
    headerName: 'DERNIÈRE MISE À JOUR', 
    width: 180,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
];

// Page Catégories - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const rows = mockCategories.map((c) => ({
    ...c,
    statut_categorie: c.statut_categorie === 1 ? 'active' : 'inactive'
  }));

  const actions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/categories/${row.code_categorie}`);
    } else if (action === 'edit') {
      setSelectedCategory(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      console.log('Delete', row.code_categorie);
    }
  };

  const handleOpenModal = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmitCategory = (data: any) => {
    console.log('Nouvelle catégorie:', data);
    handleCloseModal();
  };

  return (
    <>
      <Helmet>
        <title>Catégories | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Catégories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez vos catégories
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Ajouter une catégorie
              </Button>
            </Stack>

            {/* DataTable - ADMIN */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_categorie',
                mapping: {
                  active: 'success',
                  inactive: 'error'
                }
              }}
              actions={actions}
              onActionClick={handleActionClick}
            />

            {/* Modal d'ajout/modification de catégorie */}
            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedCategory ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <CategoryForm 
                initialData={selectedCategory ? {
                  code_categorie: selectedCategory.code_categorie,
                  restaurant_code: selectedCategory.restaurant_code,
                  libelle_categorie: selectedCategory.libelle_categorie,
                  statut_categorie: selectedCategory.statut_categorie === 'active'
                } : undefined}
                onSubmit={handleSubmitCategory}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
