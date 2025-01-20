import React, { useState } from 'react';
import CommandService from '../api/CommandService';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const CommandPage: React.FC = () => {
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
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, maxWidth: '80%' }}>
                <TextField
                    label="Command Input"
                    variant="outlined"
                    fullWidth
                    sx={{ marginRight: 2 }}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command"
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    sx={{ padding: '8px 16px', fontSize: '1rem' }}
                    onClick={handleRunCommand}
                >
                    Run
                </Button>
            </Box>
            <Typography variant="body2">
                Tip: don't include the "/" prefix.
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    [Command Output]
                </Typography>
                <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {output}
                </Box>
            </Paper>
        </Box>
    );
};

export default CommandPage; 