const path = require("path");

module.exports = {
  entry: {
    lib:path.resolve(__dirname, "src/index.ts"),
    demo:path.resolve(__dirname, "src/demo.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "parsegraph-projector.[name].js",
    globalObject: "this",
    library: "parsegraph_projector",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx?)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["ts-shader-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".glsl"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  mode: "development",
  devtool: "eval-source-map",
};
