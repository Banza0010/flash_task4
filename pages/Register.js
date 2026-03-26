const {expect} = require('@playwright/test')

class Register{

    constructor(page){
        this.page = page;
        this.registerLink = page.getByRole('link', { name: 'Register' }); //no id, using actual text on tag
        this.genderMale = page.locator('#gender-male');
        this.genderFemale = page.locator('#gender-female');
        this.firstNameInput = page.locator('#FirstName');
        this.lastNameInput = page.locator('#LastName');
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.confirmPasswordInput = page.locator('#ConfirmPassword');
        this.registerButton = page.locator('#register-button');
        this.successMessage = page.locator('.result');
    }

    async goToSite(){
        await this.page.goto('https://demo.nopcommerce.com/');
        await this.page.waitForTimeout(2000); //delay to avoid cloudflare bot checks
        await this.registerLink.click();
    }

    async registerUser(name, lastname, email, password){
        await this.genderMale.waitFor({ state: 'visible' });
        await this.genderMale.click();
        await this.firstNameInput.fill(name);
        await this.lastNameInput.fill(lastname);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await this.page.waitForTimeout(2000);
        await this.registerButton.click();
    }
}

module.exports = {Register};