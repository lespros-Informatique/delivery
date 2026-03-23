import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  Box, Button, Card, Container, Divider, FormControlLabel, 
  Grid, IconButton, MenuItem, Stack, Switch, TextField, 
  Typography, Alert, Tabs, Tab, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Types pour les settings
interface SettingsPlatform {
  id_setting: number;
  code_setting: string;
  valeur: string | null;
  description: string;
}

interface SettingsRestaurant {
  id_setting: number;
  restaurant_code: string;
  code_setting: string;
  valeur_settings_restaurant: string;
}

// Paramètres plateforme
const defaultPlatformSettings: SettingsPlatform[] = [
  { id_setting: 1, code_setting: 'PLATFORM_NAME', valeur: 'Woli Delivery', description: 'Nom de la plateforme' },
  { id_setting: 2, code_setting: 'PLATFORM_EMAIL', valeur: 'contact@woli.com', description: 'Email de contact' },
  { id_setting: 3, code_setting: 'PLATFORM_PHONE', valeur: '+225 07 00 00 00 00', description: 'Téléphone' },
  { id_setting: 4, code_setting: 'DEFAULT_DELIVERY_FEE', valeur: '500', description: 'Frais de livraison (XOF)' },
  { id_setting: 5, code_setting: 'DEFAULT_COMMISSION_RATE', valeur: '10', description: 'Commission (%)' },
  { id_setting: 6, code_setting: 'MIN_ORDER_AMOUNT', valeur: '1000', description: 'Montant minimum commande' },
];

// Paramètres restaurants
const restaurantSettingsData: SettingsRestaurant[] = [
  { id_setting: 1, restaurant_code: 'Le Délice Africain', code_setting: 'OPENING_HOURS', valeur_settings_restaurant: '08:00 - 22:00' },
  { id_setting: 2, restaurant_code: 'Le Délice Africain', code_setting: 'DELIVERY_ZONE', valeur_settings_restaurant: 'Cocody, Marcory, Treichville' },
  { id_setting: 3, restaurant_code: 'Le Délice Africain', code_setting: 'MIN_ORDER_FREE', valeur_settings_restaurant: '5 000 XOF' },
  { id_setting: 4, restaurant_code: 'Pizza Italia', code_setting: 'OPENING_HOURS', valeur_settings_restaurant: '09:00 - 21:00' },
  { id_setting: 5, restaurant_code: 'Pizza Italia', code_setting: 'DELIVERY_ZONE', valeur_settings_restaurant: 'Plateau, Abobo' },
];

// Fonction TabPanel
function TabPanel({ children, value, index }: { children?: React.ReactNode; index: number; value: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Page Paramètres - Design épuré
const Page = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [platformSettings, setPlatformSettings] = useState<SettingsPlatform[]>(defaultPlatformSettings);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSave = (codeSetting: string) => {
    setPlatformSettings(prev => prev.map(s => 
      s.code_setting === codeSetting ? { ...s, valeur: editValue } : s
    ));
    setEditingKey(null);
    setEditValue('');
  };

  const handleStartEdit = (setting: SettingsPlatform) => {
    setEditingKey(setting.code_setting);
    setEditValue(setting.valeur || '');
  };

  return (
    <>
      <Helmet>
        <title>Paramètres | Woli Delivery</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* En-tête */}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Paramètres
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configurez votre plateforme
              </Typography>
            </Box>

            {/* Navigation par onglets */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Plateforme" />
                <Tab label="Restaurants" />
                <Tab label="Commissions" />
              </Tabs>
            </Box>

            {/* Contenu des onglets */}
            <Box>
              {/* Onglet 1: Plateforme */}
              <TabPanel value={currentTab} index={0}>
                <Grid container spacing={3}>
                  {platformSettings.map((setting) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={setting.id_setting}>
                      <Box sx={{ 
                        p: 2.5, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                      }}>
                        <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                          {setting.description}
                        </Typography>
                        
                        {editingKey === setting.code_setting ? (
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                            <Button variant="contained" size="small" onClick={() => handleSave(setting.code_setting)}>
                              OK
                            </Button>
                            <Button variant="text" size="small" onClick={() => setEditingKey(null)}>
                              Annuler
                            </Button>
                          </Stack>
                        ) : (
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {setting.valeur}
                            </Typography>
                            <IconButton size="small" onClick={() => handleStartEdit(setting)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Onglet 2: Restaurants */}
              <TabPanel value={currentTab} index={1}>
                <Box sx={{ mb: 2 }}>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Ajouter paramètre
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {restaurantSettingsData.map((setting, index) => (
                    <Card key={index} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <StoreIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {setting.code_setting}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {setting.restaurant_code}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h6" color="primary.main">
                          {setting.valeur_settings_restaurant}
                        </Typography>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Card>
                  ))}
                </Box>
              </TabPanel>

              {/* Onglet 3: Commissions */}
              <TabPanel value={currentTab} index={2}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <AttachMoneyIcon color="primary" />
                        <Typography variant="h6">Commission</Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={3}>
                        <TextField label="Taux (%)" type="number" defaultValue={10} fullWidth />
                        <TextField label="Type" select fullWidth defaultValue="pourcentage">
                          <MenuItem value="pourcentage">Pourcentage</MenuItem>
                          <MenuItem value="fixe">Fixe</MenuItem>
                        </TextField>
                        <FormControlLabel control={<Switch defaultChecked />} label="Activer" />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <LocalShippingIcon color="primary" />
                        <Typography variant="h6">Livraison</Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={3}>
                        <TextField label="Frais (XOF)" type="number" defaultValue={500} fullWidth />
                        <TextField label="Distance max (km)" type="number" defaultValue={50} fullWidth />
                        <TextField label="Montant min gratuit (XOF)" type="number" defaultValue={5000} fullWidth />
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<SaveIcon />} size="large">
                    Enregistrer
                  </Button>
                </Box>
              </TabPanel>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
