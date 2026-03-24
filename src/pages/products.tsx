import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Grid, Card, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { ProductForm } from 'src/components/forms/product-form';
import { mockProduits, mockCategories } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_produit', 
    headerName: 'CODE', 
    width: 100 
  },
  { 
    field: 'libelle_produit', 
    headerName: 'PRODUIT', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'description_produit', 
    headerName: 'DESCRIPTION', 
    flex: 1, 
    minWidth: 200 
  },
  { 
    field: 'prix_produit', 
    headerName: 'PRIX', 
    width: 100,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'categorie_code', 
    headerName: 'CATÉGORIE', 
    width: 130 
  },
];

// Page Produits - ADMIN (avec bouton ajouter, modifier, supprimer)
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const rows = mockProduits.map((p) => ({
    ...p,
    disponible_produit: p.disponible_produit === 1 ? 'Disponible' : 'Indisponible',
    etat_produit: p.etat_produit === 1 ? 'actif' : 'inactif'
  }));

  const actionOptions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/products/${row.code_produit}`);
    } else if (action === 'edit') {
      setSelectedProduct(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      console.log('Delete', row.code_produit);
    }
  };

  const handleOpenModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitProduct = (data: any) => {
    console.log('Nouveau produit:', data);
    // Ici vous ajoutez la logique pour ajouter le produit
    handleCloseModal();
  };

  return (
    <>
      <Helmet>
        <title>Produits | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Produits
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez vos produits
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Ajouter un produit
              </Button>
            </Stack>

            {/* Catégories */}
            <Card sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {mockCategories.map((categorie) => (
                  <Chip
                    key={categorie.id_categorie}
                    label={categorie.libelle_categorie}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Card>

            {/* DataTable - ADMIN avec gestion */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'disponible_produit',
                mapping: {
                  'Disponible': 'success',
                  'Indisponible': 'error'
                }
              }}
              actions={actionOptions}
              onActionClick={handleActionClick}
            />

            {/* Modal d'ajout/modification de produit */}
            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              maxWidth="md"
              size="large"
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedProduct ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <ProductForm 
                initialData={selectedProduct ? {
                  code_produit: selectedProduct.code_produit,
                  restaurant_code: selectedProduct.restaurant_code,
                  categorie_code: selectedProduct.categorie_code,
                  libelle_produit: selectedProduct.libelle_produit,
                  description_produit: selectedProduct.description_produit,
                  prix_produit: selectedProduct.prix_produit,
                  image_produit: selectedProduct.image_produit,
                  disponible_produit: selectedProduct.disponible_produit === 'Disponible',
                  etat_produit: selectedProduct.etat_produit === 'actif'
                } : undefined}
                onSubmit={handleSubmitProduct}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
