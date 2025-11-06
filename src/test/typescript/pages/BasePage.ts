import { OS } from '../utils/OS';

export class BasePage {
    protected driver: WebdriverIO.Browser;

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }

    protected async waitForClickable(selector: string) {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: 15000 });
        return element;
    }

    protected async waitForVisible(selector: string) {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: 15000 });
        return element;
    }

    protected async click(selector: string): Promise<void> {
        const element = await this.waitForClickable(selector);
        await element.click();
    }

    protected async sendKeys(selector: string, text: string): Promise<void> {
        const element = await this.waitForVisible(selector);
        await element.clearValue();
        await element.setValue(text);
    }

    protected async isElementPresent(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    protected async hideKeyboard(): Promise<void> {
        try {
            if (OS.isAndroid()) {
                try {
                    await this.driver.hideKeyboard();
                } catch (e1) {
                    await this.driver.back();
                }
            } else {
                try {
                    await this.driver.hideKeyboard();
                } catch (e2) {
                    console.log("Impossible de masquer le clavier iOS");
                }
            }
            await this.driver.pause(500);
        } catch (error) {
            console.log("Erreur lors de la tentative de masquage du clavier : " + error);
        }
    }

    protected async clickWithLog(selector: string, elementName: string): Promise<void> {
        try {
            console.log(`🔍 Tentative de clic sur ${elementName}`);
            await this.click(selector);
            console.log(`✅ Clic réussi sur ${elementName}`);
        } catch (error) {
            console.log(`❌ Erreur lors du clic sur ${elementName} : ${error}`);
            throw error;
        }
    }

    protected async sendKeysWithLog(selector: string, text: string, fieldName: string): Promise<void> {
        try {
            console.log(`⌨️  Saisie de '${text}' dans ${fieldName}`);
            await this.sendKeys(selector, text);
            await this.hideKeyboard();
            console.log(`✅ Saisie réussie dans ${fieldName}`);
        } catch (error) {
            console.log(`❌ Erreur lors de la saisie dans ${fieldName} : ${error}`);
            throw error;
        }
    }
}

