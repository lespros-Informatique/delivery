import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Button, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { PageContainer } from 'src/components/page-container';
import { AsyncPage } from 'src/components/AsyncPage';
import { FormModal } from 'src/components/modal/form-modal';
import { ProductForm } from 'src/components/forms/product-form';
import { productsService, type Product } from 'src/lib/api';
import { useApiList } from 'src/hooks/useApiList';
import { useApiPagination } from 'src/hooks/useApiPagination';
import { useApiMutation } from 'src/hooks/useApiMutation';

/**
 * Page Produits - Liste Réelle
 * ===========================================
 * Migration effectuée : Mocks -> API Réelle + React Query
 */
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination
  const { page, limit, onPageChange, onLimitChange } = useApiPagination(1, 10);

  // Fetching
  const { data: response, isLoading, error, refetch } = useApiList<Product>(
    'produits',
    (params) => productsService.getAll(params),
    { page, limit }
  );

  const data = response?.data || [];

  // Mutations
  const createProduct = useApiMutation(
    (newData: any) => productsService.create(newData),
    {
      onSuccess: () => {
        refetch();
        handleCloseModal();
      }
    }
  );

  const updateProduct = useApiMutation(
    (updateData: { code: string; data: any }) => productsService.update(updateData.code, updateData.data),
    {
      onSuccess: () => {
        refetch();
        handleCloseModal();
      }
    }
  );

  const deleteProduct = useApiMutation(
    (code: string) => productsService.delete(code),
    {
      onSuccess: () => refetch()
    }
  );

  // Actions
  const actionOptions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" color="error" />, action: 'delete', color: 'error' },
  ];

  const handleActionClick = (row: Record<string, unknown>, action: string) => {
    const product = row as unknown as Product;
    if (action === 'view') {
      navigate(`/products/${product.codeProduit}`);
    } else if (action === 'edit') {
      setSelectedProduct(product);
      setModalOpen(true);
    } else if (action === 'delete') {
      if (window.confirm(`Voulez-vous vraiment supprimer le produit ${product.libelleProduit} ?`)) {
        deleteProduct.mutate(product.codeProduit);
      }
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

  const handleSubmitProduct = (formData: any) => {
    if (selectedProduct) {
      updateProduct.mutate({ code: selectedProduct.codeProduit, data: formData });
    } else {
      createProduct.mutate(formData);
    }
  };

  // Columns configuration (camelCase from Mapper)
  const columns: ColumnConfig[] = [
    {
      field: 'codeProduit',
      headerName: 'CODE',
      width: 100
    },
    {
      field: 'libelleProduit',
      headerName: 'PRODUIT',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'prixProduit',
      headerName: 'PRIX',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '0 XOF',
    },
    {
      field: 'descriptionProduit',
      headerName: 'DESCRIPTION',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical'
        }}>
          {params.value as string}
        </Typography>
      )
    },
    {
      field: 'disponibleProduit',
      headerName: 'DISPONIBILITÉ',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Disponible' : 'Stock épuisé'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Produits | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Produits
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestion du catalogue produits
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
              Nouveau produit
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
              loading={isLoading || deleteProduct.isPending}
            />

            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              maxWidth="md"
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <LoadingButton variant="contained" type="submit" form="modal-form" loading={createProduct.isPending || updateProduct.isPending}>
                    {selectedProduct ? 'Enregistrer' : 'Ajouter'}
                  </LoadingButton>
                </>
              }
            >
              <ProductForm
                initialData={selectedProduct || undefined}
                onSubmit={handleSubmitProduct}
              />
            </FormModal>
          </AsyncPage>
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
