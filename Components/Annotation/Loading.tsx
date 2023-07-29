import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const LoadingComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress size={80} />
        </div>
    );
};