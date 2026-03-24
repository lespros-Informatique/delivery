import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { LivreurForm } from 'src/components/forms/livreur-form';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState<any>(null);
  
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
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
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
                } else if (action === 'edit') {
                  setSelectedLivreur(row);
                  setModalOpen(true);
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

            {/* Modal d'ajout/modification de livreur */}
            <FormModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title={selectedLivreur ? 'Modifier le livreur' : 'Ajouter un livreur'}
              maxWidth="md"
              actions={
                <>
                  <Button onClick={() => setModalOpen(false)} color="inherit">
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
                  code_livreur: selectedLivreur.code_livreur,
                  nom_livreur: selectedLivreur.nom_livreur,
                  prenom_livreur: selectedLivreur.prenom_livreur,
                  telephone_livreur: selectedLivreur.telephone_livreur,
                  email_livreur: selectedLivreur.email_livreur,
                  restaurant_code: selectedLivreur.restaurant_code,
                  moyen_transport: selectedLivreur.moyen_transport,
                  plaque_vehicule: selectedLivreur.plaque_vehicule,
                  statut_livreurs: selectedLivreur.statut_livreurs === 'actif'
                } : undefined}
                onSubmit={(data) => {
                  console.log('Nouveau livreur:', data);
                  setModalOpen(false);
                  setSelectedLivreur(null);
                }}
              />
            </FormModal>
        </Stack>
      </PageContainer>
    </>
  );
};

export default Page;
