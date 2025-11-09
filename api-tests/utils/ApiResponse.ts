export interface ApiResponse<T = any> {
    status: number;
    statusText: string;
    data: T;
    headers: Record<string, string>;
    responseTime: number;
}

export class ApiResponseHelper {
    static create<T>(status: number, statusText: string, data: T, headers: Record<string, string> = {}, responseTime: number = 0): ApiResponse<T> {
        return {
            status,
            statusText,
            data,
            headers,
            responseTime
        };
    }
}

