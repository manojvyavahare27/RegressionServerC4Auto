class BackToStock {
    constructor(page) {
        this.page = page;

        // Sidebar
        this.batchQty = page.locator("xpath=//input[contains(@data-testid, 'Batch')]");
        this.reasonforReturn=page.locator("xpath=//textarea[@data-testid='Reason for Return']")
        this.SaveButton=page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-spacing-xs-2 mui-8uz16t']//div[contains(text(),'Save')]")
        
    }

    async enterBatchQty() {
        await this.batchQty.fill('5');
    }

    async enterReasonforReturn()
    {
        await this.reasonforReturn.fill('Added for testing')
    }
    async clickOnSavebutton()
    {
        await this.SaveButton.click()
    }
   
}

module.exports = BackToStock;
