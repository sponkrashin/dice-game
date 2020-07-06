const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        googleAuthClientId: JSON.stringify(process.env.googleAuthClientId),
        fbAuthClientId: JSON.stringify(process.env.fbAuthClientId),
      },
    }),
  ],
};
