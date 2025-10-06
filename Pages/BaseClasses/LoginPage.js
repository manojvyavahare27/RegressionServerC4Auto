const { default: Environment } = require("./Environment")
//import Environment from '../Pages/Environment';

class LoginPage{
constructor(page)
{
    this.page=page
    this.userName=page.locator("xpath=//input[@id='userNameLogin']")
    this.passWord=page.locator("xpath=//input[@id='Password']")
    this.emailaddress=page.locator("xpath=//input[@id='Email Address']")
   // this.loginButton=page.locator("xpath=//button[@data-testid='Login']")
   this.loginButton=page.getByTestId('Login')
    this.message=page.getByText('Your username/password combination has not been recognised. Please try again.')
    
    //Forgot Password Page
    //this.forgotpasswordlink=page.locator("//body/div[@id='root']/div[2]/div[1]/div[1]/div[1]/form[1]/div[1]/div[2]/div[1]/div[5]/a[1]")
    //this.forgotpasswordlink=page.getByText('Forgot Password')
    this.forgotpasswordlink=page.locator("xpath=//a[@data-testid='Forgot Password']")

    this.closeforgotpasswordpopup=page.getByTestId('CancelIcon')
    this.txtEmailAddress=page.locator("xpath=//input[@id='Email Address']")

    //Login to Rferral Portal  

    this.txtUserName=page.locator("xpath=//input[@id='Username']")
    this.txtPassword=page.locator("xpath=//input[@id='Password']")
    this.btnLoginReferralPortal=page.locator("xpath=//div[contains(text(),'Login')]")
    

}

async openReferralPortal()
{
    await this.page.goto("http://10.0.0.106:3001/cellmaPortal/portal/login")
}

async enterReferralPortalUserName(username)
{
    await this.txtUserName.fill(username)
}
async enterRefrralPortalPassword(password)
{
    await this.txtPassword.fill(password)
}
async clickOnReferralPortalLoginButton()
{
    await this.btnLoginReferralPortal.click()
}

async openUrl()
{
    await this.page.goto("http://10.0.0.64:3000/cellmaUser/login")   
    //await page.goto(Environment.Test)
}
//enterUsername=async()=> await this.userName.type(username)
//enter_Password=async()=> await this.passWord.type(password)


     async enterUsername(username) {
        await this.userName.fill(username);
        const actual = await this.userName.inputValue();
        if (actual !== username) {
            throw new Error(`❌ Username mismatch. Expected: "${username}", Found: "${actual}"`);
        }
        console.log(`✅ Username filled correctly: "${actual}"`);
    }

    // Reads username from the field
    async readUsername() {
        const value = await this.userName.inputValue();
        console.log(`✅ Username read from input: "${value}"`);
        return value;
    }

    // Enters password and validates input
    async enter_Password(password) {
        await this.passWord.fill(password);
        const actual = await this.passWord.inputValue();
        if (actual !== password) {
            throw new Error(`❌ Password mismatch. Expected: "${password}", Found: "${actual}"`);
        }
        console.log(`✅ Password filled correctly: "${actual}"`);
    }
    
    async clickOnLogin()
    {
        await this.loginButton.click()
        // if(this.loginButton!=null)
        // //if(this.loginButton!=Invisiable)
        // {
        //     return this.loginButton.click()
        // }
        // else throw new Error("No Loginbutton Element Present")
    }

    async enter_emailAddress(emailid)
    {
        await this.txtEmailAddress.type(emailid)
        if(this.txtEmailAddress!=null)
        {
            return this.txtEmailAddress
        }
        else throw new Error("No txtEmailAddress Element Present")
    }

    async enter_InvalidemailAddress(Invalidemailid)
    {
        await this.txtEmailAddress.fill(Invalidemailid)
        // if(this.txtEmailAddress!=null)
        // {
        //     return this.txtEmailAddress
        // }
        // else throw new Error("No txtEmailAddress Element Present")
    }
}
module.exports=LoginPage