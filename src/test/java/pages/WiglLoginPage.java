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

    private By getEmailInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@resource-id='email-input']") :
                AppiumBy.xpath("//XCUIElementTypeTextField[@name='email-input']");
    }

    private By getPasswordInput() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.EditText[@resource-id='password-input']") :
                AppiumBy.xpath("//XCUIElementTypeSecureTextField[@name='password-input']");
    }

    private By getLoginButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.Button[@text='Login']") :
                AppiumBy.xpath("//XCUIElementTypeButton[@name='Login']");
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
            // Using a more flexible locator for the language toggle button
            return driver.findElement(By.xpath("//android.widget.TextView[contains(@text, '󰅀')]"));
        } else {
            // For iOS, we'll keep the existing logic
            return driver.findElement(By.xpath("//XCUIElementTypeButton[@name='language-toggle-button']"));
        }
    }

    public void login(String email, String password) {
        System.out.println("Entering email: " + email);
        WebElement emailField = driver.findElement(getEmailInput());
        emailField.click();
        emailField.clear();
        emailField.sendKeys(email);
        hideKeyboard();

        System.out.println("Entering password: " + password);
        WebElement passwordField = driver.findElement(getPasswordInput());
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys(password);
        hideKeyboard();

        System.out.println("Clicking login button");
        driver.findElement(getLoginButton()).click();
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
                        System.out.println("Could not hide keyboard via back button: " + e2.getMessage());
                    }
                }
                Thread.sleep(500);
            } catch (Exception e) {
                System.out.println("Could not hide keyboard: " + e.getMessage());
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
                        System.out.println("Could not hide iOS keyboard: " + e2.getMessage());
                    }
                }
                Thread.sleep(500);
            } catch (Exception e) {
                System.out.println("Error while hiding iOS keyboard: " + e.getMessage());
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
            System.out.println("Language toggle button found");
            return languageToggle.isDisplayed();
        } catch (Exception e) {
            System.out.println("Error checking language options visibility: " + e.getMessage());
            return false;
        }
    }

    public void selectLanguage(String language) {
        System.out.println("Attempting to select language: " + language);
        try {
            WebElement languageToggle = getLanguageToggleButton();
            System.out.println("Language toggle button found, clicking...");
            languageToggle.click();
            
            // Wait for animation
            Thread.sleep(1000);
            
            // Select French
            if (language.equalsIgnoreCase("Français")) {
                By frenchOption = OS.isAndroid() ?
                    AppiumBy.xpath("//android.widget.TextView[@text='FR']") :
                    AppiumBy.xpath("//XCUIElementTypeStaticText[@name='FR']");
                
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
                WebElement languageOption = wait.until(ExpectedConditions.elementToBeClickable(frenchOption));
                System.out.println("French option found, clicking...");
                languageOption.click();
                
                // Wait for selection to take effect
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            System.out.println("Error during language selection: " + e.getMessage());
            throw new RuntimeException("Failed to select language: " + language, e);
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
                // Use the new scroll method
                scrollWiglTextUp();
                success = true;
                System.out.println("Successfully scrolled Wigl text up");
            } catch (Exception e) {
                System.out.println("Attempt " + (attempt + 1) + " failed: " + e.getMessage());
            }
            attempt++;
        }

        if (!success) {
            throw new RuntimeException("Failed to scroll Wigl text up after " + maxAttempts + " attempts");
        }
    }

    public void scrollViewGroupUp() {
        try {
            By viewGroupLocator = AppiumBy.xpath("//android.view.ViewGroup[@bounds='[0,63][1080,1316]']");
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(viewGroupLocator));
            
            // Scroll up by 30% of screen height
            scrollUp(element, 30);
            
            // Wait for animation to complete
            Thread.sleep(1500);
            
        } catch (Exception e) {
            System.out.println("Error scrolling ViewGroup: " + e.getMessage());
            throw new RuntimeException("Failed to scroll ViewGroup up", e);
        }
    }

    public void scrollWelcomeTextUp() {
        try {
            By welcomeTextLocator = AppiumBy.xpath("//android.widget.TextView[@text='Welcome|']");
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(welcomeTextLocator));
            
            // Get initial position for verification
            Point initialPosition = element.getLocation();
            
            // Scroll up by 40% of screen height
            scrollUp(element, 40);
            
            // Wait for animation to complete
            Thread.sleep(1500);
            
            // Verify the scroll
            element = driver.findElement(welcomeTextLocator);
            Point newPosition = element.getLocation();
            
            if (newPosition.getY() < initialPosition.getY()) {
                System.out.println("Successfully scrolled Welcome text up from Y:" + initialPosition.getY() + " to Y:" + newPosition.getY());
            } else {
                throw new RuntimeException("Welcome text did not move up as expected");
            }
            
        } catch (Exception e) {
            System.out.println("Error scrolling Welcome text: " + e.getMessage());
            throw new RuntimeException("Failed to scroll Welcome text up", e);
        }
    }
} 