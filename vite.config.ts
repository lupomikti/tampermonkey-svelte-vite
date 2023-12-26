import { svelte } from "@sveltejs/vite-plugin-svelte";
import css from "rollup-plugin-css-only";
import { sveltePreprocess } from "svelte-preprocess/dist/autoProcess";
import MagicString from "magic-string";
import { userScriptPlugin } from "rollup-plugin-userscript-metaheader";
import pkg from "./package.json";
import { pathToFileURL, URL } from "url";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    const isDev = (mode === 'development');
    const distURLBase = `https://example.com/dist`;
    const packageName = pkg.name;
    const baseUrl = path.join(__dirname, "dist");
    return {
        root: 'src',
        envDir: 'env',
        build: {
            outDir: '../dist',
            emptyOutDir: true,
            rollupOptions: {
                input: 'src/main.ts',
                output: {
                    format: 'iife',
                    name: 'app',
                    entryFileNames: 'bundle.user.js'
                }
            },
            target: 'esnext',
            minify: !isDev,
            watch: {
                clearScreen: !isDev
            },
            sourcemap: isDev
        },
        resolve: {
            dedupe: ['svelte']
        },
        plugins: [
            svelte({
                preprocess: sveltePreprocess({
                    sourceMap: isDev
                }),
                compilerOptions: {
                    dev: isDev
                }
            }),

            css({
                output: 'bundle.css'
            }),

            // rollup-plugin-tampermonkey-css
            ((options = {}) => ({
                name: 'rollup-plugin-tampermonkey-css',
                renderChunk: (code, renderedChunk, outputOptions) => {
                    let magicString = new MagicString(code);
                    magicString.prepend(`GM_addStyle(GM_getResourceText('css'));\n`)
                    const result = { code: magicString.toString() }
                    if(outputOptions.sourcemap !== false) {
                        // @ts-ignore
                        result.map = magicString.generateMap({hires: true})
                    }
                    return result
                }
            }))(),

            userScriptPlugin({
                headers: {
                    name: isDev ? packageName + " -> dev" : packageName,
                    version: pkg.version,
                    description: pkg.description,
                    homepage: pkg.homepage,
                    author: pkg.author,
                    namespace: "https://github.com",
                    resource: {
                        css: isDev ? pathToFileURL(path.join(baseUrl, "bundle.css")).toString() : new URL("bundle.css", distURLBase).toString(),
                    },
                    match: ["https://*.github.com/*"],
                    require: isDev ? [pathToFileURL(path.join(baseUrl, "bundle.user.js")).toString()] : [],
                    grant: ["GM_addStyle", "GM_getResourceText", "GM_xmlhttpRequest"],
                    connect: ["github.com"],
                    "run-at": "document-idle",
                    updateURL: isDev ? "" : new URL("bundle.user.js", distURLBase).toString(),
                    downloadURL: isDev ? "" : new URL("bundle.user.js", distURLBase).toString()
                }
            })
        ]
    };
});