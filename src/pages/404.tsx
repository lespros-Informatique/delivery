import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Home as HomeIcon, Search as SearchIcon } from '@mui/icons-material';

const Page = () => (
  <>
    <Helmet>
      <title>
        Page non trouvée | Woli Delivery
      </title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh'
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            mb: 4,
            '& img': {
              width: '100%',
              maxWidth: 400,
              height: 'auto'
            }
          }}
        >
          <img src="/assets/illustration-not-found.svg" alt="Page non trouvée" />
        </Box>
        
        <Typography
          variant="h4"
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 2
          }}
        >
          Oups ! Page introuvable
        </Typography>
        
        <Typography
          color="text.secondary"
          variant="body1"
          sx={{ mb: 1 }}
        >
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ mb: 4 }}
        >
          Vérifiez l'URL ou retournez à l'accueil.
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ 
              px: 3,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Retour
          </Button>
          
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            component={RouterLink}
            to="/"
            sx={{ 
              px: 3,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(41, 112, 255, 0.3)'
            }}
          >
            Retour à l'accueil
          </Button>
        </Stack>
        
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Erreur 404 • Woli Delivery
          </Typography>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;
