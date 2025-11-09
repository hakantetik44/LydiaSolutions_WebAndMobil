import { Given, When, Then } from '@cucumber/cucumber';
import { HomePage } from '../pages/HomePage';
import { expect } from 'chai';

let homePage: HomePage;

Given('the app is launched', async function() {
    // Initialize HomePage and verify driver is ready
    homePage = new HomePage();
    await homePage.init();
    const driver = await (await import('../utils/Driver')).Driver.getDriver();
    expect(driver).to.not.be.null;
});

When('I scroll to the bottom of the welcome page', async function() {
    await homePage.scrollToBottomOfPage();
});

When('I swipe through the carousel until the last image', async function() {
    await homePage.swipeCarouselToLast();
});

When('I search for {string}', async function(searchTerm: string) {
    await homePage.searchFor(searchTerm);
    await homePage.selectSearchResult(searchTerm);
});

When('I scroll until I find the city {string} and dismiss the popup', async function(cityName: string) {
    await homePage.scrollToCityAndDismissPopup(cityName);
});

When('I change the website language to French', async function() {
    await homePage.changeLanguageToFrench();
});

When('I scroll down to the bottom of the page', async function() {
    await homePage.scrollToBottomOfPage();
});

Then('I click on {string} and navigate to the newly opened page', async function(linkText: string) {
    await homePage.clickOnLinkAndNavigate(linkText);
});
