import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockLivraisons } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_livraison', 
    headerName: 'LIVRAISON', 
    width: 130 
  },
  { 
    field: 'commande_code', 
    headerName: 'COMMANDE', 
    width: 130 
  },
  { 
    field: 'livreur_code', 
    headerName: 'LIVREUR', 
    width: 130 
  },
  { 
    field: 'created_at_livraison', 
    headerName: 'DATE CRÉATION', 
    width: 160,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
  { 
    field: 'updated_at_livraison', 
    headerName: 'DERNIÈRE MISE À JOUR', 
    width: 180,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
];

// Page Livraisons - Liste SIMPLE (suivi des livraisons)
const Page = () => {
  const navigate = useNavigate();
  
  const rows = mockLivraisons.map((l) => ({
    ...l,
    statut_livraison: l.statut_livraison
  }));

  const actions: ActionOption[] = [
    { label: 'Voir détails', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view' || action === 'edit') {
      navigate(`/deliveries/${row.code_livraison}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Livraisons | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Livraisons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suivi des livraisons
              </Typography>
            </Box>

            {/* DataTable - Liste simple */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_livraison',
                mapping: {
                  en_attente: 'default',
                  assignee: 'info',
                  en_cours: 'warning',
                  livree: 'success',
                  annulee: 'error'
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
