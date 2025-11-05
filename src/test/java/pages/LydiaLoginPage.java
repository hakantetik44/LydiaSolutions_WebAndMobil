package pages;

import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import utils.OS;
import utils.Driver;

public class LydiaLoginPage extends BasePage {

    public LydiaLoginPage() {
        super(Driver.getDriver());
    }

    // Localisateurs
    public By getBesoinAideButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[@text='Besoin d'aide ?']") :
                AppiumBy.iOSClassChain("**/XCUIElementTypeButton[`name == \"Besoin d'aide ?\"`]");
    }

    public By getProblemeConnexionButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[contains(@text, 'Un problème pour vous connecter')]") :
                AppiumBy.iOSClassChain("**/XCUIElementTypeStaticText[`name == \" Un problème pour vous connecter ?\"`]");
    }

    public By getNumeroTelephoneInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@text='06 12 34 56 78']") :
                AppiumBy.iOSClassChain("**/XCUIElementTypeTextField[`value == \"06 12 34 56 78\"`]");
    }

    public By getEmailInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@text='e-mail@exemple.fr']") :
                AppiumBy.iOSClassChain("**/XCUIElementTypeTextField[`value == \"e-mail@exemple.fr\"`]");
    }

    public By getEnvoyerButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.Button[contains(@text, 'Envoyer')]") :
                AppiumBy.accessibilityId("arrow orientation up size thic");
    }

    // Actions
    public void clickBesoinAide() {
        clickWithLog(getBesoinAideButton(), "Besoin d'aide");
    }

    public void clickProblemeConnexion() {
        clickWithLog(getProblemeConnexionButton(), "Un problème pour vous connecter");
    }

    public void saisirNumeroTelephone(String numero) {
        sendKeysWithLog(getNumeroTelephoneInput(), numero, "Numéro de téléphone");
    }

    public void saisirEmail(String email) {
        sendKeys(getEmailInput(), email);
        System.out.println("✅ Saisi de l'email : " + email);
    }

    public void clickEnvoyer() {
        clickWithLog(getEnvoyerButton(), "Envoyer");
    }
}
