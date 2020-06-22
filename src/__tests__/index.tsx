import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { styleMods, withStyleMods } from '..';

const _Component: React.FC<{ style?: any }> = (props) => <div {...props} />;

test('Forward style', () => {
    const mods = styleMods({ a: { padding: 10 } });
    const Component = withStyleMods(mods)(_Component);
    const tree = renderer.create(<Component a />).toJSON();
    expect(tree.props.style).toMatchObject({ padding: 10 });
});

test('Empty style', () => {
    const mods = styleMods({ a: { padding: 10 } });
    const Component = withStyleMods(mods)(_Component);
    const tree = renderer.create(<Component />).toJSON();
    expect(tree.props.style).toBeUndefined();
});

test('Func modifier', () => {
    const mods = styleMods({ a: (value: number) => ({ padding: value }) });
    const Component = withStyleMods(mods)(_Component);
    const tree = renderer.create(<Component a={20} />).toJSON();
    expect(tree.props.style).toMatchObject({ padding: 20 });
});

test('Func modifier, default value', () => {
    const mods = styleMods({ a: (value: number = 5) => ({ padding: value }) });
    const Component = withStyleMods(mods)(_Component);
    const tree = renderer.create(<Component a />).toJSON();
    expect(tree.props.style).toMatchObject({ padding: 5 });
});
