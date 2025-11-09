module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['api-tests/stepDefinitions/**/*.ts'],
    format: [
      'progress',
      'summary',
      'json:target/cucumber-api.json',
      'html:target/cucumber-api-reports/cucumber-reports.html',
      'json:target/cucumber-api-reports/CucumberTestReport.json',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'target/allure-api-results',
      colorsEnabled: true
    },
    paths: ['api-tests/features/**/*.feature'],
    dryRun: false,
    parallel: 1,
    timeout: 60000
  }
};

