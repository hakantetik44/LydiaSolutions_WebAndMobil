import { BaseApiClient } from './BaseApiClient';
import { ApiResponse } from '../utils/ApiResponse';

export interface CreateUserRequest {
    name: string;
    job: string;
}

export interface CreateUserResponse {
    name: string;
    job: string;
    id: string;
    createdAt: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface SingleUserResponse {
    data: User;
    support?: {
        url: string;
        text: string;
    };
}

export class ReqResApiClient extends BaseApiClient {
    constructor() {
        super('https://reqres.in/api');
    }

    /**
     * Create a new user
     * POST /api/users
     */
    async createUser(userData: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        return await this.post<CreateUserResponse>('/users', userData);
    }

    /**
     * Get a single user by ID
     * GET /api/users/{id}
     */
    async getUserById(userId: number): Promise<ApiResponse<SingleUserResponse>> {
        return await this.get<SingleUserResponse>(`/users/${userId}`);
    }

    /**
     * Get list of users
     * GET /api/users?page={page}
     */
    async getUsers(page: number = 1): Promise<ApiResponse<any>> {
        return await this.get<any>(`/users?page=${page}`);
    }
}

