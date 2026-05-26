# FKUI Vue Sandbox

## FTabHandler

The `FTabHandler.vue` component acts as a controller for a two-column tabbed interface. It manages the state of multiple tabs, including which column they appear in and which tab is currently active. It allows users to move tabs between columns and reorder them via drag-and-drop. This component also orchestrates a fullscreen mode, allowing a single tab to expand and occupy the entire content area.

There is a transition animation when moving tabs from left to right or right to left.

## FTab

The child component, `FTab.vue`, is responsible for rendering the content of a single tab. It uses Vue's Teleport feature to place its content into the correct column defined by the FTabHandler. It also provides the user interface buttons to trigger a move to the other column or to toggle the fullscreen view, emitting events back to the parent handler to update the state.

## Användning

```bash
npm install
npm start # Compiles and hot-reloads for development
npm run build # Compiles and minifies for production
```
