import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { mockPromotions } from 'src/data/mock';

// Colonnes de configuration
const columns: ColumnConfig[] = [
  { 
    field: 'code_promotion', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'type_promotion', 
    headerName: 'TYPE', 
    width: 130 
  },
  { 
    field: 'valeur', 
    headerName: 'VALEUR', 
    width: 100,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => {
      const type = params.row?.type_promotion as string;
      const value = params.value as number;
      if (type === 'pourcentage') return `${value}%`;
      if (type === 'montant_fixe') return `${Number(value).toLocaleString()} XOF`;
      if (type === 'Livraison_gratuite') return 'GRATUIT';
      return `${value}`;
    }
  },
  { 
    field: 'code_reduction', 
    headerName: 'CODE PROMO', 
    width: 120 
  },
  { 
    field: 'date_debut', 
    headerName: 'DÉBUT', 
    width: 110,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
  { 
    field: 'date_fin', 
    headerName: 'FIN', 
    width: 110,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('fr-FR');
    }
  },
  { 
    field: 'utilisations_actuelles', 
    headerName: 'UTILISATIONS', 
    width: 120,
    align: 'center',
    headerAlign: 'center'
  },
];

// Page Promotions - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  
  const rows = mockPromotions.map((p) => ({
    ...p,
    statut_promotion: p.statut_promotion
  }));

  const actions: ActionOption[] = [
    { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view' },
    { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit' },
    { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete' },
  ];

  const handleActionClick = (row: any, action: string) => {
    if (action === 'view' || action === 'edit') {
      navigate(`/promotions/${row.code_promotion}`);
    } else if (action === 'delete') {
      console.log('Delete', row.code_promotion);
    }
  };

  return (
    <>
      <Helmet>
        <title>Promotions | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Promotions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les promotions
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />}>
                Ajouter une promotion
              </Button>
            </Stack>

            {/* DataTable - ADMIN */}
            <DataTable
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50]}
              statusColumn={{
                field: 'statut_promotion',
                mapping: {
                  active: 'success',
                  desactive: 'error',
                  expiree: 'warning'
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
