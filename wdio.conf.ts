import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    runner: 'local',
    specs: [
        './src/test/resources/features/**/*.feature'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [],
    logLevel: 'silent',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'target/allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    cucumberOpts: {
        require: ['./src/test/typescript/stepDefinitions/**/*.ts'],
        backtrace: false,
        requireModule: ['ts-node/register'],
        dryRun: false,
        failFast: false,
        format: ['pretty'],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    //
    // =====
    // Hooks
    // =====
    beforeSession: function (config, capabilities, specs) {
        require('ts-node').register({ files: true });
    },
};
