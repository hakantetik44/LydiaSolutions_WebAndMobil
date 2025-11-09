import * as fs from 'fs';
import * as path from 'path';

export class LaunchGenerator {
    private allureResultsDir: string;

    constructor(allureResultsDir: string = 'target/allure-api-results') {
        this.allureResultsDir = path.resolve(process.cwd(), allureResultsDir);
    }

    /**
     * Generate launch.json file for Allure report
     */
    public generateLaunch(): void {
        try {
            // Find all result files
            const files = fs.readdirSync(this.allureResultsDir);
            const resultFiles = files.filter(f => f.endsWith('-result.json'));
            
            if (resultFiles.length === 0) {
                console.warn('No result files found for launch.json');
                return;
            }

            // Read first result file to get test info
            const firstResultPath = path.join(this.allureResultsDir, resultFiles[0]);
            const firstResult = JSON.parse(fs.readFileSync(firstResultPath, 'utf-8'));

            // Create launch data
            const launch = {
                name: firstResult.fullName || 'API Tests',
                number: 1,
                start: firstResult.start || Date.now(),
                stop: firstResult.stop || Date.now()
            };

            // Write launch.json to results directory (Allure will pick it up)
            const launchPath = path.join(this.allureResultsDir, 'launch.json');
            fs.writeFileSync(launchPath, JSON.stringify(launch, null, 2), 'utf-8');
            
            console.log('✅ Launch.json generated');
        } catch (error) {
            console.warn('Failed to generate launch.json:', error);
        }
    }
}

