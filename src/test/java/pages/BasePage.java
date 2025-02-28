package pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.PerformsTouchActions;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import utils.OS;
import com.google.common.collect.ImmutableMap;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.Point;
import org.openqa.selenium.Dimension;
import java.util.HashMap;
import java.util.Map;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidTouchAction;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.interactions.Pause;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import java.util.Arrays;

public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected By getLanguageSelectorButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.view.ViewGroup[@content-desc='󰗊, English, 󰅀']") :
                AppiumBy.xpath("//XCUIElementTypeOther[@name='Language Selector']");
    }

    protected By getFrenchOption() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.TextView[@text='Français']") :
                AppiumBy.xpath("//XCUIElementTypeStaticText[@name='Français']");
    }

    protected By getCloseButton() {
        return OS.isAndroid() ?
                AppiumBy.xpath("//android.widget.Button[@text='Close']") :
                AppiumBy.xpath("//XCUIElementTypeButton[@name='Close']");
    }

    public void scrollAndSelectLanguage() {
        try {
            // Wait for and click the language selector
            WebElement languageSelector = wait.until(ExpectedConditions.elementToBeClickable(getLanguageSelectorButton()));
            languageSelector.click();

            // Wait for French option to be visible and click it
            WebElement frenchOption = wait.until(ExpectedConditions.elementToBeClickable(getFrenchOption()));
            frenchOption.click();

            // Optional: Wait for and click close button if needed
            try {
                WebElement closeButton = wait.until(ExpectedConditions.elementToBeClickable(getCloseButton()));
                closeButton.click();
            } catch (Exception e) {
                System.out.println("Close button not found or not needed: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Error during language selection: " + e.getMessage());
            throw e;
        }
    }

    public void performScroll(WebElement element, String direction) {
        try {
            if (OS.isAndroid()) {
                Dimension dimension = driver.manage().window().getSize();
                Point location = element.getLocation();
                Dimension elementSize = element.getSize();
                
                int startX = location.getX() + elementSize.getWidth() / 2;
                int startY = location.getY() + elementSize.getHeight() / 2;
                int endY;
                
                if (direction.equals("up")) {
                    endY = (int) (dimension.getHeight() * 0.3); // Scroll up to 30% of screen height
                } else {
                    endY = (int) (dimension.getHeight() * 0.7); // Scroll down to 70% of screen height
                }
                
                TouchAction touch = new TouchAction((PerformsTouchActions) driver);
                touch.press(PointOption.point(startX, startY))
                    .waitAction(WaitOptions.waitOptions(Duration.ofSeconds(1)))
                    .moveTo(PointOption.point(startX, endY))
                    .release()
                    .perform();
                
                Thread.sleep(1000); // Wait for animation
            } else {
                // For iOS, use the existing swipe gesture
                try {
                    ((AppiumDriver) driver).executeScript(
                        "mobile: swipe",
                        ImmutableMap.of(
                            "element", ((RemoteWebElement) element).getId(),
                            "direction", direction,
                            "velocity", 2000
                        )
                    );
                } catch (Exception e) {
                    // Fallback to coordinates-based swipe
                    Dimension dimension = driver.manage().window().getSize();
                    Point location = element.getLocation();
                    Dimension elementSize = element.getSize();
                    
                    int startX = location.getX() + elementSize.getWidth() / 2;
                    int startY = location.getY() + elementSize.getHeight() / 2;
                    int endY = direction.equals("up") ? 
                        (int) (dimension.getHeight() * 0.3) : 
                        (int) (dimension.getHeight() * 0.7);
                    
                    ((AppiumDriver) driver).executeScript(
                        "mobile: swipe",
                        ImmutableMap.of(
                            "fromX", startX,
                            "fromY", startY,
                            "toX", startX,
                            "toY", endY,
                            "velocity", 2000
                        )
                    );
                }
                Thread.sleep(1000); // Wait for animation
            }
        } catch (Exception e) {
            System.out.println("Error during scroll: " + e.getMessage());
            throw new RuntimeException("Failed to perform scroll: " + e.getMessage(), e);
        }
    }

    private int calculateOffsetForUpAndDownScroll(int scrollAmount) {
        Dimension dimension = driver.manage().window().getSize();
        return ((scrollAmount * dimension.getHeight()) / 100);
    }

    public void scrollUp(WebElement element, int scrollPercentage) {
        try {
            Point location = element.getLocation();
            Dimension size = element.getSize();
            Dimension screenSize = driver.manage().window().getSize();
            
            int startX = location.getX() + size.getWidth() / 2;
            int startY = location.getY() + size.getHeight() / 2;
            int endY = startY - calculateOffsetForUpAndDownScroll(scrollPercentage);
            
            if (OS.isAndroid()) {
                new AndroidTouchAction((AndroidDriver) driver)
                    .press(io.appium.java_client.touch.offset.PointOption.point(startX, startY))
                    .waitAction(io.appium.java_client.touch.WaitOptions.waitOptions(Duration.ofMillis(1000)))
                    .moveTo(io.appium.java_client.touch.offset.PointOption.point(startX, endY))
                    .release()
                    .perform();
            } else {
                Map<String, Object> params = new HashMap<>();
                params.put("duration", 1.0);
                params.put("fromX", startX);
                params.put("fromY", startY);
                params.put("toX", startX);
                params.put("toY", endY);
                ((AppiumDriver) driver).executeScript("mobile: dragFromToForDuration", params);
            }
            
            Thread.sleep(1500); // Wait for scroll animation
        } catch (Exception e) {
            System.out.println("Error during scroll up: " + e.getMessage());
            throw new RuntimeException("Failed to perform scroll up: " + e.getMessage());
        }
    }

    public void scrollWiglTextUp() {
        try {
            // Find the specific TextView element
            By wiglTextLocator = AppiumBy.xpath("//android.widget.TextView[@text=' on Wigl ✨']");
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(wiglTextLocator));
            
            // Get the element's bounds
            String[] bounds = element.getAttribute("bounds").replace("][", ",").replace("[", "").replace("]", "").split(",");
            int startX = (Integer.parseInt(bounds[0]) + Integer.parseInt(bounds[2])) / 2;
            int startY = (Integer.parseInt(bounds[1]) + Integer.parseInt(bounds[3])) / 2;
            
            // Calculate end point (scroll up by 70% of the element's height)
            int endY = startY - (startY * 70 / 100);
            
            if (OS.isAndroid()) {
                // Create touch input source
                PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
                Sequence swipe = new Sequence(finger, 0);
                
                // Add touch interactions
                swipe.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY));
                swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
                swipe.addAction(new Pause(finger, Duration.ofMillis(200)));
                swipe.addAction(finger.createPointerMove(Duration.ofMillis(1000), PointerInput.Origin.viewport(), startX, endY));
                swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
                
                // Perform the action
                ((AppiumDriver) driver).perform(Arrays.asList(swipe));
            } else {
                // For iOS
                Map<String, Object> params = new HashMap<>();
                params.put("duration", 1.0);
                params.put("fromX", startX);
                params.put("fromY", startY);
                params.put("toX", startX);
                params.put("toY", endY);
                ((AppiumDriver) driver).executeScript("mobile: dragFromToForDuration", params);
            }
            
            Thread.sleep(1500); // Wait for scroll animation
            
        } catch (Exception e) {
            System.out.println("Error during Wigl text scroll: " + e.getMessage());
            throw new RuntimeException("Failed to scroll Wigl text: " + e.getMessage());
        }
    }
} 