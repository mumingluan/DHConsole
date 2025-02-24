import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';
import CommandService from '../api/CommandService';
import { Prop } from '../api/PropInfo';
import { useTranslation } from 'react-i18next';
import { usePlayerContext } from '../store/playerContext';
import { useSnackbar } from '../store/SnackbarContext';

interface PropStateChange {
    prop: Prop;
    originalState: number;
    timestamp: number;
}

const Scene = () => {
    const { t } = useTranslation();
    const { isConnected } = usePlayerContext();
    const { showSnackbar } = useSnackbar();
    const [props, setProps] = useState<Prop[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [editingPropId, setEditingPropId] = useState<string | null>(null);
    const [selectedStates, setSelectedStates] = useState<Record<string, number>>({});
    const [recentChanges, setRecentChanges] = useState<PropStateChange[]>([]);
    const [waiting, setWaiting] = useState(false);

    const fetchProps = async () => {
        if (!isConnected) return;
        const nearbyProps = await CommandService.getPropsNearMe();
        setProps(nearbyProps.sort((a, b) => a.distance - b.distance));
    };

    useEffect(() => {
        fetchProps();
    }, [isConnected]);

    const propTypes = [...new Set(props.map(prop => prop.type))];

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const getPropKey = (prop: Prop) => `${prop.groupId}-${prop.entityId}`;

    const handleEditClick = (prop: Prop) => {
        const propKey = getPropKey(prop);
        setEditingPropId(propKey);
        setSelectedStates(prev => ({
            ...prev,
            [propKey]: parseInt(prop.state)
        }));
    };

    const handleStateChange = (prop: Prop, event: SelectChangeEvent<number>) => {
        const propKey = getPropKey(prop);
        setSelectedStates(prev => ({
            ...prev,
            [propKey]: event.target.value as number
        }));
    };

    const handleSaveClick = async (prop: Prop) => {
        const propKey = getPropKey(prop);
        setWaiting(true);
        try {
            const newState = selectedStates[propKey];
            await CommandService.changePropState(prop, newState);
            setRecentChanges(prev => [{
                prop,
                originalState: parseInt(prop.state),
                timestamp: Date.now()
            }, ...prev].slice(0, 10)); // Keep only last 10 changes
            await fetchProps();
            showSnackbar(t('scene.messages.saveSuccess'), 'success');
        } catch (error) {
            showSnackbar(t('scene.messages.saveError'), 'error');
        } finally {
            setWaiting(false);
            setEditingPropId(null);
        }
    };

    const handleUndoClick = async (change: PropStateChange) => {
        setWaiting(true);
        try {
            await CommandService.changePropState(change.prop, change.originalState);
            setRecentChanges(prev => prev.filter(c => c !== change));
            await fetchProps();
            showSnackbar(t('scene.messages.undoSuccess'), 'success');
        } catch (error) {
            showSnackbar(t('scene.messages.undoError'), 'error');
        } finally {
            setWaiting(false);
        }
    };

    const filteredProps = props.filter(prop =>
        selectedTypes.length === 0 || selectedTypes.includes(prop.type)
    );

    return (
        <Box display="flex" height="100%">
            {/* Left side - Props near me */}
            <Box flex={1} paddingRight={2} borderRight="1px solid #ccc">
                <Box display="flex" alignItems="center">
                    <Typography variant="h6">{t('scene.sections.propsNearMe')}</Typography>
                    <IconButton
                        color="primary"
                        onClick={fetchProps}
                        style={{ marginLeft: 2 }}
                        disabled={waiting}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <Box display="flex" flexWrap="wrap" marginBottom={2}>
                    {propTypes.map((type) => (
                        <Chip
                            key={type}
                            label={`${type} (${props.filter(p => p.type === type).length})`}
                            onClick={() => handleTypeToggle(type)}
                            color={selectedTypes.includes(type) ? 'primary' : 'default'}
                            style={{ margin: 4 }}
                        />
                    ))}
                </Box>

                <List>
                    {filteredProps.map((prop) => {
                        const propKey = getPropKey(prop);
                        const isEditing = editingPropId === propKey;

                        return (
                            <ListItem
                                key={propKey}
                                secondaryAction={
                                    isEditing ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSaveClick(prop)}
                                            disabled={waiting}
                                            startIcon={<SaveIcon />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {t('save')}
                                        </Button>
                                    ) : (
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleEditClick(prop)}
                                            disabled={waiting}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemText
                                    primary={`${prop.type} - ${prop.category} (${prop.distance}m)`}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" component="span">
                                                {`ID: ${prop.groupId}-${prop.entityId}-${prop.propId}`}
                                            </Typography>
                                            <Box display="flex" alignItems="center" marginTop={1}>
                                                {isEditing ? (
                                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={selectedStates[propKey]}
                                                            onChange={(e) => handleStateChange(prop, e)}
                                                        >
                                                            {Object.entries(prop.validStates).map(([desc, id]) => (
                                                                <MenuItem key={id} value={id}>
                                                                    {desc}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        {`State: ${Object.entries(prop.validStates).find(([, id]) => id.toString() === prop.state)?.[0] || prop.state}`}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Right side - Recent changes */}
            <Box flex={1} paddingLeft={2}>
                <Typography variant="h6">{t('scene.sections.recentChanges')}</Typography>
                <List>
                    {recentChanges.map((change, index) => (
                        <ListItem
                            key={`${getPropKey(change.prop)}-${index}`}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    onClick={() => handleUndoClick(change)}
                                    disabled={waiting}
                                >
                                    <UndoIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={`${change.prop.type} - ${change.prop.category}`}
                                secondary={
                                    <Box>
                                        <Typography variant="body2">
                                            {`ID: ${change.prop.groupId}-${change.prop.entityId}-${change.prop.propId}`}
                                        </Typography>
                                        <Typography variant="body2">
                                            {`Original State: ${Object.entries(change.prop.validStates).find(([, id]) => id === change.originalState)?.[0] || change.originalState}`}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default Scene;