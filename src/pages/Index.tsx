import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Link,
  Button,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Index() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 4,
          }}
        >
          Welcome to DH Console!
        </Typography>

        <Typography variant="h5" color="text.secondary" align="center">
          Your powerful tool for Danheng Server management
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            Important: Before You Begin
          </Typography>

          <Stack spacing={3}>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                1. Install Required Plugin to YourPSPath/Plugins
              </Typography>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/Anyrainel/DanhengPlugin-DHConsoleCommands"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Get DHConsole Commands Plugin
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                2. Get the Latest Updates
              </Typography>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/Anyrainel/DHConsole"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Visit DHConsole Repository
              </Button>
            </Box>


            <Typography variant="body1" color="text.secondary">
              For detailed setup instructions, please visit the{' '}
              <Link
                href="https://github.com/Anyrainel/DHConsole#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                documentation
              </Link>
              .
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}