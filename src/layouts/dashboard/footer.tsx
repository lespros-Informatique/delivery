import { Box, Container, Link, Typography } from '@mui/material';

interface FooterLink {
  label: string;
  href: string;
}

const items: FooterLink[] = [
  {
    label: 'A Propos de Nous',
    href: 'https://devias.io/about-us'
  },
  {
    label: 'Terms',
    href: 'https://devias.io/legal/tos'
  }
];

export const Footer = () => (
  <div>
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        },
        py: 3,
        '& a': {
          mt: {
            xs: 1,
            sm: 0
          },
          '&:not(:last-child)': {
            mr: {
              xs: 0,
              sm: 5
            }
          }
        }
      }}
    >
      <Typography color="text.secondary" variant="caption">
        © 2026 Delivery, distributed by
        <Link ml={0.5} href="#">
          Woli
        </Link>
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {items.map((link) => (
        <Link
          color="text.secondary"
          href={link.href}
          key={link.label}
          target="_blank"
          underline="none"
          variant="body2"
        >
          {link.label}
        </Link>
      ))}
    </Container>
  </div>
);
