import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button, Card, Chip, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { RestaurantForm } from 'src/components/forms/restaurant-form';
import { restaurantsService, Restaurant } from 'src/lib/api';

// Options d'actions pour la liste des restaurants
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Filtres de statut
const statutFilters: { label: string; value: string | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Actifs', value: 'actif' },
  { label: 'Inactifs', value: 'inactif' },
];

// Colonnes de configuration -适配后端API字段
const columns: ColumnConfig[] = [
  { 
    field: 'codeRestaurant', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'nomRestaurant', 
    headerName: 'RESTAURANT', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'addressRestaurant', 
    headerName: 'ADRESSE', 
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
    field: 'telephoneRestaurant', 
    headerName: 'TÉLÉPHONE', 
    width: 130 
  },
];

// Page Restaurants - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les restaurants depuis l'API
  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await restaurantsService.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setRestaurants(response.data.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des restaurants');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Préparer les données pour le DataTable
  const rowsWithStatus = restaurants.map((r) => ({
    ...r,
    etat_restaurant: r.active ? 'actif' : 'inactif'
  }));

  // Filtrer les restaurants selon le filtre de statut
  const filteredRows = filter === 'all' 
    ? rowsWithStatus 
    : rowsWithStatus.filter(r => r.etat_restaurant === filter);

  // Gestionnaire de clic sur les actions
  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/restaurants/${row.codeRestaurant}`);
    } else if (action === 'edit') {
      setSelectedRestaurant(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      handleDelete(row.id);
    }
  };

  // Supprimer un restaurant
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant?')) {
      try {
        const response = await restaurantsService.delete(id);
        if (response.success) {
          loadRestaurants();
        } else {
          setError(response.message || 'Erreur lors de la suppression');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleOpenModal = () => {
    setSelectedRestaurant(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRestaurant(null);
  };

  // Soumission du formulaire
  const handleSubmitRestaurant = async (data: any) => {
    try {
      if (selectedRestaurant) {
        // Modifier un restaurant existant
        const response = await restaurantsService.update(selectedRestaurant.id, data);
        if (response.success) {
          handleCloseModal();
          loadRestaurants();
        } else {
          setError(response.message || 'Erreur lors de la modification');
        }
      } else {
        // Créer un nouveau restaurant
        const response = await restaurantsService.create(data);
        if (response.success) {
          handleCloseModal();
          loadRestaurants();
        } else {
          setError(response.message || 'Erreur lors de la création');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'opération');
    }
  };

  return (
    <>
      <Helmet>
        <title>Restaurants | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* En-tête avec bouton Ajouter */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Restaurants
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez les restaurants
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Ajouter un restaurant
              </Button>
            </Stack>

            {/* Message d'erreur */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Filtres */}
            <Card sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {statutFilters.map((statut) => (
                  <Chip
                    key={statut.value}
                    label={statut.label}
                    onClick={() => setFilter(statut.value)}
                    color={filter === statut.value ? 'primary' : 'default'}
                    variant={filter === statut.value ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Card>

            {/* Indicateur de chargement */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              /* DataTable - ADMIN */
              <DataTable
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                actions={actionOptions}
                onActionClick={handleActionClick}
                statusColumn={{
                  field: 'etat_restaurant',
                  mapping: {
                    actif: 'success',
                    inactif: 'error'
                  }
                }}
              />
            )}

            {/* Modal d'ajout/modification de restaurant */}
            <FormModal
              open={modalOpen}
              onClose={handleCloseModal}
              title={selectedRestaurant ? 'Modifier le restaurant' : 'Ajouter un restaurant'}
              maxWidth="md"
              size="large"
              actions={
                <>
                  <Button onClick={handleCloseModal} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedRestaurant ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <RestaurantForm 
                initialData={selectedRestaurant ? {
                  code_restaurant: selectedRestaurant.codeRestaurant,
                  libelle_restaurant: selectedRestaurant.nomRestaurant,
                  adresse_restaurant: selectedRestaurant.addressRestaurant,
                  ville_code: selectedRestaurant.Ville?.nomVille,
                  telephone_restaurant: selectedRestaurant.telephoneRestaurant,
                  email_restaurant: selectedRestaurant.emailRestaurant,
                  logo_restaurant: selectedRestaurant.imageRestaurant,
                  etat_restaurant: selectedRestaurant.active
                } : undefined}
                onSubmit={handleSubmitRestaurant}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
