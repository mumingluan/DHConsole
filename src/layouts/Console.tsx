import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ServerToolbarActions from '../components/ServerToolbarActions';
import { PlayerProvider } from '../store/playerContext';
import { LanguageProvider } from '../store/languageContext';
import LanguageSidebarFooter from '../components/LanguageSidebarFooter';

export default function Layout() {
  return (
    <LanguageProvider>
      <PlayerProvider>
        <DashboardLayout slots={{ toolbarActions: ServerToolbarActions, sidebarFooter: LanguageSidebarFooter }}>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </DashboardLayout>
      </PlayerProvider>
    </LanguageProvider>
  );
}
