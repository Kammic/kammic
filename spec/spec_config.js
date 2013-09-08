// Karma configuration
// Generated on Sun Sep 08 2013 09:28:33 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'javascript/**/*Spec.js',
      '../app/assets/javascripts/lib/angular/**/*.js',
      '../app/assets/javascripts/editor/**/*.js',
    ],
    exclude: [],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: true
  });
};
