# React Style Mods

## Why?

I found myself duplicate similar small pieces of styles, like add spacing or center element

```
<Component style={{ marginLeft: 10 }}>...</Component>
<Component style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>...</Component>
```

How did I usually solve these problems?
I can add new props to my Component and describe how to compose styles

```
const Component = (props) => {
    styles = {
        ...props.style
        ...(props.center ? {display: 'flex', alignItems: 'center',justifyContent: 'center'} : {})
        // and so on
    }
    return ...
}

```

But it's too "imperatively" and it's difficult to share such logic between differents UI components.
Also I can create CSS classes and apply them, but you can't pass dynamic params into your css and it also won't be work with react native.
Finally I can extract repetitive styles pieces and create bunch of styles constructors, but I find uncomfortable to use such things

## How does it work?

Create a map of **modifiers** and apply them to component via `withStyleMods` HOC. Then use as a regular props like `<Component mod1 mod2={<value>} ... />` when each props
name correspond to key in your map

Modifiers can be just a style value or a function that returns style value, in first case prop in your component use as boolean flag, if it function value of prop passed as
first arg into modifier function

Ultimately all styles will be composed and passed as `style` prop to the component that you passed `withStyleMods` HOC

All types will be inferring if you use ts or flow

## Examples

Basic usage

```
import React, { FC } from 'react';
import { createStyleMods, withStyleMods } from 'react-styles-mods';

const _Component: FC<{ style?: React.CSSProperties }> = ({style, ...props}) => {
    return <div style={style} {...props} />;
};

const mods = createStyleMods({
    center: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    padding: (value: number = 44) => ({ padding: value }),
    margin: (value: number) => ({ margin: value }),
    // ...
});

const Component = withStyleMods(mods)(_Component);

// cases
<Component center padding />; // ->  { padding: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }
<Component center padding={5} />; // ->  { padding: 5 , display: 'flex', alignItems: 'center', justifyContent: 'center' };
<Component style={{ padding: 5 }} padding={25} />; // -> { padding: 25  }
<Component padding={25} style={{ padding: 5 }}  />; // ->  { padding: 5  }

```

Use in place

```
const Component2 = withStyleMods({
    padding: (value: number = 44) => ({ padding: value }),
    // ...
})((props) => <div {...props} />);
```

Infer props type

```
import { ModsProps, createStyleMods } from 'react-styles-mods';

const mods = createStyleMods({
    padding: (value: number = 44) => ({ padding: value }),
    defaultMargin: {margin: 20}
});


interface ComponentProps extends ModsProps<typeof mods> {
    myProps: number
    style?: React.CSSProperties
}
/*
ComponentProps = {
    padding?: boolean | number,
    defaultMargin: boolean,
    style?: React.CSSProperties,
    myProps: number
} */

```

Change style type (default React.CSSProperties)

```
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type RNStyles = ViewStyle | TextStyle | ImageStyle
createStyleMods<RNStyles>({

})
```

## License

MIT License
