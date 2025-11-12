import { BasePage } from './BasePage';
import { Driver } from '../utils/Driver';
import { OS } from '../utils/OS';
import { expect } from 'chai';

export class HomePage extends BasePage {
    constructor() {
        super(null as any);
    }

    public getSkipButton(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/fragment_onboarding_skip_button'
            : '~Skip';
    }

    public getSearchButton(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/navigation_bar_item_icon_container'
            : '-ios class chain:**/XCUIElementTypeSearchField';
    }

    public getSearchInput(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/search_src_text'
            : '-ios class chain:**/XCUIElementTypeSearchField';
    }

    public getFirstSearchResult(query: string): string {
        return OS.isAndroid()
            ? `android=new UiSelector().textContains("${query}")`
            : `-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "${query}"`;
    }

    public getSearchFallbackInput(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().className("android.widget.EditText")'
            : '-ios class chain:**/XCUIElementTypeTextField';
    }

    public getCityLocator(cityName: string): string {
        return OS.isAndroid()
            ? `android=new UiSelector().textContains("${cityName}")`
            : `-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "${cityName}"`;
    }

    public getPopupCloseButtons(): string[] {
        return OS.isAndroid()
            ? [
                'id=org.wikipedia.alpha:id/closeButton',
                '~Close'
            ]
            : [
                '~Close'
            ];
    }

    public getLanguageButton(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().textContains("Lang")'
            : '~language';
    }

    public getLanguageMenuSearchButton(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().textContains("Search")'
            : '-ios class chain:**/XCUIElementTypeButton';
    }

    public getLanguageMenuSearchField(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/search_src_text'
            : '-ios class chain:**/XCUIElementTypeTextField';
    }

    public getFrenchLanguageOption(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().textContains("Français")'
            : '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "Français"';
    }

    public getLinkLocator(linkText: string): string {
        return OS.isAndroid()
            ? `android=new UiSelector().textContains("${linkText}")`
            : `-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "${linkText}"`;
    }

    public getLinkFallbackLocator(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().textContains("Cr")'
            : '-ios class chain:**/XCUIElementTypeStaticText';
    }

    public getLinkPreviewSecondaryButton(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/link_preview_secondary_button'
            : '-ios class chain:**/XCUIElementTypeButton';
    }

    public getCresusPageTitle(): string {
        return OS.isAndroid()
            ? 'android=new UiSelector().textContains("Crésus")'
            : '-ios predicate string:type == "XCUIElementTypeStaticText" AND name == "Crésus"';
    }

    public getTabsCountButton(): string {
        return OS.isAndroid()
            ? 'id=org.wikipedia.alpha:id/tabsCountText'
            : '-ios class chain:**/XCUIElementTypeButton';
    }

    async init(): Promise<void> {
        this.driver = await Driver.getDriver();
        // Dismiss onboarding (Skip) if present
        try {
            const skip = await this.driver.$(this.getSkipButton());
            if (await skip.isExisting() && await skip.isDisplayed()) {
                await skip.click();
            }
        } catch { }
        try {
            await this.scrollMultipleTimes(3, 'down', 150);
        } catch { }
    }

    public async swipeCarouselToLast(): Promise<void> {
        await this.scrollToBottom();
    }

    public async searchFor(query: string): Promise<void> {
        await this.doubleClick(this.getSearchButton());
        const input = await this.waitForElement(this.getSearchInput(), 10);
        await input.setValue(query);
        await this.hideKeyboard();
    }

    public async selectSearchResult(query: string): Promise<void> {
        const result = await this.waitForElement(this.getFirstSearchResult(query), 10);
        await result.click();
        try {
            for (const sel of this.getPopupCloseButtons()) {
                try {
                    const el = await this.driver.$(sel);
                    if (await el.isExisting() && await el.isDisplayed()) {
                        await el.click();
                        break;
                    }
                } catch { }
            }
        } catch { }
    }

    public async scrollToCityAndDismissPopup(cityName: string): Promise<void> {
        const citySelector = this.getCityLocator(cityName);
        const found = await this.scrollToElement(citySelector, 12, 'down');
        if (!found) return;
        await this.safeClick(citySelector);
    }

    public async changeLanguageToFrench(): Promise<void> {
        await this.safeClick(this.getLanguageButton());
        await this.safeClick(this.getLanguageMenuSearchButton());

        const field = await this.waitForElement(this.getLanguageMenuSearchField(), 5);
        await field.setValue('Français');
        await this.hideKeyboard();

        const option = await this.waitForElement(this.getFrenchLanguageOption(), 10);
        await option.click();
    }

    public async scrollToBottomOfPage(): Promise<void> {
        await this.scrollToBottom();
    }

    public async clickOnLinkAndNavigate(linkText: string): Promise<void> {
        const selector = this.getLinkLocator(linkText);
        const fallback = this.getLinkFallbackLocator();
        await this.scrollUntilVisible(selector, 'down', 70, 250);
        await this.clickWithFallback(selector, fallback);
        // Open link preview secondary (open in new tab)
        await this.safeClick(this.getLinkPreviewSecondaryButton(), 5);
        // Open tabs list to reveal newly opened page
        await this.safeClick(this.getTabsCountButton(), 5);
        // Ensure target page title appears
        await this.scrollUntilVisible(this.getCresusPageTitle(), 'down', 40, 250);
        await this.safeClick(this.getCresusPageTitle(), 5);
        const titleEl = await this.waitForElement(this.getCresusPageTitle(), 10);
        expect(await titleEl.isDisplayed(), 'Crésus page title should be visible after navigation').to.equal(true);
    }
}