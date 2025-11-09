import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { ReqResApiClient, CreateUserRequest } from '../pages/ReqResApiClient';
import { apiContext } from './Hooks';

const apiClient = new ReqResApiClient();

Given('I have a valid user data with name {string} and job {string}', async function(name: string, job: string) {
    apiContext.userData = { name, job } as CreateUserRequest;
    console.log(`User data prepared: name=${name}, job=${job}`);
});

When('I send a POST request to create a user', async function() {
    const userData = apiContext.userData as CreateUserRequest;
    if (!userData) {
        throw new Error('User data not set. Please use Given step to set user data first.');
    }

    console.log('Sending POST request to /api/users');
    const response = await apiClient.createUser(userData);
    apiContext.lastResponse = response;
    apiContext.createdUserId = response.data.id;
    
    // Attach request and response to Allure
    await this.attach(JSON.stringify({ request: userData }, null, 2), 'application/json');
    await this.attach(JSON.stringify({ response: response.data, status: response.status }, null, 2), 'application/json');
});

Then('the response status code should be {int}', async function(expectedStatus: number) {
    const response = apiContext.lastResponse;
    if (!response) {
        throw new Error('No API response available. Make sure to send a request first.');
    }

    console.log(`Verifying status code is ${expectedStatus}`);
    expect(response.status).to.equal(expectedStatus, 
        `Expected status code ${expectedStatus} but got ${response.status}`);
});

Then('the response should contain the created user with name {string} and job {string}', async function(expectedName: string, expectedJob: string) {
    const response = apiContext.lastResponse;
    if (!response || !response.data) {
        throw new Error('No response data available.');
    }

    console.log('Validating created user data');
    expect(response.data.name).to.equal(expectedName, 
        `Expected name "${expectedName}" but got "${response.data.name}"`);
    expect(response.data.job).to.equal(expectedJob, 
        `Expected job "${expectedJob}" but got "${response.data.job}"`);
    expect(response.data.id).to.exist;
    expect(response.data.createdAt).to.exist;
});

Given('I want to fetch user with ID {int}', async function(userId: number) {
    apiContext.userIdToFetch = userId;
    console.log(`Preparing to fetch user with ID ${userId}`);
});

When('I send a GET request to fetch the user', async function() {
    const userId = apiContext.userIdToFetch as number;
    if (!userId) {
        throw new Error('User ID not set. Please use Given step to set user ID first.');
    }

    console.log(`Sending GET request to /api/users/${userId}`);
    const response = await apiClient.getUserById(userId);
    apiContext.lastResponse = response;
    apiContext.fetchedUser = response.data.data;
    
    // Attach response to Allure
    await this.attach(JSON.stringify({ response: response.data, status: response.status }, null, 2), 'application/json');
});

Then('the response should contain user data with id {int}, email {string}, first_name {string}, and last_name {string}', 
    async function(expectedId: number, expectedEmail: string, expectedFirstName: string, expectedLastName: string) {
    const user = apiContext.fetchedUser;
    if (!user) {
        throw new Error('No user data available. Make sure to fetch a user first.');
    }

    console.log('Validating fetched user data');
    expect(user.id).to.equal(expectedId, 
        `Expected ID ${expectedId} but got ${user.id}`);
    expect(user.email).to.equal(expectedEmail, 
        `Expected email "${expectedEmail}" but got "${user.email}"`);
    expect(user.first_name).to.equal(expectedFirstName, 
        `Expected first_name "${expectedFirstName}" but got "${user.first_name}"`);
    expect(user.last_name).to.equal(expectedLastName, 
        `Expected last_name "${expectedLastName}" but got "${user.last_name}"`);
    expect(user.avatar).to.exist;
});

Then('the response time should be less than {int} milliseconds', async function(maxResponseTime: number) {
    const response = apiContext.lastResponse;
    if (!response) {
        throw new Error('No API response available.');
    }

    console.log(`Verifying response time is less than ${maxResponseTime}ms`);
    expect(response.responseTime).to.be.lessThan(maxResponseTime, 
        `Response time ${response.responseTime}ms exceeded maximum ${maxResponseTime}ms`);
});

