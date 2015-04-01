module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'jspm'],
    files: ['node_modules/babel/browser-polyfill.js'],
    preprocessors: {
      'src/**/*.js': ['babel']
    },
    browsers: ['Chrome'],
////
    babelPreprocessor: {
      options: { experimental: true }
    },
    jspm: {
      config: 'jspm.config.js',
      serveFiles: ['src/**/!(*.spec).js'],
      loadFiles: ['src/**/*.spec.js']
    },
    proxies : {
      '/jspm_packages' : '/base/jspm_packages'
    }
  });
};