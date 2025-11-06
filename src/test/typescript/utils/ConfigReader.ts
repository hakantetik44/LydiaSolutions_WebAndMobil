import * as fs from 'fs';
import * as path from 'path';

export class ConfigReader {
    private static properties: Map<string, string> = new Map();

    static {
        const configPath = path.join(process.cwd(), 'src/test/resources/configuration.properties');
        try {
            const content = fs.readFileSync(configPath, 'utf-8');
            const lines = content.split('\n');

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const separatorIndex = trimmedLine.indexOf('=');
                    if (separatorIndex > 0) {
                        const key = trimmedLine.substring(0, separatorIndex).trim();
                        const value = trimmedLine.substring(separatorIndex + 1).trim();
                        this.properties.set(key, value);
                    }
                }
            }
        } catch (error) {
            console.log(`Fichier de configuration non trouvé à l'emplacement : ${configPath}`);
        }
    }

    public static getProperty(key: string, defaultValue?: string): string | undefined {
        const value = this.properties.get(key);
        return value !== undefined ? value : defaultValue;
    }
}

