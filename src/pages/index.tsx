import { Helmet } from 'react-helmet-async';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Avatar, Box, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { OverviewKpi } from 'src/sections/overview/overview-kpi';
import { OverviewLatestCustomers } from 'src/sections/overview/overview-latest-customers';
import { OverviewSummary } from 'src/sections/overview/overview-summary';
import { mockCustomers } from 'src/data/mock/customers';

const Page = () => (
  <>
    <Helmet>
      <title>
        Overview | Carpatin Free
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
              Reports
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
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <ShoppingBagIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Orders'
                  value='5610'
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
              >
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <ShoppingCartIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Products'
                  value='23'
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
              >
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <AttachMoneyIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Transactions'
                  value='1942'
                />
              </Grid>
              <Grid size={12}>
                <OverviewKpi
                  chartSeries={[
                    {
                      data: [0, 20, 40, 30, 30, 44, 90],
                      name: 'Revenue'
                    }
                  ]}
                  stats={[
                    {
                      label: 'Revenue',
                      value: '$4,800.00'
                    },
                    {
                      label: 'NET',
                      value: '$4,900,24'
                    },
                    {
                      label: 'Pending orders',
                      value: '$1,600.50'
                    },
                    {
                      label: 'Due',
                      value: '$6,900.10'
                    },
                    {
                      label: 'Overdue',
                      value: '$6,500.80'
                    }
                  ]}
                />
              </Grid>
              <Grid size={12}>
                <OverviewLatestCustomers
                  customers={mockCustomers}
                />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

export default Page;
