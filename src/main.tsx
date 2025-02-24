import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Index from './pages/Index';
import Account from './pages/Account';
import Characters from './pages/Characters';
import Inventory from './pages/Inventory';
import Missions from './pages/Missions';
import Scene from './pages/Scene';
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
            path: 'missions',
            Component: Missions,
          },
          {
            path: 'scene',
            Component: Scene,
          },
          {
            path: 'command',
            Component: Command,
          },
        ],
      },
    ],
  },
], { basename: '/DHConsole/' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
