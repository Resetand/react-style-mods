import React from "react";
import renderer from "react-test-renderer";
import { applyStyleMods, createStyleMods } from "../src";

const _Component: React.FC<{ style?: any }> = (props) => <div {...props} />;

describe("react-style-mods packages", () => {
    test("should pass styles to props", () => {
        const mods = createStyleMods({ a: { padding: 10 } });
        const Component = applyStyleMods(mods)(_Component);
        const tree = renderer.create(<Component a />).toJSON();
        expect(tree?.props.style).toMatchObject({ padding: 10 });
    });

    test("should pass undefined if no styles", () => {
        const mods = createStyleMods({ a: { padding: 10 } });
        const Component = applyStyleMods(mods)(_Component);
        const tree = renderer.create(<Component />).toJSON();
        expect(tree?.props.style).toBeUndefined();
    });

    test("should pass styles to props via callback modifier", () => {
        const mods = createStyleMods({ a: (value: number) => ({ padding: value }) });
        const Component = applyStyleMods(mods)(_Component);
        const tree = renderer.create(<Component a={20} />).toJSON();
        expect(tree?.props.style).toMatchObject({ padding: 20 });
    });

    test("should pass styles to props via callback modifier with default value", () => {
        const mods = createStyleMods({ a: (value: number = 5) => ({ padding: value }) });
        const Component = applyStyleMods(mods)(_Component);
        const tree = renderer.create(<Component a />).toJSON();
        expect(tree?.props.style).toMatchObject({ padding: 5 });
    });
});
