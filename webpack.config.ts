import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import HtmlWebpackHarddiskPlugin from "html-webpack-harddisk-plugin";
import OptimizeCssAssetsWebpackPlugin from "optimize-css-assets-webpack-plugin";
import autoprefixer from "autoprefixer";
import {glob} from "glob";

const version = "1.0.0";
const isDev = true;

const webapp = path.join(__dirname, "src");
const artifact = path.join(__dirname, "docs");
const webBuild = path.join(artifact, "web-build");

//модули внутри node_modules, которые нам нужно явно затранспайлить, т.к. они сбилдены в es6+
const transpileNodeModules = ["cyrillic-to-translit-js", "query-string", "strict-uri-encode", "split-on-first", "rifm"];
const moduleRegexps = transpileNodeModules.map((module) => new RegExp(`node_modules[\\\\/]${module}`));

export default (env: any, argv: any) => {
    const __watch = (watch: any, another: any) => (argv.watch || argv.hot || argv.host ? watch : another);

    return {
        mode: isDev ? "development" : "production",
        entry: {
            application: [
                path.join(webapp, "./index.tsx"),
                glob.sync("./src/scss/components/**/*.scss"),
                path.join(webapp, "./scss/index.scss"),
            ]
                .flat()
                .filter((e) => !!e),
        },
        output: {
            path: webBuild,
            filename: "[name].js",
            chunkFilename: "[name].chunk.js",
            pathinfo: false,
            publicPath: "/web-build",
        },
        target: "web",
        devtool: __watch("eval-source-map", "source-map"),
        bail: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(webapp, "./index_template.html"),
                filename: path.join(argv.hot || argv.host ? webapp : artifact, "./index.html"),
                inject: true,
                hash: true,
                templateParameters: {
                    version: new Date().getTime(),
                },
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                },
                alwaysWriteToDisk: true,
            }),
            new HtmlWebpackHarddiskPlugin(),
            !argv.noCssOptimization &&
                new OptimizeCssAssetsWebpackPlugin({
                    cssProcessor: require("cssnano"),
                    cssProcessorOptions: {map: {inline: false}},
                    cssProcessorPluginOptions: {preset: ["default", {discardComments: {removeAll: true}}]},
                }),
            new MiniCssExtractPlugin({filename: "[name].css"}),
        ].filter((p) => !!p),
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                implementation: require("sass"),
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    parser: "postcss-scss",
                                    plugins: [
                                        autoprefixer({
                                            cascade: true,
                                            add: true,
                                            remove: true,
                                        }),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    exclude: (modulePath: string) => /node_modules|vendor/.test(modulePath) && moduleRegexps.some((moduleRegexp) => moduleRegexp.test(modulePath)),
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true, // включить кэширование
                        presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-proposal-optional-chaining",
                            "@babel/plugin-proposal-nullish-coalescing-operator",
                            "@babel/plugin-transform-runtime",
                        ],
                    },
                },
            ],
        },
        optimization: {
            minimize: __watch(false, true),
            removeAvailableModules: true,
            removeEmptyChunks: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: false,
                    },
                }),
            ],
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".min.js", ".json"],
            modules: ["node_modules", "./src/vendor"],
            plugins: [
                new TsconfigPathsPlugin({
                    extensions: [".ts", ".tsx", ".js", ".jsx"],
                }),
            ],
        },
        stats: {
            assets: false,
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false,
        },
        performance: {hints: false},
        devServer: {
            contentBase: webapp,
            watchContentBase: true,
            host: "lk-local.rt.ru",
            port: 8443,
            https: true,
            hot: false,
            inline: false,
            stats: {
                colors: true,
                modules: false,
                chunks: false,
                chunkModules: false,
                children: false,
            },
            headers: {"Access-Control-Allow-Origin": "*"},
        },
    };
};
