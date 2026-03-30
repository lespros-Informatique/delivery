import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  Box, Container, Stack, Typography, Card, Grid, TextField, 
  Button, Avatar, Divider, Switch, FormControlLabel, Alert,
  IconButton, InputAdornment, Tabs, Tab, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from 'src/hooks/useAuth';

// Fonction TabPanel
function TabPanel({ children, value, index }: { children?: React.ReactNode; index: number; value: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Page Profil - Design moderne et épuré
const Page = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    nom: user?.name || 'Admin Woli',
    email: user?.email || 'admin@woli.com',
    telephone: '+225 07 00 00 00 01',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Préférences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    marketingEmails: false,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setIsEditing(false);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (pref: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [pref]: value }));
  };

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    setTimeout(() => {
      setSuccessMessage('Profil mis à jour avec succès');
      setIsEditing(false);
    }, 500);
  };

  const handleSavePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // Simulation de changement de mot de passe
    setTimeout(() => {
      setSuccessMessage('Mot de passe modifié avec succès');
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 500);
  };

  const handleSavePreferences = () => {
    // Simulation de sauvegarde des préférences
    setTimeout(() => {
      setSuccessMessage('Préférences enregistrées avec succès');
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Mon Profil | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Mon Profil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez vos informations personnelles et préférences
              </Typography>
            </Box>

            {/* Message de succès */}
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}

            {/* Navigation par onglets */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab icon={<PersonIcon />} label="Informations" iconPosition="start" />
                <Tab icon={<LockIcon />} label="Sécurité" iconPosition="start" />
                <Tab icon={<NotificationsIcon />} label="Préférences" iconPosition="start" />
              </Tabs>
            </Box>

            {/* Contenu des onglets */}
            <Box>
              {/* Onglet 1: Informations personnelles */}
              <TabPanel value={currentTab} index={0}>
                <Grid container spacing={3}>
                  {/* Avatar et info rapide */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            bgcolor: 'primary.main',
                            fontSize: 40,
                          }}
                        >
                          {formData.nom.charAt(0).toUpperCase()}
                        </Avatar>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {formData.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administrateur
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Annuler' : 'Modifier'}
                      </Button>
                    </Card>
                  </Grid>

                  {/* Formulaire d'édition */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <TextField
                          label="Nom complet"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          disabled={!isEditing}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="Email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          fullWidth
                          type="email"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="Téléphone"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          disabled={!isEditing}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                        {isEditing && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<SaveIcon />}
                              onClick={handleSaveProfile}
                            >
                              Enregistrer
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Onglet 2: Sécurité */}
              <TabPanel value={currentTab} index={1}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <LockIcon color="primary" />
                        </Box>
                        <Box>
                          <Typography variant="h6">Mot de passe</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dernière modification: Il y a 30 jours
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={3}>
                        <TextField
                          label="Mot de passe actuel"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="Nouveau mot de passe"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          fullWidth
                          helperText="Minimum 8 caractères"
                        />
                        <TextField
                          label="Confirmer le mot de passe"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          fullWidth
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                          <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />}
                            onClick={handleSavePassword}
                          >
                            Changer le mot de passe
                          </Button>
                        </Box>
                      </Stack>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'success.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <SecurityIcon color="success" />
                        </Box>
                        <Box>
                          <Typography variant="h6">Sessions actives</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Gérez vos connexions
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle2">Session actuelle</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Chrome sur Windows • Abidjan, Côte d'Ivoire
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="success.main" fontWeight={600}>
                            Actif
                          </Typography>
                        </Stack>
                      </Paper>
                      <Button color="error" fullWidth>
                        Déconnecter toutes les autres sessions
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Onglet 3: Préférences */}
              <TabPanel value={currentTab} index={2}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'warning.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <NotificationsIcon color="warning" />
                        </Box>
                        <Box>
                          <Typography variant="h6">Notifications</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Configurez comment vous êtes notifié
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.emailNotifications}
                              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">Notifications par email</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Recevoir les alertes par email
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.smsNotifications}
                              onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">Notifications SMS</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Recevoir les alertes par SMS
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.pushNotifications}
                              onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">Notifications push</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Recevoir les notifications sur navigateur
                              </Typography>
                            </Box>
                          }
                        />
                      </Stack>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'info.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <AccountCircleIcon color="info" />
                        </Box>
                        <Box>
                          <Typography variant="h6">Communications</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Gérez vos préférences de communication
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.weeklyReport}
                              onChange={(e) => handlePreferenceChange('weeklyReport', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">Rapport hebdomadaire</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Recevoir un résumé hebdomadaire
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.marketingEmails}
                              onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">Emails marketing</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Recevoir les offres et promotions
                              </Typography>
                            </Box>
                          }
                        />
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3 }}>
                        <Button 
                          variant="contained" 
                          startIcon={<SaveIcon />}
                          onClick={handleSavePreferences}
                        >
                          Enregistrer les préférences
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;