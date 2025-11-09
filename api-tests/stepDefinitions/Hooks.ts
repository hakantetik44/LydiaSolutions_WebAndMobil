import { Before, After, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { ApiAllureEnhancer } from '../utils/ApiAllureEnhancer';

const execAsync = promisify(exec);

// Set default timeout for API tests
setDefaultTimeout(60000);

// Context to store API responses between steps
export const apiContext: {
    lastResponse?: any;
    createdUserId?: string;
    fetchedUser?: any;
    userData?: any;
    userIdToFetch?: number;
} = {};

Before(async function() {
    // Initialize context for each scenario
    apiContext.lastResponse = undefined;
    apiContext.createdUserId = undefined;
    apiContext.fetchedUser = undefined;
    apiContext.userData = undefined;
    apiContext.userIdToFetch = undefined;
    
    console.log('🚀 Starting API test scenario...');
});

After(async function(scenario) {
    // Attach response details to Allure report if test failed
    if (scenario.result?.status === 'FAILED' && apiContext.lastResponse) {
        try {
            const responseDetails = {
                status: apiContext.lastResponse.status,
                statusText: apiContext.lastResponse.statusText,
                data: apiContext.lastResponse.data,
                responseTime: apiContext.lastResponse.responseTime
            };
            await this.attach(JSON.stringify(responseDetails, null, 2), 'application/json');
        } catch (error) {
            console.warn('Failed to attach response details:', error);
        }
    }
    
    console.log('✅ API test scenario completed');
});

// Generate Allure report after all API tests complete
AfterAll(async function() {
    const isCI = process.env.CI === 'true' || process.env.CI === '1';
    console.log('\n' + '='.repeat(60));
    console.log('📊 Generating API Allure report...');
    console.log('='.repeat(60));

    try {
        // Enhance Allure report with metadata
        const enhancer = new ApiAllureEnhancer();
        await enhancer.enhanceAllureReport();

        // Generate Allure report for API tests
        if (isCI) {
            await execAsync('allure generate target/allure-api-results --clean -o target/allure-api-report');
            console.log('✅ API Allure report generated (CI mode).');
        } else {
            await execAsync('allure generate target/allure-api-results --clean -o target/allure-api-report');
            console.log('✅ API Allure report generated.');
            
            // Try to open the report
            try {
                await execAsync('open target/allure-api-report/index.html');
                console.log('📊 API Allure report opened in browser.');
            } catch (e) {
                console.log('ℹ️  Open the report manually: open target/allure-api-report/index.html');
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ API Allure report finalized.');
        console.log('='.repeat(60) + '\n');
    } catch (error) {
        console.error('⚠️ API Allure report generation error:', error);
    }
});

