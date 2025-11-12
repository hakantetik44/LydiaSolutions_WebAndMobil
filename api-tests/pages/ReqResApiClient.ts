import { BaseApiClient } from './BaseApiClient';
import { ApiResponse } from '../utils/ApiResponse';

export interface CreateUserRequest {
    name: string;
    job: string;
}

export interface CreateUserResponse {
    id: string;
    name: string;
    job: string;
    createdAt: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface UsersListResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
    support?: any;
    _meta?: any;
}

export class ReqResApiClient extends BaseApiClient {
    constructor() {
        super();
    }


    async createUser(user: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        return this.post<CreateUserResponse>('', user, { 'Content-Type': 'application/json' });
    }


    async getUserById(userId: number): Promise<ApiResponse<{ data: User }>> {
        return this.get<{ data: User }>(`/${userId}`);
    }


    async getUsers(page: number = 1): Promise<ApiResponse<UsersListResponse>> {
        return await this.get<UsersListResponse>(`?page=${page}`);
    }
}
