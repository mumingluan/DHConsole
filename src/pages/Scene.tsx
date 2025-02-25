import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    IconButton,
    MenuItem,
    SelectChangeEvent,
    TextField,
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
    const [editingPropId, setEditingPropId] = useState<[number, number] | null>(null);
    const [selectedState, setSelectedState] = useState<number | null>(null);
    const [recentChanges, setRecentChanges] = useState<PropStateChange[]>([]);
    const [waiting, setWaiting] = useState(false);

    const fetchProps = async () => {
        if (!isConnected) return;
        const nearbyProps = await CommandService.getPropsNearMe();
        setProps(nearbyProps.sort((a, b) => a.distance - b.distance));
        setSelectedState(null);
        setEditingPropId(null);
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

    const handleEditClick = (prop: Prop) => {
        setEditingPropId([prop.groupId, prop.entityId]);
        setSelectedState(prop.stateId);
    };

    const handleSaveClick = async (prop: Prop) => {
        setWaiting(true);
        try {
            if (selectedState === null) {
                showSnackbar(t('scene.messages.noStateSelected'), 'error');
                return;
            }
            await CommandService.changePropState(prop, selectedState);
            setRecentChanges(prev => [{
                prop,
                originalState: prop.stateId,
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
                        const isEditing = editingPropId?.[0] === prop.groupId && editingPropId?.[1] === prop.entityId;

                        return (
                            <ListItem
                                key={`${prop.groupId}-${prop.entityId}`}
                                secondaryAction={
                                    isEditing ? (
                                        <Box display="flex" alignItems="center" justifyContent="end">
                                            <TextField
                                                select
                                                size="small"
                                                value={selectedState ?? ''}
                                                onChange={(e) => setSelectedState(Number(e.target.value))}
                                                sx={{ minWidth: 120 }}
                                            >
                                                {Object.entries(prop.validStates).map(([desc, id]) => (
                                                    <MenuItem key={id} value={id}>
                                                        {desc}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <IconButton
                                                edge="end"
                                                onClick={() => handleSaveClick(prop)}
                                                disabled={waiting || selectedState === null}
                                                sx={{ marginLeft: 2 }}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </Box>
                                    ) : (
                                            <Box display="flex" alignItems="center" justifyContent="end">
                                                <Typography variant="body2" color="textSecondary">
                                                    {`State: ${prop.state}`}
                                                </Typography>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleEditClick(prop)}
                                                    disabled={waiting}
                                                    sx={{ marginLeft: 2 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Box>
                                    )
                                }
                            >
                                <ListItemText
                                    primary={`${prop.type} - ${prop.category} (${prop.distance / 1000}m)`}
                                    secondary={`[Group ${prop.groupId}] ID:${prop.entityId} (${prop.propId})`}
                                    slotProps={{ primary: { variant: 'body1' } }}
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
                            key={`${change.prop.groupId}-${change.prop.entityId}-${index}`}
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