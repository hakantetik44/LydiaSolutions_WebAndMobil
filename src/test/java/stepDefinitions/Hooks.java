package stepDefinitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.en.Given;
import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import utils.ConfigReader;
import utils.Driver;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Hooks {
    private Scenario scenario;
    private String platform;

    @Before
    public void setUp(Scenario scenario) throws IOException {
        this.scenario = scenario;
        this.platform = System.getProperty("platformName", ConfigReader.getProperty("platformName", "android")).toLowerCase();
        
        // Ajouter le nom de la plateforme au titre du scénario
        String platformName = platform.substring(0, 1).toUpperCase() + platform.substring(1);
        String originalName = scenario.getName();
        String newName = originalName + " - " + platformName;
        
        // Ajouter des informations sur la plateforme
        scenario.log("Plateforme de test: " + platform.toUpperCase());
        Allure.label("platform", platform);
        Allure.description("Plateforme de test: " + platform.toUpperCase() + "\n" + newName);
        
        System.out.println("\n🎬 === Nouveau Scénario Commence: " + newName + " ===");
        System.out.println("📱 Plateforme: " + platform);

        // Forcer la fermeture de toute instance précédente
        forceCloseApp();
        
        // S'assurer que le driver est fermé avant de démarrer un nouveau scénario
        Driver.closeDriver();
        
        // Attendre un peu pour s'assurer que tout est bien fermé
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Démarrer l'application pour ce scénario
        startApplication();

        // Informations d'environnement pour Allure
        Allure.addAttachment("Environnement", "Navigateur: Chrome\n" +
                "Environnement: Production\n" +
                "URL: https://wigl.fr\n" +
                "Plateforme: Mac OS\n" +
                "Langue: Français\n" +
                "Framework de test: Cucumber\n" +
                "Horodatage: " + java.time.Instant.now());
    }

    private void forceCloseApp() {
        if (platform.equals("android")) {
            try {
                String appPackage = ConfigReader.getProperty("android.app.package");
                System.out.println("Tentative de fermeture forcée de l'application Android: " + appPackage);
                
                // Exécuter la commande adb pour forcer l'arrêt de l'application
                Process process = Runtime.getRuntime().exec(new String[]{"adb", "shell", "am", "force-stop", appPackage});
                int exitCode = process.waitFor();
                
                if (exitCode == 0) {
                    System.out.println("Application Android fermée avec succès via ADB");
                } else {
                    System.err.println("Échec de la fermeture de l'application Android via ADB, code de sortie: " + exitCode);
                    
                    // Lire la sortie d'erreur pour le débogage
                    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.err.println("ADB Error: " + line);
                    }
                }
                
                // Attendre un peu après la fermeture forcée
                Thread.sleep(1000);
                
            } catch (Exception e) {
                System.err.println("Erreur lors de la tentative de fermeture forcée de l'application Android: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (platform.equals("ios")) {
            // Pour iOS, on pourrait utiliser xcrun simctl ou idevicedebug si nécessaire
            System.out.println("Fermeture forcée de l'application iOS non implémentée");
        }
    }

    private void startApplication() {
        try {
            System.out.println("🚀 Démarrage de l'application pour le scénario - Plateforme: " + platform);

            WebDriver driver = Driver.getDriver();
            if (driver == null) {
                throw new RuntimeException("❌ Impossible de démarrer le driver - Plateforme: " + platform);
            }
            
            scenario.log("✅ Application démarrée avec succès: " + platform.toUpperCase());
            Allure.step("✅ Application démarrée: " + platform.toUpperCase());

            System.out.println("✅ Driver créé avec succès: " + platform);

            // Attendre que l'application soit prête
            Thread.sleep(3000);
            
        } catch (Exception e) {
            String errorMsg = String.format("❌ Erreur lors du démarrage (%s): %s", platform, e.getMessage());
            System.err.println(errorMsg);
            e.printStackTrace();
            scenario.log(errorMsg);
            throw new RuntimeException(errorMsg, e);
        }
    }

    @Given("l'application Wigl est ouverte")
    public void verifierApplicationOuverte() {
        WebDriver driver = Driver.getDriver();
        if (driver == null) {
            throw new RuntimeException("L'application n'est pas démarrée!");
        }
        System.out.println("L'application est ouverte et prête pour le test.");
    }

    @After
    public void tearDown(Scenario scenario) {
        try {
            if (scenario.isFailed()) {
                try {
                    WebDriver driver = Driver.getDriver();
                    if (driver instanceof TakesScreenshot) {
                        byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                        String screenshotName = String.format("capture-erreur-%s-%s", platform, scenario.getName());
                        scenario.attach(screenshot, "image/png", screenshotName);
                        Allure.addAttachment(screenshotName, "image/png", new String(screenshot));
                    }
                } catch (Exception e) {
                    System.err.println("Erreur lors de la capture d'écran: " + e.getMessage());
                }
            }
            
            String resultatTest = scenario.isFailed() ? "❌ ÉCHEC" : "✅ RÉUSSITE";
            System.out.println(String.format("\n🏁 === Scénario Terminé: %s ===", scenario.getName()));
            System.out.println(String.format("📊 Résultat: %s", resultatTest));

            scenario.log(String.format("Test terminé - Plateforme: %s, Résultat: %s", platform.toUpperCase(), resultatTest));
            Allure.step(String.format("Test terminé - Plateforme: %s, Résultat: %s", platform.toUpperCase(), resultatTest));
        } finally {
            // Forcer la fermeture de l'application
            System.out.println("Fermeture forcée de l'application...");
            
            // Fermer l'application via ADB pour Android
            forceCloseApp();
            
            try {
                WebDriver driver = Driver.getDriver();
                if (driver != null) {
                    driver.quit();
                }
            } catch (Exception e) {
                System.err.println("Erreur lors de la fermeture du driver: " + e.getMessage());
            }
            
            // S'assurer que le driver est complètement fermé et réinitialisé
            Driver.closeDriver();
            
            // Attendre un peu pour s'assurer que l'application est bien fermée
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            System.out.println("Application fermée avec succès.\n");
        }
    }
}