import { test, expect, Page, chromium } from "@playwright/test";

const convertExcelToJson = require("../../../config/global-setupOptimized");
const { executeQuery } = require("../../../databaseWriteFile");
import compareJsons from "../../../compareFileOrJson";


import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import Environment from "../../../Pages/BaseClasses/Environment";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";
import PatientSideBar from "../../../Pages/PatientDomain/PatientSideBar";
import lettersOrSummaries from "../../../Pages/LetterDomain/lettersOrSummaries"



//import Pool from 'mysql/lib/Pool';

const logindata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/Login.json")))
const patientdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/AppointmentDomain/PatientDetails.json")))
const serviceappdetails = JSON.parse(JSON.stringify(require("../../../TestData/AppointmentDomain/ServiceApp.json")))



const consoleLogs = [];
let jsonData;

test.describe("Database Comparison Book New App and Cancel", () => {
  test("Extract Patient Details", async ({ }) => {
    const excelFilePath = process.env.EXCEL_FILE_PATH || "./ExcelFiles/LettersDomain.xlsx";
    const jsonFilePath = "./TestDataWithJSON/LetterDomain/LetterDomain.json";
    const conversionSuccess = await convertExcelToJson(excelFilePath, jsonFilePath);

    if (conversionSuccess) {
      jsonData = require("../../../TestDataWithJSON/LetterDomain/LetterDomain.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });

  test('Service Appointment @Appt', async ({ page }) => {

    const loginpage = new LoginPage(page)
    const homepage = new Homepage(page)
    const environment = new Environment(page)
    const patientsearch = new PatientSearch(page)
    const confirmexisting = new ConfirmExisting(page)
    const patientsidebar = new PatientSideBar(page)
    const letterorSummeries = new lettersOrSummaries(page)


    const index = 0;

    await page.goto(environment.Test);
    console.log("Navigated to environment.");

    await page.waitForTimeout(1500);

    await loginpage.enterUsername(jsonData.loginDetails[0].username);
    console.log("Username added successfully.");

    await page.waitForTimeout(1500);

    await loginpage.enter_Password(jsonData.loginDetails[0].password);
    console.log("Password added successfully.");

    await page.waitForTimeout(1500);

    await loginpage.clickOnLogin();
    console.log("Login successfully.");

    await homepage.clickOnSideIconPatient();
    console.log("Clicked on patient side icon.");

    await patientsearch.enterGivenName(jsonData.patDetails[index].pat_firstname);
    console.log("Entered patient's given name.");

    await patientsearch.enterFamilyName(jsonData.patDetails[index].pat_surname);
    console.log("Entered patient's family name.");

    await patientsearch.clickOnSearchPatButton();
    console.log("Clicked on search patient button.");

    await patientsearch.clickOnSearchPatientLink();
    console.log("Clicked on searched patient link.");

    await page.waitForTimeout(1000);

    await confirmexisting.clickOnConfirmExistingDetails();
    console.log("Confirmed existing patient details.");

    await page.waitForTimeout(1000);

    await patientsidebar.clickOnLettersCategory();
    console.log("Clicked on Letters category.");

    await letterorSummeries.selectLetterLocation(jsonData.letterSummries[index].patletd_patient_location);
    console.log("Selected letter location.");

    await page.waitForTimeout(1000);

    await letterorSummeries.selectLetterName(jsonData.letterSummries[index].patlet_name);
    console.log("Selected letter name.");

    await page.waitForTimeout(1000);

    await letterorSummeries.enterinputStartDate(jsonData.letterSummries[index].patletd_start_date);
    console.log("Entered letter start date.");

    await page.waitForTimeout(1000);

    await letterorSummeries.enterinputEndDate(jsonData.letterSummries[index].patletd_end_date);
    console.log("Entered letter end date.");

    await page.waitForTimeout(1000);

    await letterorSummeries.clickOnDraftbutton();
    console.log("Clicked on Draft button.");

    await page.waitForTimeout(1000);

    await letterorSummeries.clickOnCreateDraftButton();
    console.log("Clicked on Create Draft button.");

    await page.waitForTimeout(1000);

    await letterorSummeries.clickOnOkButton();
    console.log("Clicked on OK button after draft creation.");

    await page.waitForTimeout(500);

    // Check DB
    var sqlQuery = "SELECT patlet_id,patletd_patient_location,patlet_name,patlet_type,patlet_status FROM patient_letters pl JOIN patient_letter_details pld ON pl.patlet_id = pld.patletd_patlet_id ORDER BY pl.patlet_id DESC LIMIT 1;";
    console.log("SQL Query prepared:\n" + sqlQuery);

    var sqlFilePath = "SQLResults/LetterDomain/LetterData.json";
    var results = await executeQuery(sqlQuery, sqlFilePath);
    console.log("Executed query and saved results.");

    const LetterId = results[0].patlet_id;
    console.log("Letter ID is: " + LetterId);

    var match = await compareJsons(sqlFilePath, null, jsonData);
    if (match) {
      console.log("\nLetters Comparison: Parameters from both JSON files match!\n");
    } else {
      console.log("\nLetters Comparison: Parameters from both JSON files do not match!\n");
    }

    await letterorSummeries.clickSearchButton();
    console.log("Clicked search button to view created draft.");

    await page.waitForTimeout(1000);

    await letterorSummeries.enterStartDate(jsonData.letterSummries[index].patletd_start_date);
    console.log("Entered search Start Date.");

    await page.waitForTimeout(1000);

    await letterorSummeries.enterEndDate(jsonData.letterSummries[index].patletd_end_date);
    console.log("Entered search End Date.");

    await page.waitForTimeout(1000);

    await letterorSummeries.enterStatus(jsonData.letterSummries[index].patlet_status);
    console.log("Entered search Status.");

    await letterorSummeries.clickSearchButton();
    console.log("Clicked search button again to apply filters.");

    await page.waitForTimeout(1000);

    await page.getByLabel('expandRowIconundefined').click();
    console.log("Expanded letter row in results.");

    await letterorSummeries.clickOnWordFormatIcon();
    console.log("Clicked on Word format icon.");

    await letterorSummeries.clickOnHtmlIcon();
    console.log("Clicked on HTML icon.");

    await letterorSummeries.clickOnEditHistoryIcon();
    console.log("Clicked on Edit History icon.");

    await page.waitForTimeout(1000);

    await letterorSummeries.clickOnclosePopup();
    console.log("Closed Edit History popup.");

    await page.waitForTimeout(1000);

    await letterorSummeries.clickOnSendEmailButton();
    console.log("Clicked on Send Email button.");

    await page.getByRole('button', { name: 'cancelIcon' }).click();
    console.log("Cancelled Send Email popup.");

    await letterorSummeries.clickOnDeleteRecordLink();
    console.log("Clicked on Delete Record link.");

    await letterorSummeries.clickOnOkButton();
    console.log("Confirmed deletion of the letter.");

    await expect(page.getByText("Letter deleted successfully")).toHaveText("Letter deleted successfully");
    console.log("Verified 'Letter deleted successfully' message.");


  });
});