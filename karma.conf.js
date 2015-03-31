// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all systemjs patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'systemjs', // https://www.npmjs.com/package/karma-systemjs
      'chai' // integration with chai to avoid require() calls in each test
    ],

    plugins:[
      'karma-mocha',
      'karma-coverage',
      'karma-systemjs',
      'karma-phantomjs-launcher',
      'karma-chai'
    ],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      //'Chrome' // export CHROME_BIN=/usr/bin/chromium-browser
      'PhantomJS'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage']
     // 'test/**/*.js': ['espower']
    },

    // Configure path "rewrites"
    proxies: {
      '/jspm_packages': '/base/jspm_packages'
    },

    systemjs: {
      // Path to your SystemJS configuration file
      configFile: 'src/system.config.js',

      // File patterns for your application code, dependencies, and test suites
      files: [
        'jspm_packages/**/*',
        'src/**/*.js',
        'test/**/*.js'
      ],

      // SystemJS configuration specifically for tests, added after your config file.
      // Good for adding test libraries and mock modules
      config: {
        transpiler: 'babel',
        paths: {
         // path overrides go here
        }
      }

      // Specify the suffix used for test suite file names.  Defaults to .test.js, .spec.js, _test.js, and _spec.js
      //testFileSuffix: '.spec.js'
    },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }

  });
};
