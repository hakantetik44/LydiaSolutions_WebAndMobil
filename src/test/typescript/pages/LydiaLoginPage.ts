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
            : '-ios class chain:**/XCUIElementTypeButton[`name == "Besoin d\'aide ?"`]';
    }

    public getProblemeConnexionButton(): string {
        return OS.isAndroid()
            ? '//android.widget.TextView[contains(@text, "Un problème pour vous connecter")]'
            : '-ios class chain:**/XCUIElementTypeStaticText[`name == " Un problème pour vous connecter ?"`]';
    }

    public getNumeroTelephoneInput(): string {
        return OS.isAndroid()
            ? '//android.widget.EditText[@text="06 12 34 56 78"]'
            : '-ios class chain:**/XCUIElementTypeTextField[`value == "06 12 34 56 78"`]';
    }

    public getEmailInput(): string {
        return OS.isAndroid()
            ? '//android.widget.EditText[@text="e-mail@exemple.fr"]'
            : '-ios class chain:**/XCUIElementTypeTextField[`value == "e-mail@exemple.fr"`]';
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

