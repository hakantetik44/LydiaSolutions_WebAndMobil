package pages;

import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import utils.OS;
import utils.Driver;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.remote.RemoteWebElement;
import java.util.Collections;
import com.google.common.collect.ImmutableMap;
import org.openqa.selenium.Point;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class WiglLoginPage extends BasePage {

    public WiglLoginPage() {
        super(Driver.getDriver());
    }

    public By getEmailInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@resource-id='text-input-flat']") :
                AppiumBy.xpath("//XCUIElementTypeTextField[@name='email-input']");
    }

    private By getPasswordInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@password='true' and @resource-id='text-input-flat']") :
                AppiumBy.xpath("//XCUIElementTypeSecureTextField[@name='password-input']");
    }

    private By getLoginButton() {
        if (OS.isAndroid()) {
            // Utiliser le locator exact fourni
            return AppiumBy.xpath("//android.widget.TextView[@text='Log in' and @class='android.widget.TextView' and @package='com.bps.wigl']");
        } else {
            return AppiumBy.xpath("//XCUIElementTypeButton[contains(@name, 'Login') or contains(@name, 'Connexion') or contains(@name, 'login')]");
        }
    }

    private By getCashbackAmount() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[@resource-id='cashback-amount']") :
                AppiumBy.xpath("//XCUIElementTypeStaticText[@name='cashback-amount']");
    }

    private By getCryptoBalance() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[@resource-id='crypto-balance']") :
                AppiumBy.xpath("//XCUIElementTypeStaticText[@name='crypto-balance']");
    }

    public By getCreateAccountText() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[contains(@text, 'Create your account')]") :
                AppiumBy.xpath("//XCUIElementTypeStaticText[contains(@name, 'Create your account')]");
    }

    public By getLanguageOptionsContainer() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.view.ViewGroup[contains(@resource-id, 'language-container')]") :
                AppiumBy.xpath("//XCUIElementTypeOther[contains(@name, 'language-container')]");
    }

    public By getLanguageOption(String language) {
        String text = language.equals("Français") ? "FR" : "EN";
        return OS.isAndroid() ?
                AppiumBy.xpath(String.format("//android.widget.TextView[@text='%s']", text)) :
                AppiumBy.xpath(String.format("//XCUIElementTypeStaticText[@name='%s']", text));
    }

    public By getFrenchLanguageIndicator() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[@text='FR']") :
                AppiumBy.xpath("//XCUIElementTypeStaticText[@name='FR']");
    }

    private WebElement getLanguageToggleButton() {
        if (OS.isAndroid()) {
            // Utilisation d'un localisateur plus flexible pour le bouton de sélection de langue
            return driver.findElement(By.xpath("//android.widget.TextView[contains(@text, '󰅀')]"));
        } else {
            // Pour iOS, nous gardons la logique existante
            return driver.findElement(By.xpath("//XCUIElementTypeButton[@name='language-toggle-button']"));
        }
    }

    public void login(String email, String password) {
        System.out.println("Saisie de l'email: " + email);
        try {
            // Trouver et cliquer sur le bouton de connexion en premier
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(getLoginButton()));
            
            if (OS.isAndroid()) {
                try {
                    // Essayer de cliquer directement
                    loginButton.click();
                } catch (Exception e) {
                    try {
                        // Si le clic direct échoue, essayer via les coordonnées
                        Point location = loginButton.getLocation();
                        new org.openqa.selenium.interactions.Actions(driver)
                            .moveToElement(loginButton)
                            .click()
                            .perform();
                    } catch (Exception e2) {
                        // Si le clic par coordonnées échoue, essayer un clic JavaScript
                        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", loginButton);
                    }
                }
            } else {
                loginButton.click();
            }
            System.out.println("Bouton de connexion cliqué avec succès");
            
            // Attendre un peu après le clic
            Thread.sleep(1000);
            
            // Continuer avec la saisie de l'email
            WebElement emailField = driver.findElement(getEmailInput());
            emailField.click();
            emailField.clear();
            emailField.sendKeys(email);
            hideKeyboard();
            System.out.println("Email saisi avec succès");
        } catch (Exception e) {
            System.out.println("Erreur lors de la saisie de l'email: " + e.getMessage());
            throw new RuntimeException("Échec de la saisie de l'email", e);
        }

        System.out.println("Saisie du mot de passe: " + password);
        try {
            WebElement passwordField = driver.findElement(getPasswordInput());
            passwordField.click();
            passwordField.clear();
            passwordField.sendKeys(password);
            hideKeyboard();
            System.out.println("Mot de passe saisi avec succès");
        } catch (Exception e) {
            System.out.println("Erreur lors de la saisie du mot de passe: " + e.getMessage());
            throw new RuntimeException("Échec de la saisie du mot de passe", e);
        }

        System.out.println("Clic sur le bouton de connexion");
        try {
            // Attendre que le bouton soit présent avec un timeout plus court
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(getLoginButton()));
            
            // Si le bouton n'est pas cliquable directement, essayer de cliquer via les coordonnées
            if (OS.isAndroid()) {
                try {
                    Point location = loginButton.getLocation();
                    new org.openqa.selenium.interactions.Actions(driver)
                        .moveToElement(loginButton)
                        .click()
                        .perform();
                } catch (Exception e) {
                    // Si le clic par coordonnées échoue, essayer un clic JavaScript
                    ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", loginButton);
                }
            } else {
                loginButton.click();
            }
            
            System.out.println("Bouton de connexion cliqué avec succès");
        } catch (Exception e) {
            System.out.println("Erreur lors du clic sur le bouton de connexion: " + e.getMessage());
            throw new RuntimeException("Impossible de cliquer sur le bouton de connexion", e);
        }
    }

    // Méthode pour faire défiler jusqu'à un point spécifique
    private void scrollToPoint(int x, int y) {
        try {
            int screenHeight = driver.manage().window().getSize().getHeight();
            int screenWidth = driver.manage().window().getSize().getWidth();
            
            // Si le point est en dehors de l'écran visible, faire défiler
            if (y > screenHeight * 0.8) {
                System.out.println("Défilement vers le bouton de connexion");
                
                // Utiliser les actions W3C pour faire défiler
                org.openqa.selenium.interactions.PointerInput finger = 
                    new org.openqa.selenium.interactions.PointerInput(
                        org.openqa.selenium.interactions.PointerInput.Kind.TOUCH, "finger");
                
                org.openqa.selenium.interactions.Sequence swipe = 
                    new org.openqa.selenium.interactions.Sequence(finger, 0);
                
                // Calculer les points de départ et d'arrivée pour le défilement
                int startX = screenWidth / 2;
                int startY = (int) (screenHeight * 0.7);
                int endY = (int) (screenHeight * 0.3);
                
                swipe.addAction(finger.createPointerMove(
                    Duration.ZERO, 
                    org.openqa.selenium.interactions.PointerInput.Origin.viewport(), 
                    startX, startY));
                swipe.addAction(finger.createPointerDown(org.openqa.selenium.interactions.PointerInput.MouseButton.LEFT.asArg()));
                swipe.addAction(finger.createPointerMove(
                    Duration.ofMillis(600), 
                    org.openqa.selenium.interactions.PointerInput.Origin.viewport(), 
                    startX, endY));
                swipe.addAction(finger.createPointerUp(org.openqa.selenium.interactions.PointerInput.MouseButton.LEFT.asArg()));
                
                ((org.openqa.selenium.remote.RemoteWebDriver) driver).perform(java.util.Collections.singletonList(swipe));
                
                // Attendre que l'animation de défilement soit terminée
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        } catch (Exception e) {
            System.out.println("Erreur lors du défilement vers le bouton: " + e.getMessage());
        }
    }

    public String getCashbackValue() {
        return driver.findElement(getCashbackAmount()).getText();
    }

    public String getCryptoBalanceValue() {
        return driver.findElement(getCryptoBalance()).getText();
    }

    private void hideKeyboard() {
        if (OS.isAndroid()) {
            try {
                Thread.sleep(1000);
                try {
                    ((io.appium.java_client.android.AndroidDriver) driver).hideKeyboard();
                } catch (Exception e1) {
                    try {
                        driver.navigate().back();
                    } catch (Exception e2) {
                        System.out.println("Impossible de masquer le clavier via le bouton retour: " + e2.getMessage());
                    }
                }
                Thread.sleep(500);
            } catch (Exception e) {
                System.out.println("Impossible de masquer le clavier: " + e.getMessage());
            }
        } else {
            try {
                Thread.sleep(1000);
                try {
                    By doneButton = AppiumBy.xpath("//XCUIElementTypeButton[@name='Done']");
                    driver.findElement(doneButton).click();
                } catch (Exception e1) {
                    try {
                        By emptyArea = AppiumBy.xpath("//XCUIElementTypeApplication");
                        driver.findElement(emptyArea).click();
                    } catch (Exception e2) {
                        System.out.println("Impossible de masquer le clavier iOS: " + e2.getMessage());
                    }
                }
                Thread.sleep(500);
            } catch (Exception e) {
                System.out.println("Erreur lors du masquage du clavier iOS: " + e.getMessage());
            }
        }
    }

    public boolean isHomePageDisplayed() {
        try {
            return driver.findElement(getCreateAccountText()).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean areLanguageOptionsDisplayed() {
        try {
            WebElement languageToggle = getLanguageToggleButton();
            System.out.println("Bouton de sélection de langue trouvé");
            return languageToggle.isDisplayed();
        } catch (Exception e) {
            System.out.println("Erreur lors de la vérification de la visibilité des options de langue: " + e.getMessage());
            return false;
        }
    }

    public void selectLanguage() {
        System.out.println("Tentative de sélection de la langue");
        try {
            WebElement languageToggle = getLanguageToggleButton();
            System.out.println("Bouton de sélection de langue trouvé, clic en cours...");
            languageToggle.click();
            
            // Bouton de fermeture
            By closeButton = OS.isAndroid() ?
                AppiumBy.xpath("(//android.widget.TextView)[12]") :
                AppiumBy.xpath("//XCUIElementTypeButton[@name='Close']");
            
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
            WebElement closeButtonElement = wait.until(ExpectedConditions.elementToBeClickable(closeButton));
            System.out.println("Bouton de fermeture trouvé, clic en cours...");
            closeButtonElement.click();
        } catch (Exception e) {
            System.out.println("Erreur lors de la sélection de la langue: " + e.getMessage());
            throw new RuntimeException("Échec de la sélection de la langue", e);
        }
    }

    public boolean isLanguageFrench() {
        try {
            return driver.findElement(getFrenchLanguageIndicator()).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void dragCreateAccountTextUp() {
        int maxAttempts = 3;
        int attempt = 0;
        boolean success = false;

        while (attempt < maxAttempts && !success) {
            try {
                // Utiliser la nouvelle méthode de défilement
                scrollWiglTextUp();
                success = true;
                System.out.println("Défilement du texte Wigl vers le haut réussi");
            } catch (Exception e) {
                System.out.println("Tentative " + (attempt + 1) + " échouée: " + e.getMessage());
            }
            attempt++;
        }

        if (!success) {
            throw new RuntimeException("Échec du défilement du texte Wigl vers le haut après " + maxAttempts + " tentatives");
        }
    }

    public void scrollViewGroupUp() {
        try {
            By viewGroupLocator = AppiumBy.xpath("//android.view.ViewGroup[@bounds='[0,63][1080,1316]']");
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(viewGroupLocator));
            
            // Défilement vers le haut de 30% de la hauteur de l'écran
            scrollUp(element, 30);
            
            // Attendre que l'animation soit terminée
            Thread.sleep(1500);
            
        } catch (Exception e) {
            System.out.println("Erreur lors du défilement du ViewGroup: " + e.getMessage());
            throw new RuntimeException("Échec du défilement du ViewGroup vers le haut", e);
        }
    }

    public void scrollWelcomeTextUp() {
        try {
            By welcomeTextLocator = AppiumBy.xpath("//android.widget.TextView[@text='Welcome|']");
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(welcomeTextLocator));
            
            // Obtenir la position initiale pour vérification
            Point initialPosition = element.getLocation();
            
            // Défilement vers le haut de 40% de la hauteur de l'écran
            scrollUp(element, 40);
            
            // Attendre que l'animation soit terminée
            Thread.sleep(1500);
            
            // Vérifier que le défilement a fonctionné
            Point newPosition = element.getLocation();
            if (newPosition.getY() >= initialPosition.getY()) {
                throw new RuntimeException("Le défilement n'a pas déplacé l'élément vers le haut");
            }
            
            System.out.println("Défilement du texte de bienvenue réussi");
            
        } catch (Exception e) {
            System.out.println("Erreur lors du défilement du texte de bienvenue: " + e.getMessage());
            throw new RuntimeException("Échec du défilement du texte de bienvenue vers le haut", e);
        }
    }
} 