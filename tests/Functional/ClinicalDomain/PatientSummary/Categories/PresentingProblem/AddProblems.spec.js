//Saurabh
const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
const connectToDatabase = require("../../../../../../manoj").default;
const { executeQuery } = require("../../../../../../databaseWriteFile"); // Update the path accordingly
import compareJsons from "../../../../../../compareFileOrJson";

import logger from "../../../../../../Pages/BaseClasses/logger";
import LoginPage from "../../../../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../../../../Pages/BaseClasses/Homepage";
import ConfirmExisting from "../../../../../../Pages/PatientDomain/ConfirmExisting";
import ContactHistory from "../../../../../../Pages/ClinicalDomain/PatientSummary/ContactHistory";
import PatientSearch from "../../../../../../Pages/PatientDomain/PatientSearch";
import Environment from "../../../../../../Pages/BaseClasses/Environment";
import Menu from "../../../../../../Pages/BaseClasses/Menu";
import ClinicalSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";
import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;
test.describe("Excel Conversion Patient Scan Category", () => {
  test("Extract Patient Summary Details", async ({ }) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientSummary.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );
    if (conversionSuccess) {
      // jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      jsonData = require("../../../../../../TestDataWithJSON/PatientDomain/PatientSummary.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
})
test.describe("Problems Category", () => {
    test("Add Problems", async ({ page }) => {
  
  
      if (!jsonData || !jsonData.PatientDetails) {
        throw new Error("JSON data is missing or invalid.");
      }
      let index = 0;
      for (const data of jsonData.PatientDetails) {
        const loginpage = new LoginPage(page);
        const homepage = new Homepage(page);
        const environment = new Environment(page);
        const confirmexisting = new ConfirmExisting(page);
        const contacthistory = new ContactHistory(page);
        const patientsearch = new PatientSearch(page);
        const problems = new ClinicalSummary(page);
        const problemsExtraDetails = new ClinicalExtraDetails(page);
        const patientsummary = new PatientSummary(page);
  
        const menu = new Menu(page);
        await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await page.waitForTimeout(1000)
      await homepage.scrollDivToLastIcon(page);
      //await homepage.redirectsToHomePage();
      logger.info("Redirected To Home Page Successfully")
      await page.waitForTimeout(2000)
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
        logger.info("Clicked on Search button successfully");
        await patientsearch.enterGivenName(data.pat_firstname);
        logger.info("Given Name entered successfully");
        await page.pause()
        await patientsearch.enterFamilyName(data.pat_surname);
        logger.info("Family Name entered successfully");
        //await patientsearch.selectSex(data.pat_sex);
  
        await patientsearch.selectBornDate(
          jsonData.PatientDetails[index].pat_dob
        );
        await patientsearch.checkbox_IncludeServicePatient.click();
        //await patientsearch.selectBornDate(formattedDate);
        await patientsearch.clickOnSearchButton();
  
        await patientsearch.clickOnSearchPatientLink();
        await page.waitForTimeout(1500);
        await confirmexisting.clickOnConfirmExistingDetails();
        await page.waitForTimeout(6000);
      const alertPopup = page.getByRole('heading', { name: 'Alerts', exact: true })
      //page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible()) {
         const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
          await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
         await cancelButton.click({ force: true });
        }
        await page.waitForTimeout(2000);
       // await contacthistory.enterContactDate('26/04/2024');
        await contacthistory.selectContactReason('Assessments');
        await contacthistory.selectContactLocation('Cardio Location');
       // await contacthistory.enterContactWith('Dr Sathya');
        await contacthistory.clickOnAddContact();
        await problems.clickOnViewContactItemsMenu();
        await problems.clickOnPinContactItemsMenu();
       
        await problems.selectCategoryFromList("Presenting Problems");
        await page.pause()
        
        //Review and delete
        await page.waitForTimeout(5000);
       // await page.pause()
        if(await problems.checkItemOnHistoryTable(jsonData.AddProblems[index].pacr_que_name)){
          //await problems.clickOnItemReview(jsonData.AddProblems[index].pacr_que_name);
          console.log("Item reviewed before deleting");
          await problems.clickOnItemEdit(jsonData.AddProblems[index].pacr_que_name);
       
        // if(await problems.checkItemOnHistoryTable(jsonData.AddProblems[index].pacr_que_name)){
        // //await problems.clickOnItemReview(jsonData.AddProblems[index].pacr_que_name);
        // //console.log("Item reviewed before deleting");
        // await page.waitForTimeout(2000);
        // await problems.clickOnItemEdit(jsonData.AddProblems[index].pacr_que_name);
        await problemsExtraDetails.clickOnDelete();
        await problemsExtraDetails.clickOnConfirmDelete();
        await problemsExtraDetails.enterDeleteReason('Deleted Existing item');
        await problemsExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
       
       
        
        //////Fetch Patient Details/////////
   var sqlQuery =
   "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
   "' and paa_type='selected' order by 1 desc limit 1";
   var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
   var results = await executeQuery(sqlQuery, sqlFilePath);
   console.log("\n Patient Details stored into the database: \n", results);
   const patId = results[0].paa_pat_id;

   console.log("Patient Accessed by User:" + patId);

  
  // Adding new Presenting Problem
  await problems.selectandAddClinicalItem(jsonData.AddProblems[index].pacr_que_name);
  await page.waitForTimeout(2000);
  await page.getByLabel('cancelIcon').click();
  //await problemsExtraDetails.clickOnClincialItemCollapsable();
  await problems.selectandAddClinicalItem(jsonData.AddProblems[index].pacr_que_name);
  await page.waitForTimeout(1000);
  //await page.pause()
  //await problemsExtraDetails.selectClinicalItemSubcategory(jsonData.AddProblems[index].eli_text);
  await problemsExtraDetails.enterOnSetDate(jsonData.AddProblems[index].prp_date_of_onset);
  //await page.pause()
  await problemsExtraDetails.clickOnestimatedDate();
  await problemsExtraDetails.selectProblemStatus(jsonData.AddProblems[index].prp_status);
  await problemsExtraDetails.selectProblemOnset(jsonData.AddProblems[index].prp_onset);
  await problemsExtraDetails.selectProblemSeverity(jsonData.AddProblems[index].prp_severity);
  await problemsExtraDetails.enterRating(jsonData.AddProblems[index].prp_rating);
  await problemsExtraDetails.clickOPrivateRecord();
  await page.waitForTimeout(500);
  // await problemsExtraDetails.clickOPrivateRecord();
  // await page.waitForTimeout(500);
  // await problemsExtraDetails.clickOnSetAsDefault();
  // await page.waitForTimeout(500);
  // await problemsExtraDetails.clickOnSetAsDefault();
  // await page.waitForTimeout(500);
  await problemsExtraDetails.enterProblemNotes(jsonData.AddProblems[index].prp_notes);
  await problemsExtraDetails.clickOnSaveExtraDetails();
  //await page.getByLabel('saveChecklist').click()
  await page.waitForTimeout(500);
  

  ////// Database comparison- Patient Clinical Records - ADDING NEW PRESENTING PROBLEMS/////////
  sqlQuery =
  "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " + 
  "prp_status,prp_date_of_onset,prp_onset,prp_severity,prp_rating,prp_notes,pacrd_subcategory_eli_code from patient_clinical_records join patient_clinical_records_details"+
  " on pacr_id=pacrd_pacr_id join presenting_problems on pacr_id=prp_pacr_id where pacr_record_status='approved'"+
  " and pacrd_record_status='approved' and prp_record_status='approved' and pacr_pat_id=" + patId +
  " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddProblems[index].pacr_que_name +
  "' and pacr_category='Presenting Problem' order by 1 desc limit 1";
 console.log("Presenting Problem query"+sqlQuery)       
 

sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
results = await executeQuery(sqlQuery, sqlFilePath);
const pacrId = results[0].pacr_id;
console.log("\n Patient Clinical Records stored into the database: \n", results);
var match = await compareJsons(sqlFilePath, null, jsonData.AddProblems[index]);
if (match) {
  console.log("\n Patient Clinical Records Comparision Add Problems: Parameters from both JSON files match!\n");
} else {
  console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
} 

  // Edit presenting problems
      await page.waitForTimeout(1000);
      await problems.clickOnItemEdit(jsonData.AddProblems[index].pacr_que_name);
      //await problems.clickOnItemEdit('Back Pain');
      await page.waitForTimeout(2000);
      //await problemsExtraDetails.clickOnClincialItemCollapsable();
     await problemsExtraDetails.selectClinicalItemSubcategory(jsonData.EditProblems[index].eli_text);
      await problemsExtraDetails.enterOnsetDate(jsonData.EditProblems[index].prp_date_of_onset);
      await problemsExtraDetails.clickOnactualDate();
      await problemsExtraDetails.selectProblemStatus(jsonData.EditProblems[index].prp_status);
      await problemsExtraDetails.selectProblemOnset(jsonData.EditProblems[index].prp_onset);
      await problemsExtraDetails.selectProblemSeverity(jsonData.EditProblems[index].prp_severity);
      await problemsExtraDetails.enterRating(jsonData.EditProblems[index].prp_rating);
      await problemsExtraDetails.enterProblemNotes(jsonData.EditProblems[index].prp_notes);
      await problemsExtraDetails.clickOnSaveExtraDetails();
      //await page.getByLabel('saveChecklist').click()
      await page.waitForTimeout(1000);


              ////// Database comparison - Patient Clinical Records - UPDATE Patient Scans/////////
     sqlQuery = "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " + 
  "prp_status,prp_date_of_onset,prp_onset,prp_severity,prp_rating,prp_notes,pacrd_subcategory_eli_code from patient_clinical_records join patient_clinical_records_details"+
  " on pacr_id=pacrd_pacr_id join presenting_problems on pacr_id=prp_pacr_id where pacr_record_status='approved'"+
  " and pacrd_record_status='approved' and prp_record_status='approved'and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditProblems[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Update Problems: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
   }


       // Auto update risk after updating Presenting Problems
      //  await problems.clickOnItemHistory();
      //  await problems.clickOnHistoryItemByType(jsonData.AddProblems[index].pacr_que_name);
      await problems.clickOnItemHistory();
      await problems.clickOnHistoryItemDiv();
       await page.waitForTimeout(1000);
       await problems.closeWindow();
       await page.waitForTimeout(2000);
       if (await problems.checkItemOnHistoryTable(null, true)) {
         console.error('Newly added item has not been reviewed after updating the record.');
         await problems.clickOnItemReview();
       } else {
         console.log('Newly added item has been reviewed after updating the record.');
       }
       await page.waitForTimeout(500);
       await problems.clickOnItemHighlightNone();
       await page.waitForTimeout(500);
       await problems.selectLowRiskLevel();
       await page.waitForTimeout(500);
       await problems.selectModerateRiskLevel();
       await page.waitForTimeout(500);
       await problems.selectHighRiskLevel();
       await page.waitForTimeout(500);
       await problems.selectAllRiskLevel();
       await problems.clickOnLevelTwoExtraDetails();
       await problems.clickOnLevelOneExtraDetails();
       await page.waitForTimeout(1000);
       await problems.clickOnCurrentItemsSection();
       await page.waitForTimeout(1000);
       await problems.clickOnMigratedItemsSection();
       await page.waitForTimeout(1000);
       await problems.clickOnDeletedItemsSection();
       await page.waitForTimeout(1000);
       await problems.clickOnArchivedItemsSection();
       await page.waitForTimeout(1000);
       await problems.clickOnAllItemsSection()
       await page.waitForTimeout(1000);
      //  await problems.homepageOverviewIcon()
      //  await page.waitForTimeout(1000);
       
      //  await problems.homepageIcons();
      //  await page.waitForTimeout(1000);
       await problems.clickOnLevelOneExtraDetails()
       await problems.clickOnLevelTwoExtraDetails()
       await problems.clickOnLevelThreeExtraDetails()
       

      //Delete presenting problem
      await problems.clickOnItemEdit(jsonData.AddProblems[index].pacr_que_name);
     // await problems.clickOnItemEdit('Back pain');
      await page.waitForTimeout(2000);
     // await problemsExtraDetails.clickOnEdPopup()
      await problemsExtraDetails.clickOnDelete();
      await problemsExtraDetails.clickOnCancelDelete();
      await problemsExtraDetails.clickOnDelete();
      await problemsExtraDetails.clickOnConfirmDelete();
      await problemsExtraDetails.enterDeleteReason(jsonData.DeleteProblems[index].pacr_delete_reason);
      await problemsExtraDetails.clickOnSaveDeleteReason();
      

      await page.waitForTimeout(1000);
      sqlQuery =
      "select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
      pacrId +
      " and pacr_record_status='wrong'";
 
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    //  pacrId=results[0].pacr_id;
    console.log("\n Patient Details stored into the database: \n", results);
    var match = await compareJsons(
      sqlFilePath,
      null,
      jsonData.DeleteProblems[index]
    );
    if (match) {
      console.log(
        "\n  Patient Clinical Records Comparision Delete Problems: Parameters from both JSON files match!\n"
      );
    } else {
      console.log(
        "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
      );
    }
  //  await page.pause()
 
 
     if(!(await problems.checkItemOnHistoryTable(jsonData.EditProblems[index].pacr_que_name)) ){
       console.log("Item removed from All Category Section");
     }


     //await problems.logoutCellma()
    }
});
})