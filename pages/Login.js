class Login{

    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.loginButton = page.locator('.login-button');
        this.logoutLink = page.getByRole('link', { name: 'Log out' });
    }

    async login(email, password){

        await this.page.goto('https://demo.nopcommerce.com/login'); //direct to login page, avoiding bot checks by cloudflare

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    } 
}
module.exports = { Login };