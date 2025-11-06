import { Given, When, Then } from '@cucumber/cucumber';
import { LydiaLoginPage } from '../pages/LydiaLoginPage';
import { Driver } from '../utils/Driver';
import { expect } from 'chai';

let loginPage: LydiaLoginPage;

Given('l\'application Lydia est lancée', async function() {
    loginPage = new LydiaLoginPage();
    await loginPage.init();

    const driver = await Driver.getDriver();
    expect(driver).to.not.be.null;
    console.log('✅ Application Lydia lancée avec succès');
});

When('l\'utilisateur clique sur {string}', async function(bouton: string) {
    switch (bouton) {
        case "Besoin d'aide":
            await loginPage.clickBesoinAide();
            break;
        case "Un problème pour vous connecter":
            await loginPage.clickProblemeConnexion();
            break;
        default:
            throw new Error(`Bouton non reconnu : ${bouton}`);
    }
    console.log(`✅ Clic sur le bouton : ${bouton}`);
});

When('l\'utilisateur saisit le numéro {string}', async function(numero: string) {
    await loginPage.saisirNumeroTelephone(numero);
    console.log(`✅ Numéro de téléphone saisi : ${numero}`);
});

When('l\'utilisateur saisit l\'email {string}', async function(email: string) {
    await loginPage.saisirEmail(email);
    console.log(`✅ Email saisi : ${email}`);
});

Then('l\'utilisateur envoie la demande d\'aide', async function() {
    await loginPage.clickEnvoyer();
    console.log('✅ Demande d\'aide envoyée avec succès');
});

