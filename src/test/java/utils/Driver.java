package utils;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.options.XCUITestOptions;
import org.openqa.selenium.WebDriver;
import java.net.URL;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Driver {
    private static final Logger logger = LoggerFactory.getLogger(Driver.class);
    private static final String APPIUM_URL = ConfigReader.getProperty("appium.server.url");
    private static final int IMPLICIT_WAIT = Integer.parseInt(ConfigReader.getProperty("web.implicit.wait"));
    
    private Driver() {
        // Private constructor to prevent instantiation
    }

    private static ThreadLocal<WebDriver> driverPool = new ThreadLocal<>();

    public static WebDriver getDriver() {
        if (driverPool.get() == null) {
            String platform = System.getProperty("platformName");
            
            if (platform == null) {
                throw new RuntimeException("Platform is not specified! Please run with -DplatformName=android or -DplatformName=ios");
            }
            
            platform = platform.toLowerCase();
            initializeDriver(platform);
        }
        return driverPool.get();
    }

    private static void initializeDriver(String platform) {
        try {
            switch (platform) {
                case "android":
                    initializeAndroidDriver();
                    break;
                case "ios":
                    initializeIOSDriver();
                    break;
                default:
                    throw new RuntimeException("Invalid platform! Platform: " + platform + ". Only 'android' and 'ios' are supported.");
            }
            
            configureDriver();
            logger.info("{} driver created successfully!", platform.toUpperCase());
            
        } catch (Exception e) {
            logger.error("Error creating driver for platform {}: {}", platform, e.getMessage());
            throw new RuntimeException("Failed to initialize driver", e);
        }
    }

    private static void initializeAndroidDriver() throws Exception {
        logger.info("Starting Android driver...");
        UiAutomator2Options androidOptions = new UiAutomator2Options()
            .setDeviceName(ConfigReader.getProperty("android.device.name"))
            .setPlatformName(ConfigReader.getProperty("android.platform.name"))
            .setPlatformVersion(ConfigReader.getProperty("android.platform.version"))
            .setAutomationName(ConfigReader.getProperty("android.automation.name"))
            .setUdid(ConfigReader.getProperty("android.udid"))
            .setAppPackage(ConfigReader.getProperty("android.app.package"))
            .setAppActivity(ConfigReader.getProperty("android.app.activity"))
            .setNoReset(Boolean.parseBoolean(ConfigReader.getProperty("android.no.reset")))
            .setAutoGrantPermissions(Boolean.parseBoolean(ConfigReader.getProperty("android.auto.grant.permissions")))
        
            .setAdbExecTimeout(Duration.ofMillis(Integer.parseInt(ConfigReader.getProperty("android.adb.execution.timeout"))));
        
        driverPool.set(new AppiumDriver(new URL(ConfigReader.getProperty("appium.server.url")), androidOptions));
    }

    private static void initializeIOSDriver() throws Exception {
        logger.info("Starting iOS driver...");
        XCUITestOptions iOSOptions = new XCUITestOptions();
        
        iOSOptions.setPlatformName(ConfigReader.getProperty("ios.platform.name"))
                 .setPlatformVersion(ConfigReader.getProperty("ios.platform.version"))
                 .setDeviceName(ConfigReader.getProperty("ios.device.name"))
                 .setUdid(ConfigReader.getProperty("ios.udid"))
                 .setAutomationName(ConfigReader.getProperty("ios.automation.name"))
                 .setBundleId(ConfigReader.getProperty("ios.bundle.id"))
                 .setNoReset(true);

        driverPool.set(new AppiumDriver(new URL(APPIUM_URL), iOSOptions));
    }

    private static void configureDriver() {
        if (driverPool.get() != null) {
            driverPool.get().manage().timeouts().implicitlyWait(Duration.ofSeconds(IMPLICIT_WAIT));
        }
    }

    public static void closeDriver() {
        try {
            if (driverPool.get() != null) {
                driverPool.get().quit();
                driverPool.remove();
                logger.info("Driver closed successfully");
            }
        } catch (Exception e) {
            logger.error("Error while closing driver: {}", e.getMessage());
        }
    }
}