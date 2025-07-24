import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
	input: "lib/index.ts",
	output: [
		{
			dir: "dist/lib",
			format: "cjs",
		},
		{
			dir: "dist/es",
			format: "esm",
		},
	],
	plugins: [resolve(), commonjs(), typescript()],
	external: ["react", "react-dom"],
};
