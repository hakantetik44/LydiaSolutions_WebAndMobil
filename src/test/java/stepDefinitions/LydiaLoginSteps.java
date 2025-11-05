package stepDefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.junit.Assert;
import pages.LydiaLoginPage;
import utils.Driver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class LydiaLoginSteps {
    private LydiaLoginPage loginPage;
    private WebDriverWait wait;

    public LydiaLoginSteps() {
        loginPage = new LydiaLoginPage();
        wait = new WebDriverWait(Driver.getDriver(), Duration.ofSeconds(20));
    }

    @Given("l'application Lydia est lancée")
    public void lApplicationLydiaEstLancee() {
        Assert.assertNotNull("Le driver devrait être initialisé", Driver.getDriver());
        System.out.println("Application Lydia lancée avec succès");
        wait.until(ExpectedConditions.elementToBeClickable(loginPage.getBesoinAideButton()));
    }

    @When("l'utilisateur clique sur {string}")
    public void lUtilisateurCliqueSur(String bouton) {
        switch (bouton) {
            case "Besoin d'aide":
                wait.until(ExpectedConditions.elementToBeClickable(loginPage.getBesoinAideButton()));
                loginPage.clickBesoinAide();
                break;
            case "Un problème pour vous connecter":
                wait.until(ExpectedConditions.elementToBeClickable(loginPage.getProblemeConnexionButton()));
                loginPage.clickProblemeConnexion();
                break;
            default:
                throw new IllegalArgumentException("Bouton non reconnu : " + bouton);
        }
        System.out.println("Clic sur le bouton : " + bouton);
    }

    @And("l'utilisateur saisit le numéro {string}")
    public void lUtilisateurSaisitLeNumero(String numero) {
        wait.until(ExpectedConditions.elementToBeClickable(loginPage.getNumeroTelephoneInput()));
        loginPage.saisirNumeroTelephone(numero);
    }

    @And("l'utilisateur saisit l'email {string}")
    public void lUtilisateurSaisitEmail(String email) {
        loginPage.saisirEmail(email);
    }

    @Then("l'utilisateur envoie la demande d'aide")
    public void lUtilisateurEnvoieLaDemandeDaide() {
        wait.until(ExpectedConditions.elementToBeClickable(loginPage.getEnvoyerButton()));
        loginPage.clickEnvoyer();
    }
}
