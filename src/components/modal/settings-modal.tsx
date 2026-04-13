import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  Chip,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaletteIcon from '@mui/icons-material/Palette';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import RoundedCornerIcon from '@mui/icons-material/RoundedCorner';
import CircleIcon from '@mui/icons-material/Circle';
import AnimationIcon from '@mui/icons-material/Animation';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { ColorPreset, ScaleFactor, BorderRadius, Density, FontFamily, IconStyle, IconColor, useUISettings } from 'src/theme/UISettingsContext';

const COLOR_OPTIONS: { value: ColorPreset; label: string; color: string }[] = [
  { value: 'blue', label: 'Bleu', color: '#1976d2' },
  { value: 'purple', label: 'Violet', color: '#9c27b0' },
  { value: 'teal', label: 'Sarcelle', color: '#009688' },
  { value: 'green', label: 'Vert', color: '#2e7d32' },
  { value: 'orange', label: 'Orange', color: '#ed6c02' },
  { value: 'red', label: 'Rouge', color: '#d32f2f' },
  { value: 'pink', label: 'Rose', color: '#e91e63' },
  { value: 'cyan', label: 'Cyan', color: '#00acc1' },
];

const SCALE_OPTIONS: { value: ScaleFactor; label: string; description: string }[] = [
  { value: 'compact', label: 'Compact', description: 'Réduire tous les éléments' },
  { value: 'normal', label: 'Normal', description: 'Taille par défaut' },
  { value: 'large', label: 'Grand', description: 'Agrandir tous les éléments' },
];

const BORDER_RADIUS_OPTIONS: { value: BorderRadius; label: string; icon: React.ReactNode }[] = [
  { value: 'none', label: 'Carré', icon: <Box sx={{ width: 24, height: 24, border: '2px solid', borderColor: 'currentColor' }} /> },
  { value: 'small', label: 'Petit', icon: <Box sx={{ width: 24, height: 24, border: '2px solid', borderColor: 'currentColor', borderRadius: 2 }} /> },
  { value: 'medium', label: 'Moyen', icon: <Box sx={{ width: 24, height: 24, border: '2px solid', borderColor: 'currentColor', borderRadius: 4 }} /> },
  { value: 'large', label: 'Grand', icon: <Box sx={{ width: 24, height: 24, border: '2px solid', borderColor: 'currentColor', borderRadius: 8 }} /> },
];

const DENSITY_OPTIONS: { value: Density; label: string; description: string }[] = [
  { value: 'compact', label: 'Compact', description: 'Réduire l\'espace entre les éléments' },
  { value: 'comfortable', label: 'Confortable', description: 'Espacement normal' },
];

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'System', label: 'Système' },
];

const ICON_STYLE_OPTIONS: { value: IconStyle; label: string; description: string }[] = [
  { value: 'filled', label: 'Plein', description: 'Icônes remplies' },
  { value: 'outlined', label: 'Contour', description: 'Icônes en contour' },
];

const ICON_COLOR_OPTIONS: { value: IconColor; label: string; description: string }[] = [
  { value: 'primary', label: 'Primaire', description: 'Couleur principale' },
  { value: 'inherit', label: 'Hérité', description: 'Couleur du texte' },
  { value: 'current', label: 'Actuel', description: 'Couleur actuelle' },
];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { primaryColor, setPrimaryColor, scaleFactor, setScaleFactor, borderRadius, setBorderRadius, animations, setAnimations, density, setDensity, fontFamily, setFontFamily, iconStyle, setIconStyle, iconColor, setIconColor } = useUISettings();
  const [tempColor, setTempColor] = useState<ColorPreset>(primaryColor);
  const [tempScale, setTempScale] = useState<ScaleFactor>(scaleFactor);
  const [tempRadius, setTempRadius] = useState<BorderRadius>(borderRadius);
  const [tempAnimations, setTempAnimations] = useState<boolean>(animations);
  const [tempDensity, setTempDensity] = useState<Density>(density);
  const [tempFontFamily, setTempFontFamily] = useState<FontFamily>(fontFamily);
  const [tempIconStyle, setTempIconStyle] = useState<IconStyle>(iconStyle);
  const [tempIconColor, setTempIconColor] = useState<IconColor>(iconColor);

  const handleSave = () => {
    setPrimaryColor(tempColor);
    setScaleFactor(tempScale);
    setBorderRadius(tempRadius);
    setAnimations(tempAnimations);
    setDensity(tempDensity);
    setFontFamily(tempFontFamily);
    setIconStyle(tempIconStyle);
    setIconColor(tempIconColor);
    onClose();
  };

  const handleReset = () => {
    setTempColor('blue');
    setTempScale('normal');
    setTempRadius('medium');
    setTempAnimations(true);
    setTempDensity('comfortable');
    setTempFontFamily('Inter');
    setTempIconStyle('filled');
    setTempIconColor('primary');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PaletteIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Paramètres d&apos;affichage
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={4}>
          {/* Couleur principale */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <PaletteIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Couleur principale
              </Typography>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {COLOR_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onClick={() => setTempColor(option.value)}
                  sx={{
                    bgcolor: tempColor === option.value ? option.color : 'transparent',
                    color: tempColor === option.value ? 'white' : 'text.primary',
                    border: '2px solid',
                    borderColor: tempColor === option.value ? option.color : 'divider',
                    '&:hover': {
                      bgcolor: tempColor === option.value ? option.color : 'action.hover'
                    },
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Échelle */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FormatSizeIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Taille des éléments
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {SCALE_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempScale(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempScale === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempScale === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempScale === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={tempScale === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Arrondi des coins */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <RoundedCornerIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Arrondi des coins
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {BORDER_RADIUS_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempRadius(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempRadius === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempRadius === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempRadius === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ color: tempRadius === option.value ? 'primary.main' : 'text.secondary' }}>
                    {option.icon}
                  </Box>
                  <Typography 
                    variant="caption" 
                    fontWeight={tempRadius === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Animations */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <AnimationIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Animations
              </Typography>
            </Stack>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={tempAnimations} 
                    onChange={(e) => setTempAnimations(e.target.checked)}
                  />
                }
                label={tempAnimations ? 'Activées' : 'Désactivées'}
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                {tempAnimations ? 'Les animations et transitions sont actives' : 'Les animations et transitions sont désactivées'}
              </Typography>
            </Box>
          </Box>

          {/* Densité */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <ViewCompactIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Densité
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {DENSITY_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempDensity(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempDensity === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempDensity === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempDensity === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={tempDensity === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Famille de police */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <TextFieldsIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Famille de police
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {FONT_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempFontFamily(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempFontFamily === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempFontFamily === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontFamily: option.value === 'Inter' ? 'Inter, sans-serif' : option.value === 'Roboto' ? 'Roboto, sans-serif' : 'system-ui',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempFontFamily === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={tempFontFamily === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Style d'icône */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <TextFieldsIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Style d&apos;icône
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {ICON_STYLE_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempIconStyle(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempIconStyle === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempIconStyle === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempIconStyle === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={tempIconStyle === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Couleur d'icône */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <CircleIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={500}>
                Couleur d&apos;icône
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {ICON_COLOR_OPTIONS.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setTempIconColor(option.value)}
                  sx={{
                    flex: 1,
                    p: 2,
                    border: '2px solid',
                    borderColor: tempIconColor === option.value ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: tempIconColor === option.value ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: tempIconColor === option.value ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={tempIconColor === option.value ? 600 : 400}
                  >
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );
};