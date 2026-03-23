import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Grid, Card, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
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
      navigate(`/products/${row.code_produit}`);
    } else if (action === 'delete') {
      console.log('Delete', row.code_produit);
    }
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
              <Button variant="contained" startIcon={<AddIcon />}>
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
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
