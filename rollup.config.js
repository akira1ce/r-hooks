import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
	input: "lib/index.ts",
	output: [
		{
			dir: "dist/lib",
			format: "cjs",
			preserveModules: true,
			preserveModulesRoot: "lib",
		},
		{
			dir: "dist/es",
			format: "esm",
			preserveModules: true,
			preserveModulesRoot: "lib",
		},
	],
	plugins: [
		resolve(),
		commonjs(),
		{
			name: "commonjs-package-type",
			generateBundle(outputOptions) {
				if (outputOptions.format !== "cjs") return;
				this.emitFile({
					type: "asset",
					fileName: "package.json",
					source: '{\n\t"type": "commonjs"\n}\n',
				});
			},
		},
		typescript({
			clean: true,
			useTsconfigDeclarationDir: false,
			tsconfigOverride: {
				compilerOptions: {
					declaration: true,
					declarationMap: true,
					declarationDir: undefined,
					baseUrl: undefined,
					paths: undefined,
				},
			},
		}),
	],
	external: ["react", "react-dom"],
};
