# react-style-mods

Effortlessly manage conditional inline styles in your React components!

## Introduction

`react-style-mods` is a lightweight utility that simplifies the process of applying conditional inline styles (mods) to your React components based on props.

## Features

-   **Simple Mod Definitions**: Define your styles once and reuse them across components.
-   **Conditional Styles**: Apply styles dynamically based on boolean props or parameters.
-   **TypeScript Support**: Enjoy full type safety when defining and using mods.
-   **Zero Dependencies**: Minimal overhead with no external dependencies.

## Installation

Install via npm or yarn:

```bash
npm install react-style-mods
```

or

```bash
yarn add react-style-mods
```

## Quick Start

### 1. Define Your Mods

Use `defineStyleMods` to create a set of style modifications:

```tsx
import { defineStyleMods } from "react-style-mods";

const mods = defineStyleMods({
    // Static mod
    primary: { backgroundColor: "blue", color: "white" },

    // Dynamic mod with a parameter
    size: (size: "small" | "large") => ({
        fontSize: size === "small" ? "12px" : "24px",
    }),

    margin: (margin: number = 10) => ({
        margin: `${margin}px`,
    }),
});
```

### 2. Wrap Your Component

Wrap your component with `withStyleMods` to apply the mods:

```tsx
import React from "react";
import { withStyleMods } from "react-style-mods";

const Button = ({ style, children, ...props }) => (
    <button style={style} {...props}>
        {children}
    </button>
);

const StyledButton = withStyleMods(mods, Button);
```

### 3. Use the Component with Mods

Now, you can apply mods directly via props:

```jsx
<StyledButton primary margin>Primary Button</StyledButton>
<StyledButton size="large" margin>Large Button</StyledButton>
<StyledButton disabled margin={30}>Disabled Button</StyledButton>
```

The styles will be applied conditionally based on the props you pass with minimum runtime overhead.

## TypeScript Support

`react-style-mods` provides full TypeScript support, ensuring that your mods and components are type-safe.

### Using `satisfies` (TypeScript >= 4.9)

If you're using TypeScript 4.9 or newer, you can use the `satisfies` operator for even better type inference:

```tsx
const mods = {
    primary: { backgroundColor: "blue", color: "white" },
    size: (size: "small" | "large") => ({
        fontSize: size === "small" ? "12px" : "24px",
    }),
} satisfies StyleModsDefinition;
```

## API Reference

### `defineStyleMods(mods)`

Defines a set of style modifications.

-   **mods**: An object where each key is a mod name, and each value is either:
    -   A style object (`React.CSSProperties`).
    -   A function that returns a style object, optionally taking a parameter.

### `withStyleMods(mods, Component)`

Wraps a component to enable style mods.

-   **mods**: The mods defined using `defineStyleMods`.
-   **Component**: The React component to wrap.

### `createModsStylesFromProps(props, mods)`

Creates a style object based on the props and mods provided.

## Examples

### Conditional Styling

```jsx
<StyledButton primary>Primary Button</StyledButton>
```

Applies the `primary` styles when the `primary` prop is truthy.

### Dynamic Styling with Parameters

```jsx
<StyledButton size="small">Small Button</StyledButton>
```

Applies styles based on the value of the `size` prop.

### Combining Mods

```jsx
<StyledButton primary size="large">
    Large Primary Button
</StyledButton>
```

Combines multiple mods for complex styling.

## License

[MIT License](LICENSE)
