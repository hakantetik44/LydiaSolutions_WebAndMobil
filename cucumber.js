module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/test/typescript/stepDefinitions/**/*.ts'],
    format: [
      'progress',
      'summary',
      'json:target/cucumber.json',
      'html:target/cucumber-reports/cucumber-reports.html',
      'json:target/cucumber-reports/CucumberTestReport.json',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'target/allure-results',
      colorsEnabled: true
    },
    paths: ['src/test/resources/features/**/*.feature'],
    dryRun: false,
    parallel: 1,
    timeout: 120000
  }
};

