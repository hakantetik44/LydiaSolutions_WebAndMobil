import { ConfigReader } from '../utils/ConfigReader';

const platform = (process.env.platformName || ConfigReader.getProperty('platformName', 'android') || 'android').toLowerCase();
let tags = '';

// Set platform for environment
process.env['allure.environment.platform'] = platform.toUpperCase();

switch (platform) {
    case 'android':
        tags = '@android';
        break;
    case 'ios':
        tags = '@ios';
        break;
    case 'web':
        tags = '@web';
        break;
    default:
        tags = '@all';
}

export const cucumberConfig = {
    require: ['src/test/typescript/stepDefinitions/**/*.ts'],
    format: [
        'json:target/cucumber.json',
        'html:target/cucumber-reports/cucumber-reports.html',
        'progress-bar',
        '@cucumber/pretty-formatter',
        'json:target/cucumber-reports/CucumberTestReport.json'
    ],
    paths: ['src/test/resources/features'],
    publishQuiet: true,
    dryRun: false,
    tags: tags
};

export default cucumberConfig;

