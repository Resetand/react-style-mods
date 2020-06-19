# React Style Mods

## Why?

I found myself writing and duplicate similar code, when I want to add some spacing between elements or center element

```
<Component style={{marginLeft: SOME_STYLE_GUIDE_CONSTANT }}>...</Component>
<Component style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>...</Component>
```

How did I usually solve these problems?
I can adding new props to my Component and imperative describes how to compose styles

```
const Component = (props) => {
    styles = {
        ...props.styles
        ...(props.center ? {display: 'flex', alignItems: 'center',justifyContent: 'center'} : {})
        // and so on
    }
    return ...
}

```

There are some problems with it - it's too "imperatively" and it's difficult to share this logic between differents UI component like this one.

Also, I can create CSS classes and apply them, but this solution won't be work with react native and it's not strict typing if you using typescript or flow. Finally I can extract repetitive styles to variables or object, but I found difficult to compose such styles with spread

## How does it work?

You create a map of **modifiers** and apply them to component via HOC. Then use as a regular props like `<Component mod1 mod2={<value>} ... />`

Modifiers can be just a style object or a function, in second case value you passed to this prop will be use as function paramer

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
    margin: (value: number) => ({ padding: value }),
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
    style: React.CSSProperties
}
/*
ComponentProps = {
    padding?: true | number,
    defaultMargin: true,
    style: React.CSSProperties,
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
