import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockLivreurs } from 'src/data/mock';
import { PageContainer } from 'src/components/page-container';

// Options d'actions
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_livreur', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'nom_livreur', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'telephone_livreur', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'restaurant_code', 
    headerName: 'RESTAURANT', 
    width: 130 
  },
  { 
    field: 'created_at_livreur', 
    headerName: 'DATE CRÉATION', 
    width: 160,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
];

// Page Livreurs - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  
  const rows = mockLivreurs.map((l, index) => ({
    ...l,
    id: l.id_livreur || index,
    statut_livreurs: l.statut_livreurs === 1 ? 'actif' : 'inactif'
  }));

  return (
    <>
      <Helmet>
        <title>Livreurs | Woli Delivery</title>
      </Helmet>
      <PageContainer>
        <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Livreurs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez vos livreurs
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Ajouter un livreur
              </Button>
            </Stack>

            {/* DataTable - ADMIN */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              actions={actionOptions}
              onActionClick={(row, action) => {
                if (action === 'view') {
                  navigate(`/livreurs/${row.code_livreur}`);
                } else {
                  console.log(action, row);
                }
              }}
              statusColumn={{
                field: 'statut_livreurs',
                mapping: {
                  actif: 'success',
                  inactif: 'error'
                }
              }}
            />
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
