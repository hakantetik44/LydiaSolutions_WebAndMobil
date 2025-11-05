package pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import utils.OS;
import org.openqa.selenium.Point;
import org.openqa.selenium.Dimension;
import java.util.Map;
import java.util.HashMap;

public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    // Méthodes communes pour attendre
    protected WebElement waitForElement(By locator) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    protected WebElement waitForClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    // Méthodes communes pour les actions
    protected void click(By locator) {
        waitForClickable(locator).click();
    }

    protected void click(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element)).click();
    }

    protected void sendKeys(By locator, String text) {
        WebElement element = waitForVisible(locator);
        element.clear();
        element.sendKeys(text);
    }

    // Méthode pour faire défiler
    protected void scroll(String direction) {
        Dimension size = driver.manage().window().getSize();
        int startX = size.getWidth() / 2;
        int startY = (int) (size.getHeight() * 0.8);
        int endY = (int) (size.getHeight() * 0.2);

        if (direction.equals("down")) {
            int temp = startY;
            startY = endY;
            endY = temp;
        }

        if (OS.isAndroid()) {
            Map<String, Object> args = new HashMap<>();
            args.put("startX", startX);
            args.put("startY", startY);
            args.put("endX", startX);
            args.put("endY", endY);
            args.put("duration", 1.0);
            ((RemoteWebDriver) driver).executeScript("mobile: swipe", args);
        } else {
            Map<String, Object> params = new HashMap<>();
            params.put("direction", direction);
            ((RemoteWebDriver) driver).executeScript("mobile: scroll", params);
        }
    }

    // Méthode pour vérifier si un élément est présent
    protected boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Méthode pour vérifier si un élément est visible
    protected boolean isElementVisible(By locator) {
        try {
            return waitForVisible(locator).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // Méthode pour masquer le clavier
    protected void hideKeyboard() {
        try {
            if (OS.isAndroid()) {
                try {
                    ((AndroidDriver) driver).hideKeyboard();
                } catch (Exception e1) {
                    driver.navigate().back();
                }
            } else {
                try {
                    ((IOSDriver) driver).hideKeyboard();
                } catch (Exception e2) {
                    try {
                        By doneButton = AppiumBy.accessibilityId("Done");
                        if (isElementPresent(doneButton)) {
                            click(doneButton);
                        } else {
                            By tapPoint = AppiumBy.xpath("//XCUIElementTypeApplication");
                            if (isElementPresent(tapPoint)) {
                                click(tapPoint);
                            }
                        }
                    } catch (Exception e3) {
                        System.out.println("Impossible de masquer le clavier iOS : " + e3.getMessage());
                    }
                }
            }
            Thread.sleep(500); // Attendre que le clavier disparaisse
        } catch (Exception e) {
            System.out.println("Erreur lors de la tentative de masquage du clavier : " + e.getMessage());
        }
    }

    // Méthode pour taper à des coordonnées spécifiques
    protected void tapByCoordinates(Point point) {
        Map<String, Object> args = new HashMap<>();
        args.put("x", point.getX());
        args.put("y", point.getY());
        ((RemoteWebDriver) driver).executeScript("mobile: tap", args);
    }

    // Méthode pour attendre qu'un texte soit présent
    protected boolean waitForText(String text, int timeoutInSeconds) {
        try {
            By textLocator = OS.isAndroid() ?
                    AppiumBy.xpath("//*[@text='" + text + "']") :
                    AppiumBy.xpath("//*[@label='" + text + "']");
            return wait.until(ExpectedConditions.presenceOfElementLocated(textLocator)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // Méthode pour effectuer une saisie rapide sans attente
    protected void quickSendKeys(By locator, String text) {
        try {
            WebElement element = driver.findElement(locator);
            element.click();
            element.clear();
            element.sendKeys(text);
        } catch (Exception e) {
            System.out.println("Erreur lors de la saisie rapide : " + e.getMessage());
        }
    }

    // Méthode pour cliquer rapidement sans attente
    protected void quickClick(By locator) {
        try {
            driver.findElement(locator).click();
        } catch (Exception e) {
            System.out.println("Erreur lors du clic rapide : " + e.getMessage());
        }
    }

    // Méthode pour vérifier si un élément contient un texte
    protected boolean elementContainsText(By locator, String text) {
        try {
            return driver.findElement(locator).getText().contains(text);
        } catch (Exception e) {
            return false;
        }
    }

    // Méthode pour obtenir le texte d'un élément
    protected String getElementText(By locator) {
        try {
            return waitForVisible(locator).getText();
        } catch (Exception e) {
            System.out.println("Erreur lors de la récupération du texte : " + e.getMessage());
            return "";
        }
    }

    // Méthode pour attendre et cliquer avec log
    protected void clickWithLog(By locator, String elementName) {
        try {
            System.out.println("Tentative de clic sur " + elementName);
            click(locator);
            System.out.println("Clic réussi sur " + elementName);
        } catch (Exception e) {
            System.out.println("Erreur lors du clic sur " + elementName + " : " + e.getMessage());
            throw e;
        }
    }

    // Méthode pour saisir du texte avec log
    protected void sendKeysWithLog(By locator, String text, String fieldName) {
        try {
            System.out.println("Saisie de '" + text + "' dans " + fieldName);
            sendKeys(locator, text);
            hideKeyboard();
            System.out.println("Saisie réussie dans " + fieldName);
        } catch (Exception e) {
            System.out.println("Erreur lors de la saisie dans " + fieldName + " : " + e.getMessage());
            throw e;
        }
    }
}
