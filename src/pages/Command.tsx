import React, { useState } from 'react';
import CommandService from '../api/CommandService';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';

const CommandPage: React.FC = () => {
    const { t } = useTranslation();
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');

    const handleRunCommand = async () => {
        try {
            const result = await CommandService.executeCommand(command);
            setOutput(result);
        } catch (error) {
            setOutput(`Error: ${error}`);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="body2" color="text.secondary">
                {t('command.tip')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, maxWidth: '80%' }}>
                <TextField
                    label={t('command.input')}
                    variant="outlined"
                    fullWidth
                    sx={{ marginRight: 2 }}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder={t('command.placeholder')}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    sx={{ padding: '8px 16px', fontSize: '1rem' }}
                    onClick={handleRunCommand}
                >
                    {t('command.run')}
                </Button>
            </Box>
            <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {t('command.output')}
                </Typography>
                <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {output}
                </Box>
            </Paper>
        </Box>
    );
};

export default CommandPage; 