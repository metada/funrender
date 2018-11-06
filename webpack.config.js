const path = require('path')

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: __dirname,
    filename: 'app.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    port: 8090,
    index: './src/index.html',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets:  [],
            plugins: [
              ["@babel/plugin-transform-react-jsx", {
                "pragma": "createElement", // default pragma is React.createElement
                "pragmaFrag": "elementFrag", // default is React.Fragment
                "throwIfNamespace": false // defaults to true
              }]
            ]
          }
        }
      }
    ]
  }
}
