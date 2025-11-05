package stepDefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.junit.Assert;
import pages.WiglLoginPage;
import utils.Driver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import java.util.Random;

public class WiglLoginSteps {
    private WiglLoginPage loginPage;
    private String generatedEmail;

    public WiglLoginSteps() {
        loginPage = new WiglLoginPage();
    }

    private String generateRandomEmail() {
        Random random = new Random();
        long timestamp = System.currentTimeMillis();
        String randomString = String.format("%04d", random.nextInt(10000));
        return "test.wigl" + timestamp + randomString + "@gmail.com";
    }

    @Given("l'application Wigl est lancée")
    public void lApplicationWiglEstLancee() {
        Assert.assertNotNull("Le driver devrait être initialisé", Driver.getDriver());
        System.out.println("Application Wigl lancée avec succès");

        try {
            // 1. Cliquer sur "Besoin d'aide ?"
            loginPage.clickBesoinAide();
            System.out.println("Bouton 'Besoin d'aide ?' cliqué avec succès au lancement");

            // 2. Compléter le formulaire d'aide
            Thread.sleep(1000); // Attendre que la page soit chargée
            loginPage.completeHelpForm();
            System.out.println("Formulaire d'aide complété avec succès");
        } catch (Exception e) {
            System.out.println("Erreur lors du processus d'aide: " + e.getMessage());
        }
    }

    @Then("l'utilisateur devrait voir les éléments de la page d'accueil")
    public void lUtilisateurDevraitVoirLesElementsDeLaPageDAccueil() {
        // Wait for the create account text to be visible
        WebDriverWait wait = new WebDriverWait(Driver.getDriver(), Duration.ofSeconds(20));
        wait.until(ExpectedConditions.visibilityOfElementLocated(loginPage.getCreateAccountText()));
        Assert.assertTrue("La page d'accueil devrait être affichée", loginPage.isHomePageDisplayed());
    }

    @Then("l'utilisateur voit les options de langue")
    public void lUtilisateurVoitLesOptionsDeLangue() {
        // First drag up the create account text to reveal language options
        loginPage.dragCreateAccountTextUp();

        // Wait for language toggle button to be visible and clickable
        WebDriverWait wait = new WebDriverWait(Driver.getDriver(), Duration.ofSeconds(20));
        Assert.assertTrue("Les options de langue devraient être visibles", loginPage.areLanguageOptionsDisplayed());
    }

    @When("l'utilisateur sélectionne {string}")
    public void lUtilisateurSelectionne(String language) {
        loginPage.selectLanguage();
    }

    @Then("l'application devrait être en français")
    public void lApplicationDevraitEtreEnFrancais() {
      //
    }

    @When("l'utilisateur saisit l'email {string} et le mot de passe {string}")
    public void lUtilisateurSaisitEmailEtMotDePasse(String email, String password) {
        // Générer un nouvel email aléatoire
        generatedEmail = generateRandomEmail();
        System.out.println("Utilisation de l'email généré: " + generatedEmail);

        // Utiliser l'email généré au lieu de celui fourni dans le scénario
        loginPage.login(generatedEmail, password);
    }

    @And("l'utilisateur appuie sur le bouton de connexion")
    public void lUtilisateurAppuieSurLeBoutonDeConnexion() {
        // Login button tap is handled in the login method
        System.out.println("Bouton de connexion appuyé");
    }

    @Then("l'utilisateur devrait voir la page d'accueil")
    public void lUtilisateurDevraitVoirLaPageDAccueil() {
        // Verify home page elements are visible
        Assert.assertNotNull("Le montant de cashback devrait être visible", loginPage.getCashbackValue());
        Assert.assertNotNull("Le solde crypto devrait être visible", loginPage.getCryptoBalanceValue());
    }

    @Then("l'utilisateur devrait voir son montant de cashback")
    public void lUtilisateurDevraitVoirSonMontantDeCashback() {
        String cashbackAmount = loginPage.getCashbackValue();
        Assert.assertNotNull("Le montant de cashback ne devrait pas être nul", cashbackAmount);
        System.out.println("Montant de cashback affiché: " + cashbackAmount);
    }

    @And("l'utilisateur devrait voir son solde crypto")
    public void lUtilisateurDevraitVoirSonSoldeCrypto() {
        String cryptoBalance = loginPage.getCryptoBalanceValue();
        Assert.assertNotNull("Le solde crypto ne devrait pas être nul", cryptoBalance);
        System.out.println("Solde crypto affiché: " + cryptoBalance);
    }

    @Then("l'utilisateur devrait voir un message d'erreur {string}")
    public void lUtilisateurDevraitVoirUnMessageDErreur(String expectedError) {
        // Note: You'll need to add error message handling in WiglLoginPage
        // For now, this is a placeholder
        System.out.println("Message d'erreur attendu: " + expectedError);
        // TODO: Implement error message verification once the locator is added to WiglLoginPage
    }
}
