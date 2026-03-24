import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnConfig, ActionOption } from 'src/components/data-table';
import { FormModal } from 'src/components/modal/form-modal';
import { UserForm } from 'src/components/forms/user-form';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
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
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
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
                } else if (action === 'edit') {
                  setSelectedUser(row);
                  setModalOpen(true);
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

            {/* Modal d'ajout/modification d'utilisateur */}
            <FormModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title={selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              actions={
                <>
                  <Button onClick={() => setModalOpen(false)} color="inherit">
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit" form="modal-form">
                    {selectedUser ? 'Modifier' : 'Ajouter'}
                  </Button>
                </>
              }
            >
              <UserForm 
                initialData={selectedUser ? {
                  code_user: selectedUser.code_user,
                  nom_user: selectedUser.nom_user,
                  prenom_user: selectedUser.prenom_user,
                  email_user: selectedUser.email_user,
                  telephone_user: selectedUser.telephone_user,
                  etat_users: selectedUser.etat_users === 'actif'
                } : undefined}
                onSubmit={(data) => {
                  console.log('Nouvel utilisateur:', data);
                  setModalOpen(false);
                  setSelectedUser(null);
                }}
              />
            </FormModal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
