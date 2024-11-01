import React from "react";
import { describe, test, expect } from "vitest";
import { defineStyleMods, withStyleMods, createModsStylesFromProps } from "../src/index";

describe("react-style-mods", () => {
    const mods = defineStyleMods({
        color: (color: string) => ({ color }),
        margin: (margin: number = 10) => ({ margin }),
        alignCenter: { textAlign: "center" },
    });

    test("should apply styles based on props", () => {
        const MyComponent = (props: { style?: React.CSSProperties; myProp: boolean }) => {
            expect(props.style).toEqual({
                color: "red",
                margin: 10,
                alignCenter: { textAlign: "center" },
                display: "flex",
            });

            expect(props.myProp).toBe(true);

            return null;
        };

        const Comp = withStyleMods(mods, MyComponent);

        React.createElement(Comp, {
            color: "red",
            margin: true,
            alignCenter: true,
            myProp: true,
            style: { display: "flex" },
        });
    });

    test("should hoist statics attributes", () => {
        const MyComponent = () => null;
        MyComponent.displayName = "MyComponent";
        MyComponent.STATIC_ATTR = "static";

        const Comp = withStyleMods(mods, MyComponent);

        expect(Comp.displayName).toBe("withStyleMods(MyComponent)");
    });

    test("should aggregate styles and rest props", () => {
        const props = {
            color: "red",
            margin: true,
            alignCenter: true,
            myProp: true,
            style: { display: "flex" },
        };

        const [style, restProps] = createModsStylesFromProps(props, mods);

        expect(style).toEqual({
            color: "red",
            margin: 10,
            textAlign: "center",
        });

        expect(restProps).toEqual({ myProp: true, style: { display: "flex" } });
    });

    test("should forward ref", () => {
        const MyComponent = React.forwardRef((props: { style?: React.CSSProperties; myProp: boolean }, ref: React.Ref<string>) => {
            expect(ref).toEqual({ current: "my-ref-instance" });
            return null;
        });

        const Comp = withStyleMods(mods, MyComponent);

        const ref = { current: "my-ref-instance" } as React.RefObject<string>;

        React.createElement(Comp, {
            ref,
            myProp: true,
        });
    });
});
