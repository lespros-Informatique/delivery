import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { clientsService, Client } from 'src/lib/api';

// Options d'actions pour la liste des clients
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration -适配后端API字段
const columns: ColumnConfig[] = [
  { 
    field: 'codeClient', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'nomClient', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'telephoneClient', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'emailClient', 
    headerName: 'EMAIL', 
    flex: 1, 
    minWidth: 180 
  },
  { 
    field: 'Ville', 
    headerName: 'VILLE', 
    width: 120,
    valueFormatter: (value: any) => value?.nomVille || '-'
  },
  { 
    field: 'createdAt', 
    headerName: 'DATE CRÉATION', 
    width: 150,
    valueFormatter: (value: any) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('fr-FR');
    }
  },
];

// Page Clients - Liste SIMPLE (lecture seule, pas de gestion)
const Page = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les clients depuis l'API
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clientsService.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setClients(response.data.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des clients');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Préparer les données pour le DataTable
  const rows = clients.map((client) => ({
    ...client,
    statut_client: client.active ? 'actif' : 'inactif'
  }));

  // Gestionnaire de clic sur les actions
  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/clients/${row.codeClient}`);
    } else if (action === 'edit') {
      // TODO: Open edit modal
      console.log('Edit:', row);
    } else if (action === 'delete') {
      handleDelete(row.id);
    }
  };

  // Supprimer un client
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
      try {
        const response = await clientsService.delete(id);
        if (response.success) {
          loadClients();
        } else {
          setError(response.message || 'Erreur lors de la suppression');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

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

            {/* Message d'erreur */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Indicateur de chargement */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              /* DataTable - Liste simple */
              <DataTable
                rows={rows}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                actions={actionOptions}
                onActionClick={handleActionClick}
                statusColumn={{
                  field: 'statut_client',
                  mapping: {
                    actif: 'success',
                    inactif: 'error'
                  }
                }}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
