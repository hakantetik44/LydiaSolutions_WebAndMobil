export class ApiConfig {
    public static readonly BASE_URL: string = process.env.API_BASE_URL || 'https://reqres.in/api';
    public static readonly TIMEOUT: number = parseInt(process.env.API_TIMEOUT || '30000');
    public static readonly HEADERS: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    };
}

