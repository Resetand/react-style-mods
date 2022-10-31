# React Style Mods

## Why?

I found myself duplicate similar small pieces of styles, like add spacing or center element

```tsx
<Component style={{ marginTop: 10, marginRight: 10 }}>...</Component>
<Component style={{ marginLeft: STYLE_GUIDE_CONST, marginRight: STYLE_GUIDE_CONST  }}>...</Component>
<Component style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>...</Component>
```

How can I solve these problems?
I can add new props to my Component and describe how to compose styles

```typescript
const Component = (props) => {
    styles = {
        ...props.style
        ...(props.center ? {display: 'flex', alignItems: 'center',justifyContent: 'center'} : {}),
        // etc
    }
    return ...
}

```

But it's too "imperatively" and it's difficult to reuse such logic between differents UI components.

Or I can create CSS classes and apply them, but you can't pass dynamic params into your classes.
Finally I can extract repetitive styles pieces and create bunch of styles constructors, but I find uncomfortable to use such things
So I decided to create general convenient solution

## How does it work?

Create a map of **modifiers** and apply them to component via `applyStyleMods` HOC. Then use as a regular props like `<Component mod1 mod2={<value>} ... />` when each prop
name correspond to key in your map

Modifiers can be just a style value or a function that returns style value. In first case prop in your component use as boolean flag, if it function value of prop passed as
first arg into modifier function

Ultimately all styles will be composed and passed as `style` prop to the component that you passed `withStyleMods` HOC

All types will be inferring for Typescript

## Examples

#### Basic usage

```tsx
import React, { FC } from "react";
import { createStyleMods, applyStyleMods } from "react-style-mods";

const _Component: FC<{ style?: React.CSSProperties }> = ({ style, ...props }) => {
    return <div style={style} {...props} />;
};

const mods = createStyleMods({
    center: { display: "flex", alignItems: "center", justifyContent: "center" },
    padding: (value: number = 44) => ({ padding: value }),
    margin: (value: number) => ({ margin: value }),
    // ...
});

const Component = applyStyleMods(mods)(_Component);

// cases
<Component center padding />; // ->  { padding: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }
<Component center padding={5} />; // ->  { padding: 5 , display: 'flex', alignItems: 'center', justifyContent: 'center' };
<Component style={{ padding: 5 }} padding={25} />; // -> { padding: 25  }
<Component padding={25} style={{ padding: 5 }} />; // ->  { padding: 5  }
```

#### Infer props type

```typescript
import { ModsProps, createStyleMods } from "react-style-mods";

const mods = createStyleMods({
    padding: (value: number = 44) => ({ padding: value }),
    defaultMargin: { margin: 20 },
});

interface ComponentProps extends ModsProps<typeof mods> {
    myProps: number;
    style?: React.CSSProperties;
}
```

## License

MIT License
