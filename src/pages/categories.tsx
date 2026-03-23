import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
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
    if (action === 'view' || action === 'edit') {
      navigate(`/categories/${row.code_categorie}`);
    } else if (action === 'delete') {
      console.log('Delete', row.code_categorie);
    }
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
              <Button variant="contained" startIcon={<AddIcon />}>
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
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
