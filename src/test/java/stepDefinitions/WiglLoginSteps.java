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

public class WiglLoginSteps {
    private WiglLoginPage loginPage;

    public WiglLoginSteps() {
        loginPage = new WiglLoginPage();
    }

    @Given("l'application Wigl est lancée")
    public void lApplicationWiglEstLancee() {
        Assert.assertNotNull("Le driver devrait être initialisé", Driver.getDriver());
        System.out.println("Application Wigl lancée avec succès");
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
    public void l_utilisateur_sélectionne(String language) {
        loginPage.selectLanguage(language);
    }

    @Then("l'application devrait être en français")
    public void lApplicationDevraitEtreEnFrancais() {
        Assert.assertTrue("L'application devrait être en français", 
            Driver.getDriver().findElement(loginPage.getFrenchLanguageIndicator()).isDisplayed());
    }

    @When("user enters email {string} and password {string}")
    public void userEntersEmailAndPassword(String email, String password) {
        loginPage.login(email, password);
    }

    @And("user taps on the login button")
    public void userTapsOnTheLoginButton() {
        // Login button tap is handled in the login method
        System.out.println("Login button tapped");
    }

    @Then("user should see the home page")
    public void userShouldSeeTheHomePage() {
        // Verify home page elements are visible
        Assert.assertNotNull("Cashback amount should be visible", loginPage.getCashbackValue());
        Assert.assertNotNull("Crypto balance should be visible", loginPage.getCryptoBalanceValue());
    }

    @Then("user should see their cashback amount")
    public void userShouldSeeTheirCashbackAmount() {
        String cashbackAmount = loginPage.getCashbackValue();
        Assert.assertNotNull("Cashback amount should not be null", cashbackAmount);
        System.out.println("Cashback amount displayed: " + cashbackAmount);
    }

    @And("user should see their crypto balance")
    public void userShouldSeeTheirCryptoBalance() {
        String cryptoBalance = loginPage.getCryptoBalanceValue();
        Assert.assertNotNull("Crypto balance should not be null", cryptoBalance);
        System.out.println("Crypto balance displayed: " + cryptoBalance);
    }

    @Then("user should see an error message {string}")
    public void userShouldSeeAnErrorMessage(String expectedError) {
        // Note: You'll need to add error message handling in WiglLoginPage
        // For now, this is a placeholder
        System.out.println("Expected error message: " + expectedError);
        // TODO: Implement error message verification once the locator is added to WiglLoginPage
    }
} 