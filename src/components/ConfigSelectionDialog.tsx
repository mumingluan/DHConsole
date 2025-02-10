import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    TextField,
    Box
} from '@mui/material';
import { UploadFile, History, Key } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ConfigSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectFile: () => void;
    onUseRecent: () => void;
    onSaveManualKey: (key: string) => void;
    hasRecentConfig: boolean;
}

const ConfigSelectionDialog = ({
    open,
    onClose,
    onSelectFile,
    onUseRecent,
    onSaveManualKey,
    hasRecentConfig
}: ConfigSelectionDialogProps) => {
    const { t } = useTranslation();
    const [showManualInput, setShowManualInput] = React.useState(false);
    const [manualKey, setManualKey] = React.useState('');

    const handleSaveManualKey = () => {
        onSaveManualKey(manualKey);
        setShowManualInput(false);
        setManualKey('');
    };

    const handleClose = () => {
        setShowManualInput(false);
        setManualKey('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('server.configDialog.title')}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('server.configDialog.description')}
                </Typography>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onSelectFile}>
                            <ListItemIcon>
                                <UploadFile />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('server.configDialog.selectFile')}
                                secondary={t('server.configDialog.selectFileDesc')}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setShowManualInput(true)}>
                            <ListItemIcon>
                                <Key />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('server.configDialog.enterKey')}
                                secondary={t('server.configDialog.enterKeyDesc')}
                            />
                        </ListItemButton>
                    </ListItem>
                    {hasRecentConfig && (
                        <ListItem disablePadding>
                            <ListItemButton onClick={onUseRecent}>
                                <ListItemIcon>
                                    <History />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('server.configDialog.useRecent')}
                                    secondary={t('server.configDialog.useRecentDesc')}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
                {showManualInput && (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label={t('server.configDialog.adminKeyInput')}
                            value={manualKey}
                            onChange={(e) => setManualKey(e.target.value)}
                            autoFocus
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                {showManualInput && (
                    <Button
                        onClick={handleSaveManualKey}
                        disabled={!manualKey.trim()}
                    >
                        {t('save')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ConfigSelectionDialog; 