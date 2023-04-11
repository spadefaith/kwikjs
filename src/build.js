import * as esbuild from "esbuild";

esbuild.build({
    entryPoints: ["./src/index.js"],
    bundle: true,
    platform: "neutral",
    minify: false,
    outfile: "./src/bundle.js",
});
