import { Helmet } from 'react-helmet-async';
import { Settings, FileText, Home, ShoppingCart, Star } from 'lucide-react';
import { Box, Card, Container, Link, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { ReactElement } from 'react';

const icons: ReactElement[] = [
  <Settings />,
  <FileText />,
  <Home />,
  <ShoppingCart />,
  <Star />
];

const Page = () => (
  <>
    <Helmet>
      <title>
        Icons | Carpatin Free
      </title>
    </Helmet>
    <Box
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Icons
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{ xs: 12, md: 4 }}
              >
                <Stack spacing={1}>
                  <Typography variant="h6">
                    Hero Icons
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    We use
                    {' '}
                    <Link
                      color="primary"
                      href="https://heroicons.com"
                      target="_blank"
                      variant="inherit"
                    >
                      Hero Icons
                    </Link>
                    {' '}
                    for displaying icons as we think it reflects the clean
                    and light style of the Carpatin Design System.
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                size={{ xs: 12, md: 8 }}
              >
                <Card>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                    sx={{ p: 3 }}
                  >
                    {icons.map((icon, index) => (
                      <SvgIcon
                        key={index}
                        sx={{ color: 'neutral.600' }}
                      >
                        {icon}
                      </SvgIcon>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

export default Page;
