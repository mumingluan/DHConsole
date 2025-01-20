import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ServerToolbarActions from '../components/ServerToolbarActions';
import { PlayerProvider } from '../store/playerContext';

export default function Layout() {
  return (
    <PlayerProvider>  
      <DashboardLayout slots={{toolbarActions: ServerToolbarActions}}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </PlayerProvider>
  );
}
