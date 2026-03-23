import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockClients } from 'src/data/mock';

// Options d'actions
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_client', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'nom_client', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'telephone_client', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'email_client', 
    headerName: 'EMAIL', 
    flex: 1, 
    minWidth: 180 
  },
  { 
    field: 'created_at_client', 
    headerName: 'DATE CRÉATION', 
    width: 150,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
];

// Page Clients - Liste SIMPLE (lecture seule, pas de gestion)
const Page = () => {
  const navigate = useNavigate();
  const rows = mockClients.map((client) => ({
    ...client,
    statut_client: client.statut_client === 1 ? 'actif' : 'inactif'
  }));

  return (
    <>
      <Helmet>
        <title>Clients | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Clients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Liste des clients
              </Typography>
            </Box>

            {/* DataTable - Liste simple */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              actions={actionOptions}
              onActionClick={(row, action) => {
                if (action === 'view') {
                  navigate(`/clients/${row.code_client}`);
                } else {
                  console.log(action, row);
                }
              }}
              statusColumn={{
                field: 'statut_client',
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
