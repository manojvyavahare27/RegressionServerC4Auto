const { expect } = require('@playwright/test');
class PatientSearch {
    
    constructor(page) {
        

        this.page = page
        this.btn_BackButton = page.getByRole('button', { name: 'Back Button' })
        // this.txtbox_GivenName = page.locator("xpath=//input[@id='Given Name']")
        this.txtbox_GivenName = page.getByRole('textbox', { name: 'Given Name' })
        this.txtbox_FamilyName = page.getByRole('textbox', { name: 'Family Name' })
        this.dropdown_PatientSex = page.locator("xpath=//input[@name='sex']")
        this.txtbox_PatNameInOtherLang = page.getByRole('textbox', { name: 'Patient name in other language' })
        this.txtbox_HospitalRef = page.getByRole('textbox', { name: 'Hospital Ref' })
        this.txtbox_MobileNumber = page.getByTestId('Mobile')
        this.txtbox_Postcode = page.getByTestId('Postcode')
        this.txtbox_MRNNumber = page.getByTestId('MRN Number')
        this.txtbox_IdentificationId = page.getByTestId('Identification Id')
        this.txtbox_Card = page.getByRole('textbox', { name: 'Card' })
        //this.txtbox_Barcode=page.getByRole('spinbutton', { name: 'Barcode' })
        this.txtbox_Barcode = page.getByTestId('Barcode')
        this.txtbox_NHSNo = page.getByRole('textbox', { name: 'NHS No' })
        this.txtbox_BornDate = page.getByPlaceholder('dd/mm/yyyy')
        this.dropdown_PatientSeenInLastDays = page.locator("xpath=//input[@name='patientSeenInLastDays']")
        this.txtbox_MPINumber = page.getByRole('textbox', { name: 'MPI Number' })
        this.checkbox_IncludeDeceasedPatient = page.locator("xpath=//input[@name='includeDeceasedPatients']")
        this.checkbox_IncludeServicePatient = page.locator("xpath=//input[@name='includeDeceasedService']")
        this.checkbox_Soundex = page.locator("xpath=//input[@name='soundex']")

        this.btnExportList = page.locator("xpath=//button[@data-testid='Export List']")

        this.btnSearchPatientOnPopup = page.getByTestId('CommonCellmaPopup').getByTestId('Search')
        this.btn_Search = page.locator("xpath=//button[@data-testid='Search']")
        //this.btn_Search=page.locator("xpath=//div[contains(text(),'Search')]")
        //this.btn_SearchAppPat=page.
        this.txtbox_SearchPatient = page.locator("xpath=//button[@data-testid='Search']")
        //this.txtbox_SearchPatient=page.getByRole('textbox', { name: 'Search' })
        //this.btn_AddPatient=page.locator("xpath=//button[contains(text(),'Add Patient')]")
        this.btn_AddPatient = page.locator("xpath=//button[@data-testid='Add Patient']")//17Feb2025
        this.dropdown_sex = page.locator("xpath=//input[@name='sex']")
        this.dropdown_sex_male = page.getByRole('option', { name: 'Male', exact: true })
        this.txtbox_Identifier = page.getByTestId('Identifier')
        this.txtbox_IdentificationId = page.getByTestId('Identification Id')

        this.link_SelectPatient = page.getByTestId('Select')
        this.btn_ClosePatientSelectPopup = page.getByTestId('CancelIcon')//.locator('path')
        this.btn_SelectPatientYes = page.getByTestId('Yes')
        this.btn_SelectPatientNo = page.getByTestId('No')

        this.btn_BackbtnOnPatientSearchPage = page.getByRole('button', { name: 'Back Button' })
        //Links
        this.link_Links = page.locator("xpath=//button[@data-testid='links']")
        this.link_AppointmentLink = page.locator("xpath=//li[@data-testid='appointmentsLink']")
        this.link_HelpVideos = page.locator("xpath=//li[@data-testid='helpVideoLink']")
        this.link_PatientPossibleDuplicate = page.locator("xpath=//li[@data-testid='patientDuplicateLink']")
        this.link_AppointmentReport = page.locator("xpath=//li[@data-testid='appointmentsReport']")
        this.link_CAPTNDReport = page.locator("xpath=//li[@data-testid='captndReport']")
        this.link_DueOverdueReport = page.locator("xpath=//li[@data-testid='dueOverdueReport']")
        this.link_LandonCareRecord = page.locator("xpath=//li[@data-testid='londonCareRecord']")
        this.link_PatientDemographicsReprt = page.locator("xpath=//li[@data-testid='patientDemographicsReport']")
        this.link_PatientSafetyAndChileProtectionReport = page.locator("xpath=//li[@data-testid='patientSafetyAndChildProtectionReport']")
        this.link_PatientUlcerReport = page.locator("xpath=//li[@data-testid='pressureUlcerReport']")
        this.link_PTHeatReport = page.locator("xpath=//li[@data-testid='ptHeatReport']")
        this.link_RealTimeWardManagerDashboard = page.locator("xpath=//li[@data-testid='realTimeWardManagerDashboard']")
        this.link_RealTimeAppointmentDashboard = page.locator("xpath=//li[@data-testid='realTimeAppointmentDashboard']")
        this.link_RealTimeAssignedTeamCaseloadDashboard = page.locator("xpath=//li[@data-testid='realTimeAssignedTeamCaseloadDashboard']")
        this.link_RealTimeReferralDashboard = page.locator("xpath=//li[@data-testid='realTimeReferralDashboard']")
        this.link_ReferralsReport = page.locator("xpath=//li[@data-testid='referralsReport']")


        //Custom setting button
        this.btn_settingButton = page.getByTestId('Setting Button')
        this.link_CustomizableView = page.getByTestId('Customizable View')

        //Custom setting for Appointment Module Patient search
        this.link_CustomizableViewAppPatSearch = page.getByRole('menuitem', { name: 'Customizable View' })
        this.btn_ResetToDefaultView = page.getByTestId('Reset to Default View')


        //Pageing
        this.select_2ndPage = page.getByRole('button', { name: 'Go to page 2' })

        //Export Patient List
        this.btn_ExportList = page.getByTestId('Export List')
        this.linkExportToCSV = page.getByTestId('CSV')
        this.linkExportToExcel = page.getByTestId('Excel')
        this.linkExportToXML = page.getByTestId('XML')
        this.linkExportToPDF = page.getByTestId('PDF')

        //Expand Patient Details
        this.expands_CurrentServiceDetails = page.getByTestId('Current Service Details')
        this.expands_AwaitingAcceptanceDetails = page.getByTestId('Awaiting Acceptance Details')
        this.expands_CurrentServiceDetails = page.getByTestId('Current Service Details')
        this.expands_AppointmentDetails = page.getByTestId('Appointment Details')
        this.expands_DischargedFromServiceDetails = page.getByTestId('Discharged From Service Details')
        this.expands_ContactTypeDetails = page.getByTestId('Contact Type Details')
        this.expands_PatientProcedures = page.getByTestId('Patient Procedures')
        this.expands_PatientDevices = page.getByTestId('Patient Devices')

        //Add Unknown Patient

        this.btn_AddUnknownPatient = page.getByTestId('Add Unknown Patient')
        this.txtbox_AddAge = page.getByTestId('Age')
        this.dropdownUnknownPatientBirthMonth = page.getByRole('button', { name: '1' })
        this.dropdownUnknownPatientSex = page.getByRole('button', { name: 'Male' })
        this.bnt_SaveUnknownPatient = page.getByTestId('Save')

        //Appointment module patient

    }    

    async checkAllLocatorVisibilityforFindPatient(locators) {
    // Create an array of locators

    // Loop through each locator and check its visibility
    for (let locator of locators) {
        try {
            // Wait for the locator to be visible
            await expect(locator).toBeVisible();

            // If the locator is visible, log success
            console.log(`Locator '${locator}' is displayed and visible.`);
        } catch (error) {
            // If the locator is not visible, log failure
            console.log(`Error: Locator '${locator}' is NOT visible. Error: ${error.message}`);
        }
    }
}



    async clickOnAppointmentLink()
    {
        await this.link_Links.click()
        await this.link_AppointmentLink.click()
    }

    //
   async validateMPIField(page, txtbox_MPINumber, options = {}) 
   {
    const mpi = page.locator(txtbox_MPINumber);

    // 1. Presence & Visibility
    await expect(mpi).toBeVisible();

    // 2. Enabled / Disabled State
    if (options.shouldBeEnabled !== undefined) {
        if (options.shouldBeEnabled) {
            await expect(mpi).toBeEnabled();
        } else {
            await expect(mpi).toBeDisabled();
        }
    }

    // 3. Default Value (Blank for New Patient)
    if (options.defaultValue !== undefined) {
        await expect(mpi).toHaveValue(options.defaultValue);
    }

    // 4. Valid Input Acceptance
    if (options.validInput) {
        await txtbox_MPINumber.fill(options.validInput);
        await expect(mpi).toHaveValue(options.validInput);
    }

    // 5. Invalid Input Rejection
    if (options.invalidInput && options.errorSelector && options.errorText && options.submitSelector) {
        await mpi.fill(options.invalidInput);
        await page.click(options.submitSelector);
        await expect(page.locator(options.errorSelector)).toContainText(options.errorText);
    }
}

    async clickonBackButton() {
        await this.btn_BackButton.click()
    }
    async ClickOnSaveButtonForUnknownPatient() {
        await this.bnt_SaveUnknownPatient.click()
    }
    async selectUnknownPatientSex() {
        await this.dropdownUnknownPatientSex.click()
        await this.page.getByRole('option', { name: 'Female' }).click()
    }
    async selectUnknownPatientBirthMonth() {
        await this.dropdownUnknownPatientBirthMonth.click()
        await this.page.getByRole('option', { name: '3' }).click()
    }
    async enterUnknownPatientAge() {
        await this.txtbox_AddAge.type('5')
    }
    async ClickOnAddUnknownPatient() {
        await this.btn_AddUnknownPatient.click()
    }
    async expandsPatientDetails() {
        //await this.expands_CurrentServiceDetails.click()
        // await this.expands_AwaitingAcceptanceDetails.click()
        // await this.expands_CurrentServiceDetails.click()
        // await this.expands_AppointmentDetails.click()
        // await this.expands_DischargedFromServiceDetails.click()
        await this.expands_ContactTypeDetails.click()
        // await this.expands_PatientProcedures.click()
        // await this.expands_PatientDevices.click()
    }

    async CloseConfirmLegitimateRelationship() {
        await this.btn_ClosePatientSelectPopup.click()
    }
    async ClickOnYesConfirmLegitimateRelationship() {
        await this.btn_SelectPatientYes.click()
    }
    async ClickOnNoConfirmLegitimateRelationship() {
        await this.btn_SelectPatientNo.click()
    }
    async clickOnExportPatientData() {
        await this.linkExportToCSV.click()
        await this.linkExportToExcel.click()
        await this.linkExportToXML.click()
        await this.linkExportToPDF.click()
    }
    async SearchPatientFromList() {
        await this.txtbox_SearchPatient.fill('Victor')
    }
    async ClearSearchPatientFromList() {
        await this.txtbox_SearchPatient.fill(' ')
    }

    async selectSecondPage() {
        await this.select_2ndPage.click()
    }
    async clickOncustomizableView() {
        await this.link_CustomizableView.click()
    }

    async clickOncustomizableViewforPatientSearchOnAppointment() {
        await this.link_CustomizableViewAppPatSearch.click()
    }

    async clickOnResetToDefaultViewButton() {
        await this.btn_ResetToDefaultView.click()
        await this.page.getByTestId('Ok').click()
    }
    async clickOnsettingbutton() {
        await this.btn_settingButton.click()
    }
    async clickOnPatientPossibleDuplicaateLink() {
        await this.link_PatientPossibleDuplicate.click()
    }
    async clickOnHelpVideosLink() {
        await this.link_HelpVideos.click()
    }
    // async clickOnAppointmentLink() {
    //     await this.link_AppointmentLink.click()
    // }
    async clickOnBackbuttonOnPatientSearch() {
        await this.btn_BackbtnOnPatientSearchPage.click()
    }

    //MPI Number
    async enterMPINumber(name) {
        await this.txtbox_MPINumber.type(name)

    }

    //Given Name
    // async enterGivenName(pat_firstname)
    // {
    //    await this.txtbox_GivenName.fill(pat_firstname)        
    // }
    async enterGivenName(pat_firstname) {
        await this.txtbox_GivenName.fill(pat_firstname);

        const value = await this.txtbox_GivenName.inputValue();
        if (value !== pat_firstname) {
            throw new Error(`❌ Given Name not filled correctly. Expected: "${pat_firstname}", Found: "${value}"`);
        } else {
            console.log(`✅ Given Name filled correctly: "${value}"`);
        }
    }


    //Barcode
    async enterBarcode(name) {
        await this.txtbox_Barcode.fill(name)

    }

    //Family Name
    // async enterFamilyName(pat_surname)
    // {
    //    await this.txtbox_FamilyName.type(pat_surname)        
    // }
    async enterFamilyName(pat_surname) {
        await this.txtbox_FamilyName.type(pat_surname);
    }

    //Hospital Ref
    async enterHospitalRef(name) {
        await this.txtbox_HospitalRef.type(name)
    }

    //Mobile Number
    async enterMobileNumber(name) {
        await this.txtbox_MobileNumber.type(name)
    }

    ////Postcode
    async enterPostcode(name) {
        await this.txtbox_Postcode.type(name)
    }

    //Identification ID
    async enterIdentificationId(name) {
        await this.txtbox_IdentificationId.type(name)
    }
    //MRN Number
    async enterMRNNumber(name) {
        await this.txtbox_MRNNumber.type(name)
    }

    //Name in other language
    async enterNameInOtherLanguage(name) {
        await this.txtbox_PatNameInOtherLang.type(name)
    }


    //card
    async enterCard()
    {
        await this.txtbox_Card.type("123456")
    }
    async assertDropdownValue(selector, expectedValue) {
        const dropdown = await this.page.$(selector);
        const selectedOption = await dropdown_sex.$('Male');
        const selectedValue = await selectedOption.getAttribute('value');
        expect(selectedValue).toEqual(expectedValue);
    }


    //Select Sex
    // async selectSex(pat_sex)
    // {       
    //     await this.dropdown_PatientSex.click()
    //     await this.page
    // }

    //Patient seen in last days
    async selectPatientSeenInLastDays() {
        const elem = await this.dropdown_PatientSeenInLastDays.click()
        await this.page.getByRole('option', { name: '7 Day' }).click()
        if (elem != null) {
            return elem;
        }
        else {
            console.log("Element not found");
        }
    }

    //check Future date
    async selectFutureDate() {
        const elem = await this.txtbox_BornDate.type('07/08/2024', { delay: 10 })

        if (elem != null) {
            return elem;
        }
        else {
            console.log("Element not found");
        }
    }

    async clearBornDate() {
        await this.txtbox_BornDate.fill('')
    }
    //Born Date
    async selectBornDate(pat_dob) {   //await this.txtbox_BornDate.fill('')
        //await this.txtbox_BornDate.fill(pat_dob)
        //await this.page.getByPlaceholder('dd/mm/yyyy').fill("22/09/2024")
        await this.page.locator('[data-testid="Born"]').fill(pat_dob);
        await this.page.keyboard.press("Tab");

    }
    async clickOnSearchbtnOnPopup() {
        await this.btnSearchPatientOnPopup.click()
    }

    async clickOnLoginbtn() {
        await this.btn_Search.click()
    }
    async clickOnAddPatientbnt() {
        await this.btn_AddPatient.click()
    }
    async selectSex() {
        await this.dropdown_sex.click()
        await this.dropdown_sex_male.click()
    }
    async enterPatientIdentifier() {
        await this.txtbox_Identifier.type('Idf007')
    }
    async enterPatientIdentificationId() {
        await this.txtbox_IdentificationId.type('IdfId001')
    }

    async clickOnLinks() {
        await this.link_Links.click()
    }

    //Search button
    async clickOnSearchButton() {
        await this.btn_Search.click()
    }
    async clickOnSearchPatButton() {
        await this.btn_Search.click()
    }


    //Export List button
    async clickOnExportListButton() {
        await this.btnExportList.click()
    }

    //Add Patient button
    async clickOnAddPatientbutton() {
        await this.btn_AddPatient.click()
    }

    async clickOnSearchPatientLink() {
        await this.link_SelectPatient.click()
    }





}
export default PatientSearch