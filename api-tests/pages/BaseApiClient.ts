import { ApiConfig } from '../config/api.config';
import { ApiResponse, ApiResponseHelper } from '../utils/ApiResponse';

export class BaseApiClient {
    protected baseUrl: string;
    protected defaultHeaders: Record<string, string>;
    protected timeout: number;

    constructor(baseUrl: string = ApiConfig.BASE_URL) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = { ...ApiConfig.HEADERS };
        this.timeout = ApiConfig.TIMEOUT;
    }

    protected async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        const startTime = Date.now();
        const url = `${this.baseUrl}${endpoint}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: mergedHeaders,
                signal: AbortSignal.timeout(this.timeout)
            });

            const responseTime = Date.now() - startTime;
            const data = await response.json() as T;

            return ApiResponseHelper.create<T>(
                response.status,
                response.statusText,
                data,
                this.headersToObject(response.headers),
                responseTime
            );
        } catch (error: any) {
            const responseTime = Date.now() - startTime;
            throw new Error(`GET request failed: ${error.message} (Response time: ${responseTime}ms)`);
        }
    }

    protected async post<T>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        const startTime = Date.now();
        const url = `${this.baseUrl}${endpoint}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        try {
            // Debug logs: show URL and headers used for the request
            console.log(`[BaseApiClient] POST ${url}`);
            console.log('[BaseApiClient] Headers:', mergedHeaders);
            console.log('[BaseApiClient] Body:', JSON.stringify(body));

            const response = await fetch(url, {
                method: 'POST',
                headers: mergedHeaders,
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(this.timeout)
            });

            const responseTime = Date.now() - startTime;
            const data = await response.json() as T;

            return ApiResponseHelper.create<T>(
                response.status,
                response.statusText,
                data,
                this.headersToObject(response.headers),
                responseTime
            );
        } catch (error: any) {
            const responseTime = Date.now() - startTime;
            throw new Error(`POST request failed: ${error.message} (Response time: ${responseTime}ms)`);
        }
    }

    private headersToObject(headers: Headers): Record<string, string> {
        const result: Record<string, string> = {};
        headers.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
}
