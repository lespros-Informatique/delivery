import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography, CircularProgress, Alert, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { LivreurForm } from 'src/components/forms/livreur-form';
import { livreursService, Livreur } from 'src/lib/api';

// Options d'actions pour la liste des livreurs
const actionOptions: ActionOption[] = [
  { label: 'Voir', icon: <VisibilityIcon fontSize="small" />, action: 'view', color: 'primary' },
  { label: 'Modifier', icon: <EditIcon fontSize="small" />, action: 'edit', color: 'info' },
  { label: 'Supprimer', icon: <DeleteIcon fontSize="small" />, action: 'delete', color: 'error' },
];

// Colonnes de configuration -适配后端API字段
const columns: ColumnConfig[] = [
  { 
    field: 'codeLivreur', 
    headerName: 'CODE', 
    width: 120 
  },
  { 
    field: 'nomLivreur', 
    headerName: 'NOM', 
    flex: 1, 
    minWidth: 150 
  },
  { 
    field: 'telephoneLivreur', 
    headerName: 'TÉLÉPHONE', 
    width: 150 
  },
  { 
    field: 'Ville', 
    headerName: 'VILLE', 
    width: 130,
    valueFormatter: (value: any) => value?.nomVille || '-'
  },
  { 
    field: 'disponible', 
    headerName: 'DISPONIBLE', 
    width: 120,
    valueFormatter: (value: any) => value ? 'Oui' : 'Non'
  },
  { 
    field: 'createdAt', 
    headerName: 'DATE CRÉATION', 
    width: 160,
    valueFormatter: (value: any) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('fr-FR');
    }
  },
];

// Page Livreurs - ADMIN (avec bouton ajouter)
const Page = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState<Livreur | null>(null);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les livreurs depuis l'API
  const loadLivreurs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await livreursService.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setLivreurs(response.data.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des livreurs');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLivreurs();
  }, [loadLivreurs]);

  // Préparer les données pour le DataTable
  const rows = livreurs.map((l) => ({
    ...l,
    statut_livreurs: l.active ? 'actif' : 'inactif'
  }));

  // Gestionnaire de clic sur les actions
  const handleActionClick = (row: any, action: string) => {
    if (action === 'view') {
      navigate(`/livreurs/${row.codeLivreur}`);
    } else if (action === 'edit') {
      setSelectedLivreur(row);
      setModalOpen(true);
    } else if (action === 'delete') {
      handleDelete(row.id);
    }
  };

  // Supprimer un livreur
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livreur?')) {
      try {
        const response = await livreursService.delete(id);
        if (response.success) {
          loadLivreurs();
        } else {
          setError(response.message || 'Erreur lors de la suppression');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (data: any) => {
    try {
      if (selectedLivreur) {
        // Modifier un livreur existant
        const response = await livreursService.update(selectedLivreur.id, data);
        if (response.success) {
          setModalOpen(false);
          setSelectedLivreur(null);
          loadLivreurs();
        } else {
          setError(response.message || 'Erreur lors de la modification');
        }
      } else {
        // Créer un nouveau livreur
        const response = await livreursService.create(data);
        if (response.success) {
          setModalOpen(false);
          loadLivreurs();
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
        <title>Livreurs | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
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
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
                Ajouter un livreur
              </Button>
            </Stack>

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
              /* DataTable - ADMIN */
              <DataTable
                rows={rows}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                actions={actionOptions}
                onActionClick={handleActionClick}
                statusColumn={{
                  field: 'statut_livreurs',
                  mapping: {
                    actif: 'success',
                    inactif: 'error'
                  }
                }}
              />
            )}

            {/* Modal d'ajout/modification de livreur */}
            <FormModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedLivreur(null);
              }}
              title={selectedLivreur ? 'Modifier le livreur' : 'Ajouter un livreur'}
              maxWidth="md"
              actions={
                <>
                  <Button onClick={() => {
                    setModalOpen(false);
                    setSelectedLivreur(null);
                  }} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedLivreur ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <LivreurForm 
                initialData={selectedLivreur ? {
                  code_livreur: selectedLivreur.codeLivreur,
                  nom_livreur: selectedLivreur.nomLivreur,
                  telephone_livreur: selectedLivreur.telephoneLivreur,
                  email_livreur: selectedLivreur.emailLivreur,
                  statut_livreurs: selectedLivreur.active
                } : undefined}
                onSubmit={handleSubmit}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
