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
import PublicIcon from '@mui/icons-material/Public';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

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
          {t('welcome.title')}
        </Typography>

        <Typography variant="h5" color="text.secondary" align="center">
          {t('welcome.subtitle')}
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
            {t('welcome.important')}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.plugin.title')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/Anyrainel/DanhengPlugin-DHConsoleCommands/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1, textTransform: 'none' }}
              >
                {t('welcome.plugin.button')}
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.updates.title')}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<PublicIcon />}
                  href="https://anyrainel.github.io/DHConsole/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none' }}
                >
                  {t('welcome.updates.hosted')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  href="https://github.com/Anyrainel/DHConsole"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none' }}
                >
                  {t('welcome.updates.local')}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body1" color="text.secondary">
              {t('welcome.docs.text')}{' '}
              <Link
                href="https://github.com/Anyrainel/DHConsole#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('welcome.docs.link')}
              </Link>
              .
            </Typography>
          </Stack>
        </Paper>

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
            {t('welcome.gettingStarted.title')}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.gettingStarted.step0.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcome.gettingStarted.step0.description')}{' '}
                <Link
                  href="https://github.com/samdivaio/DS_PS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  samdivaio/DS_PS
                </Link>
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.gettingStarted.step1.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcome.gettingStarted.step1.description')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.gettingStarted.step2.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcome.gettingStarted.step2.description')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                account create &lt;your_account_name&gt;
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.gettingStarted.step3.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcome.gettingStarted.step3.description')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('welcome.gettingStarted.step4.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcome.gettingStarted.step4.description')}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}