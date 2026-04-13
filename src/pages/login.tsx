import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Box, Container, Card, CardContent, TextField, Button, Typography, 
  InputAdornment, IconButton, Alert, CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useAuth } from 'src/hooks/useAuth';
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success.success) {
      navigate(from, { replace: true });
    } else {
      setError(success.message || 'Email ou mot de passe incorrect');
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Connexion | Woli Delivery</title>
      </Helmet>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
          py: 4,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 30% 30%, rgba(76, 175, 80, 0.08) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(76, 175, 80, 0.05) 0%, transparent 40%)',
            animation: 'float 20s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-2%, -2%)' },
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            {/* <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 80, 
                height: 80, 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                mb: 2.5,
                boxShadow: '0 12px 40px rgba(34, 197, 94, 0.35)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <DeliveryDiningIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box> */}
            {/* <Typography 
              variant="h3" 
              fontWeight={700} 
              sx={{ 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              Woli Delivery
            </Typography> */}
            {/* <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Gestion de votre plateforme de livraison
            </Typography> */}
          </Box>

          <Card
            sx={{ 
              maxWidth: 440, 
              mx: 'auto',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Bon retour
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Connectez-vous pour continuer
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="medium"
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="votre@email.com"
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="medium"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon sx={{ fontSize: 20, color: 'grey.400' }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 20, color: 'grey.400' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="••••••••"
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Typography 
                    variant="body2" 
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{ 
                      color: 'primary.main', 
                      cursor: 'pointer', 
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                  >
                    Mot de passe oublié ?
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      boxShadow: '0 12px 28px rgba(34, 197, 94, 0.45)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      opacity: 0.7,
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mt: 4, fontWeight: 500 }}
          >
            © 2026 Woli Delivery. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
