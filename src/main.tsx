import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Index from './pages/Index';
import Account from './pages/Account';
import Characters from './pages/Characters';
import Inventory from './pages/Inventory';
import Equipment from './pages/Equipment';
import Missions from './pages/Missions';
import Relics from './pages/Relics';
import Layout from './layouts/Console';
import App from './App';
import Command from './pages/Command';

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [ 
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: Index,
          },
          {
            path: 'account',
            Component: Account,
          },
          {
            path: 'characters',
            Component: Characters,
          },
          {
            path: 'inventory',
            Component: Inventory,
          },
          {
            path: 'equipment',
            Component: Equipment,
          },
          {
            path: 'missions',
            Component: Missions,
          },
          {
            path: 'relics',
            Component: Relics,
          },
          {
            path: 'command',
            Component: Command,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
