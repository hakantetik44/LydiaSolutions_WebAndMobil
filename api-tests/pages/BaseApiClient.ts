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

    protected async put<T>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        const startTime = Date.now();
        const url = `${this.baseUrl}${endpoint}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        try {
            const response = await fetch(url, {
                method: 'PUT',
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
            throw new Error(`PUT request failed: ${error.message} (Response time: ${responseTime}ms)`);
        }
    }

    protected async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        const startTime = Date.now();
        const url = `${this.baseUrl}${endpoint}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: mergedHeaders,
                signal: AbortSignal.timeout(this.timeout)
            });

            const responseTime = Date.now() - startTime;
            let data: any = {};
            
            // Try to parse JSON if response has body
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch {
                    // If no body, keep empty object
                }
            }

            return ApiResponseHelper.create<T>(
                response.status,
                response.statusText,
                data,
                this.headersToObject(response.headers),
                responseTime
            );
        } catch (error: any) {
            const responseTime = Date.now() - startTime;
            throw new Error(`DELETE request failed: ${error.message} (Response time: ${responseTime}ms)`);
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

