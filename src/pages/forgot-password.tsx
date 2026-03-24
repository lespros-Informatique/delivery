import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Box, Container, Card, CardContent, TextField, Button, Typography, 
  InputAdornment, Alert, CircularProgress, Link
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simuler l'envoi de l'email
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email) {
      setSubmitted(true);
    } else {
      setError('Veuillez entrer votre adresse email');
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Email envoyé | Woli Delivery</title>
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
          }}
        >
          <Container maxWidth="sm">
            <Card
              sx={{ 
                maxWidth: 440, 
                mx: 'auto',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    mb: 3,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Email envoyé !
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Nous avons envoyé un lien de réinitialisation à <br/>
                  <strong>{email}</strong>
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/login')}
                  fullWidth
                >
                  Retour à la connexion
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mot de passe oublié | Woli Delivery</title>
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
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box 
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
              }}
            >
              <DeliveryDiningIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              sx={{ 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Woli Delivery
            </Typography>
          </Box>

          <Card
            sx={{ 
              maxWidth: 440, 
              mx: 'auto',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Mot de passe oublié ?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="medium"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="votre@email.com"
                />

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
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Envoyer le lien'
                  )}
                </Button>
              </form>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Retour à la connexion
                </Link>
              </Box>
            </CardContent>
          </Card>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mt: 4 }}
          >
            © 2026 Woli Delivery. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
