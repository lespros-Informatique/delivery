import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockPaiements } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_paiement', 
    headerName: 'PAIEMENT', 
    width: 120 
  },
  { 
    field: 'commande_code', 
    headerName: 'COMMANDE', 
    width: 120 
  },
  { 
    field: 'methode_paiement', 
    headerName: 'MÉTHODE', 
    width: 140 
  },
  { 
    field: 'montant_paiement', 
    headerName: 'MONTANT', 
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => value ? `${Number(value).toLocaleString()} XOF` : '',
  },
  { 
    field: 'reference_externe', 
    headerName: 'RÉFÉRENCE', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'created_at_paiement', 
    headerName: 'DATE', 
    width: 160,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
];

// Page Paiements - Liste SIMPLE (lecture seule)
const Page = () => {
  const navigate = useNavigate();
  
  const rows = mockPaiements.map((p) => ({
    ...p,
    statut_paiement: p.statut_paiement
  }));

  const actions: ActionOption[] = [
    { label: 'Voir détails', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/payments/${row.code_paiement}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Paiements | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Paiements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Historique des transactions
              </Typography>
            </Box>

            {/* DataTable - Liste simple */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_paiement',
                mapping: {
                  en_attente: 'warning',
                  valide: 'success',
                  echoue: 'error'
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
