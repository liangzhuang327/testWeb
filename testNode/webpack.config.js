var path = require('path');

const config = {
    mode: "development",
    entry:
        {
            // testCss: './src/client/css/test.css',
            entryJs: './src/client/root/index.js',
        },
    output:{
        path: path.join(__dirname, './static/javascript/'),
        publicPath: 'http://localhost:3000/static',
        filename: "[name].js"
    },
    module: {
        rules:[
            {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: [path.resolve("src")],
          },
          {
              test:/\.css$/,
              include: [path.resolve("src/client/css")],
              use: [
                  {loader: 'style-loader'},
                  {
                    loader: 'css-loader',
                  }
              ]
          },
        ]
    },
    devtool: 'source-map'
}

module.exports = config