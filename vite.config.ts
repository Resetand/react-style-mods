/// <reference types="vitest" />
import dts from "vite-plugin-dts";
import path from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
    base: "./",
    plugins: [dts()],
    build: {
        sourcemap: true,

        terserOptions: {
            format: {
                comments: false,
            },
        },

        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "react-style-mods",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format}.js`,
        },

        rollupOptions: {
            external: ["react"],
        },
    },

    test: {
        globals: true,
        environment: "jsdom",
        dir: "tests",
    },
});
