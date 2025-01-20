# DH Console Specification

## Overview

DH Console is a client-side SPA for managing a locally hosted game server via its APIs. It provides user-friendly controls for viewing and modifying in-game states and content.

### Tech Stack

- **Frontend**: React (TypeScript)
- **Build Tool**: Vite
- **UI Framework**: Material UI (Toolpad core + components)

### Design Goals

- Write minimal, readable code.
- Create a playful and elegant UI.
- Leverage MUI, Vite, and React for rapid prototyping and clean architecture. Don't reinvent the wheels.

## Features

### Navigation

- **Left Sidebar**: Pages include Account, Characters,  Equipment, Relics, Missions, and Inventory.
- **Top Bar**: Server connection status/configuration and player selection dropdown.

### Core Functionalities

- Display game states and content.
- Provide tools to adjust game states and server settings.
- **Account**: account name, level management.
- **Characters**: add new or remove owned characters, expands into level, talent and rank adjustment for each character. Visual hint or separation for 5-star vs 4-star character.
- **Equipment**: add new or remove owned equipment, expands into level, rank adjustment for each equipment. Visual hint for separation for 5-star vs 4-star equipment.
- **Relics**: craft new relics or relic sets for a given character, convenient removal of all unused relics.
- **Missions**: manage the current mission state, accept certain missions or finish existing missions. Convenient controls of skipping a preset of missions.
- **Inventory**: list of owned materials, convenient add or remove of material amount.

### UI/UX

- **Dashboard Layout**: Fixed sidebar, top bar, and dynamic content area. All provided by Toolpad Core.
- **Styling**: Playful yet elegant theme, responsive for desktop, using MUI's theming capabilities.

## Development Plan

1. **Core Components**:
   - Build layout (sidebar, top bar, content area) and routing.
   - Add server API integration (MuipAPI.md), which enables sending server commands and receiving info or status.
   - Implement player selection and server status.
2. **Page Structure**:
   - Implement functional pages for each game system (Characters, Equipment, Relics, etc).
   - Translate read-type server command output to UI information, and translate UI actions back to write-type server command.
3. **Theming**:
   - Apply MUI theming for polish and responsiveness.
