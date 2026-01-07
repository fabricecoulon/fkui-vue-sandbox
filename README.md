# FKUI Vue Sandbox

## FTabHandler && FTab

The `FTabHandler.vue` component acts as a controller for a two-column tabbed interface. It manages the state of multiple tabs, including which column they appear in and which tab is currently active. It allows users to move tabs between columns and reorder them via drag-and-drop. This component also orchestrates a fullscreen mode, allowing a single tab to expand and occupy the entire content area.

### FTab

The child component, `FTab.vue`, is responsible for rendering the content of a single tab. It uses Vue's Teleport feature to place its content into the correct column defined by the FTabHandler. It also provides the user interface buttons to trigger a move to the other column or to toggle the fullscreen view, emitting events back to the parent handler to update the state.

### Animations

Three distinct animations were implemented to enhance the user experience of the tab component: animating the movement of tab headers, animating the teleporting tab content, and animating the transition to and from fullscreen mode.

#### 1. Tab Header Animation in FTabHandler (Moving Left & Right)

This animation provides visual feedback when a tab header moves from one column to another.

File Modified: `FTabHandler.vue`

Concepts & Implementation:

- Vue TransitionGroup: The core of this animation is Vue's built-in `<TransitionGroup>` component. The original template used a v-for loop to render tab headers in each column. This was replaced by wrapping each list of headers in a `<TransitionGroup>` component.

- How it works: When a user moves a tab, the underlying data for that tab is updated, which removes it from one component's list (e.g., the left column's array) and adds it to the other. `<TransitionGroup>` detects this change and automatically applies CSS classes for enter (`.slide-*-enter-from`, `.slide-*-enter-to`) and leave (`.slide-*-leave-from`, `.slide-*-leave-to`) animations.

- CSS Transitions: Custom transition classes (`.slide-left-*` and `.slide-right-*`) were added. These classes use the transform: `translateX()` and `opacity` properties to create a smooth sliding and fading effect, making it appear as if the tab header is moving across the screen from one column to the other.

```vue
<!-- FTabHandler.vue -->
<TransitionGroup name="slide-left" tag="div" class="headings-wrapper">
    <div v-for="flik in leftFlikar" :key="flik.id" ...>
        <!-- Tab Header -->
    </div>
</TransitionGroup>
```

#### 2. Tab Content Animation in FTab (On Teleport)

To complement the header animation, the tab's content now also animates when it is moved to a new column.

File Modified: `FTab.vue`

Concepts & Implementation

- motion-v Library: Since animating the content of a `<Teleport>` is complex, the motion-v library (a Vue port of Framer Motion) was used. Specifically, the `<Motion>` component was imported and used.

- Key-based Re-rendering: The key to triggering this animation is Vue's :key attribute. The `<Motion>` component, which wraps the tab content, was given a key bound to the placement prop (:key="placement").
  - When a tab is moved, the placement prop changes (e.g., from an ID for the left column to one for the right). Changing a component's key is a powerful Vue concept that signals to the framework to destroy the old component instance and create a completely new one.

  - This re-creation forces the `<Motion>` component to re-run its entrance animation. The `:initial` and `:animate` props were used to define a slide-and-fade-in effect that corresponds to the direction of movement.

```vue
<!-- FTab.vue -->
<Teleport :to="`#${placement}`">
    <Motion :key="placement" :initial="{...}" :animate="{...}">
        <!-- Tab Content -->
    </Motion>
</Teleport>
```

#### 3. Fullscreen Transition Animation in FTabHandler

A smooth transition was added for when a tab enters or exits fullscreen mode.

File Modified: `FTabHandler.vue`

Concepts & Implementation

- Animatable Properties (flex-grow): The fullscreen effect is achieved by hiding one of the two content columns. The `v-show` directive, which sets `display: none`, was replaced with a dynamic class binding (`:class="{'col-hidden': ...}"`). This allows for animating the transition.
  - A CSS transition was added to the `flex-grow` property of the columns (`.mycol`).
  - The new `.col-hidden` class sets `flex-grow: 0`. When a column is hidden, its flex-grow value animates from 1 to 0, causing it to smoothly shrink out of view while the other column expands to fill the space.
  - Fading Non-active Elements: To draw focus to the fullscreen tab, the other tab headers are "shrouded." A CSS transition was added to the opacity of the tab headers (.heading2), and the .shrouded class now reduces the opacity, creating a gentle fade-out effect.

```css
/*FTabHandler.vue */
.mycol {
  flex-basis: 0;
  flex-grow: 1;
  transition: flex-grow 0.4s ease-out; /* Animate width */
}
.mycol.col-hidden {
  flex-grow: 0; /* Collapse the column*/
}

.heading2.shrouded {
  opacity: 0.6; /*Fade out shrouded tabs*/
}
```

## Användning

```bash
npm start # Compiles and hot-reloads for development
npm run build # Compiles and minifies for production
```
