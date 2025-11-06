import { BasePage } from './BasePage';
import { OS } from '../utils/OS';
import { Driver } from '../utils/Driver';

export class LydiaLoginPage extends BasePage {

    constructor() {
        super(null as any); // Will be initialized in init()
    }

    async init(): Promise<void> {
        this.driver = await Driver.getDriver();
    }

    // Localisateurs
    public getBesoinAideButton(): string {
        return OS.isAndroid()
            ? '//android.widget.TextView[@text="Besoin d\'aide ?"]'
            : '**/XCUIElementTypeButton[`name == "Besoin d\'aide ?"`]';
    }

    public getProblemeConnexionButton(): string {
        return OS.isAndroid()
            ? '//android.widget.TextView[contains(@text, "Un problème pour vous connecter")]'
            : '**/XCUIElementTypeStaticText[`name == " Un problème pour vous connecter ?"`]';
    }

    public getNumeroTelephoneInput(): string {
        return OS.isAndroid()
            ? '//android.widget.EditText[@text="06 12 34 56 78"]'
            : '**/XCUIElementTypeTextField[`value == "06 12 34 56 78"`]';
    }

    public getEmailInput(): string {
        return OS.isAndroid()
            ? '//android.widget.EditText[@text="e-mail@exemple.fr"]'
            : '**/XCUIElementTypeTextField[`value == "e-mail@exemple.fr"`]';
    }

    public getEnvoyerButton(): string {
        return OS.isAndroid()
            ? '//android.widget.Button[contains(@text, "Envoyer")]'
            : '~arrow orientation up size thic';
    }

    // Actions
    public async clickBesoinAide(): Promise<void> {
        await this.clickWithLog(this.getBesoinAideButton(), "Besoin d'aide");
    }

    public async clickProblemeConnexion(): Promise<void> {
        await this.clickWithLog(this.getProblemeConnexionButton(), "Un problème pour vous connecter");
    }

    public async saisirNumeroTelephone(numero: string): Promise<void> {
        await this.sendKeysWithLog(this.getNumeroTelephoneInput(), numero, "Numéro de téléphone");
    }

    public async saisirEmail(email: string): Promise<void> {
        await this.sendKeys(this.getEmailInput(), email);
        console.log(`✅ Saisi de l'email : ${email}`);
    }

    public async clickEnvoyer(): Promise<void> {
        await this.clickWithLog(this.getEnvoyerButton(), "Envoyer");
    }
}
import { OS } from '../utils/OS';

export class BasePage {
    protected driver: WebdriverIO.Browser;

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }

    // Méthodes d'attente
    protected async waitForClickable(selector: string): Promise<WebdriverIO.Element> {
        const element = await this.driver.$(selector);
        await element.waitForClickable({ timeout: 15000 });
        return element;
    }

    protected async waitForVisible(selector: string): Promise<WebdriverIO.Element> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: 15000 });
        return element;
    }

    // Actions de base
    protected async click(selector: string): Promise<void> {
        const element = await this.waitForClickable(selector);
        await element.click();
    }

    protected async sendKeys(selector: string, text: string): Promise<void> {
        const element = await this.waitForVisible(selector);
        await element.clearValue();
        await element.setValue(text);
    }

    // Vérifications
    protected async isElementPresent(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    // Gestion du clavier
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
                    try {
                        const doneButton = '~Done';
                        if (await this.isElementPresent(doneButton)) {
                            await this.click(doneButton);
                        } else {
                            const tapPoint = '//XCUIElementTypeApplication';
                            if (await this.isElementPresent(tapPoint)) {
                                await this.click(tapPoint);
                            }
                        }
                    } catch (e3) {
                        console.log("Impossible de masquer le clavier iOS : " + e3);
                    }
                }
            }
            await this.driver.pause(500);
        } catch (error) {
            console.log("Erreur lors de la tentative de masquage du clavier : " + error);
        }
    }

    // Actions avec logs
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

