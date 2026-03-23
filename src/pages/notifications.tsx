import { Helmet } from 'react-helmet-async';
import { Box, Container, Stack, Typography, Chip } from '@mui/material';
import { DataTable, ColumnConfig } from 'src/components/data-table';
import { mockNotifications } from 'src/data/mock';

// Filtres de lecture
const lectureFilters: { label: string; value: string | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Non lues', value: 'non_lues' },
  { label: 'Lues', value: 'lues' },
];

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_notification', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'type_notification', 
    headerName: 'TYPE', 
    width: 100 
  },
  { 
    field: 'titre', 
    headerName: 'TITRE', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'message', 
    headerName: 'MESSAGE', 
    flex: 1, 
    minWidth: 200 
  },
  { 
    field: 'created_at_notification', 
    headerName: 'DATE', 
    width: 160,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleString('fr-FR');
    }
  },
];

// Page Notifications - LISTING (lecture seule)
const Page = () => {
  const rows = mockNotifications.map((n) => ({
    ...n,
    lu: n.lu === 1 ? 'lu' : 'non_lu'
  }));

  return (
    <>
      <Helmet>
        <title>Notifications | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Historique des notifications
              </Typography>
            </Box>

            {/* DataTable - LISTING */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'lu',
                mapping: {
                  non_lu: 'warning',
                  lu: 'default'
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
