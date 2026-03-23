import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockUsers } from 'src/data/mock';

// Options d'actions
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_user', 
    headerName: 'CODE', 
    width: 100 
  },
  { 
    field: 'nom_user', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'email_user', 
    headerName: 'EMAIL', 
    flex: 1, 
    minWidth: 180 
  },
  { 
    field: 'telephone_user', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'created_at_user', 
    headerName: 'DATE CRÉATION', 
    width: 160,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
];

// Page Utilisateurs - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const rows = mockUsers.map((u) => ({
    ...u,
    etat_users: u.etat_users === 1 ? 'actif' : 'inactif'
  }));

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
              <Button variant="contained" startIcon={<AddIcon />}>
                Ajouter un utilisateur
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
                  navigate(`/users/${row.code_user}`);
                } else {
                  console.log(action, row);
                }
              }}
              statusColumn={{
                field: 'etat_users',
                mapping: {
                  actif: 'success',
                  inactif: 'error'
                }
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
