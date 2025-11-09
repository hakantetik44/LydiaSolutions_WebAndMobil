import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { LaunchGenerator } from './LaunchGenerator';

const execAsync = promisify(exec);

export class ApiAllureEnhancer {
    private allureResultsDir: string;

    constructor(allureResultsDir: string = 'target/allure-api-results') {
        this.allureResultsDir = path.resolve(process.cwd(), allureResultsDir);
        this.ensureDirectoryExists(this.allureResultsDir);
    }

    /**
     * 🚀 Run all Allure enhancements at once
     */
    public async enhanceAllureReport(): Promise<void> {
        console.log('\n🎨 Enhancing API Allure report...\n');

        try {
            // 1. Add environment information
            await this.generateEnvironmentProperties();
            console.log('✅ Environment information added');

            // 2. Add categories (error classification)
            await this.generateCategories();
            console.log('✅ Test categories created');

            // 3. Add executor information
            await this.generateExecutor();
            console.log('✅ Executor information added');

            // 4. Generate launch.json
            const launchGen = new LaunchGenerator(this.allureResultsDir);
            launchGen.generateLaunch();

            console.log('\n🎉 API Allure report successfully enhanced!\n');
        } catch (error) {
            console.error('❌ Allure enhancement error:', error);
        }
    }

    /**
     * 📱 Generate environment properties file (Allure compatible)
     */
    private async generateEnvironmentProperties(): Promise<void> {
        const userName = await this.getUserName();
        const nodeVersion = process.version;
        const executionDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const envInfo = {
            'API Base URL': process.env.API_BASE_URL || 'https://reqres.in/api',
            'Node Version': nodeVersion,
            'Test Environment': process.env.TEST_ENV || 'LOCAL',
            'Execution Date': executionDate,
            'Executor': userName,
            'Framework': 'Cucumber + TypeScript',
            'Test Type': 'API Tests'
        };

        const propertiesContent = Object.entries(envInfo)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const propertiesPath = path.join(this.allureResultsDir, 'environment.properties');
        fs.writeFileSync(propertiesPath, propertiesContent, 'utf-8');
    }

    /**
     * 📊 Create test categories (error classification)
     */
    private async generateCategories(): Promise<void> {
        const categories = [
            {
                name: '🐛 API Errors',
                matchedStatuses: ['failed'],
                messageRegex: '.*(401|403|404|500|502|503).*'
            },
            {
                name: '⚠️ Test Defects',
                matchedStatuses: ['failed', 'broken'],
                messageRegex: '.*(AssertionError|Expected|Actual|Timeout).*'
            },
            {
                name: '🌊 Network Issues',
                matchedStatuses: ['failed', 'broken'],
                messageRegex: '.*(ECONNREFUSED|ETIMEDOUT|network|connection).*'
            },
            {
                name: '✅ Passed Tests',
                matchedStatuses: ['passed']
            },
            {
                name: '⊘ Skipped Tests',
                matchedStatuses: ['skipped']
            }
        ];

        const categoriesPath = path.join(this.allureResultsDir, 'categories.json');
        fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf-8');
    }

    /**
     * 👤 Generate executor information (who ran the tests)
     */
    private async generateExecutor(): Promise<void> {
        const buildNumber = process.env.BUILD_NUMBER || Date.now().toString();
        const userName = await this.getUserName();

        const executor = {
            name: process.env.CI ? 'CI/CD Pipeline' : `Local - ${userName}`,
            type: process.env.CI ? 'jenkins' : 'local',
            buildOrder: parseInt(buildNumber),
            buildName: `API Tests Build #${buildNumber}`,
            buildUrl: process.env.BUILD_URL || undefined,
            reportUrl: process.env.REPORT_URL || undefined,
            reportName: 'Lydia API Tests'
        };

        const executorPath = path.join(this.allureResultsDir, 'executor.json');
        fs.writeFileSync(executorPath, JSON.stringify(executor, null, 2), 'utf-8');
    }

    /**
     * 👤 Get current user name
     */
    private async getUserName(): Promise<string> {
        try {
            const { stdout } = await execAsync('whoami');
            return stdout.trim();
        } catch {
            return process.env.USER || process.env.USERNAME || 'Unknown User';
        }
    }

    /**
     * 📁 Ensure directory exists
     */
    private ensureDirectoryExists(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }
}

