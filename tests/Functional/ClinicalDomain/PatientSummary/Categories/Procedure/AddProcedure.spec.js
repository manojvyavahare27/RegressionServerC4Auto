//Sathyanarayan

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


import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Procedure Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientSummary.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(excelFilePath, jsonFilePath);
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
});

test.describe("Procedure Category", () => {
  test("Add Procedure", async ({ page }) => {
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
      const Procedures = new ClinicalSummary(page);
      const ProceduresExtraDetails = new ClinicalExtraDetails(page);
      

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
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);

    await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.checkbox_IncludeServicePatient.click();
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
     // await page.pause()
      await confirmexisting.clickOnConfirmExistingDetails(); 
      await page.waitForTimeout(6000);
      const alertPopup = page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible()) {
         const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
          await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
         await cancelButton.click({ force: true });
        }
        await page.waitForTimeout(2000);
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await Procedures.clickOnViewContactItemsMenu();
      await Procedures.clickOnPinContactItemsMenu();
      await Procedures.selectCategoryFromList("Procedures");
      await page.waitForTimeout(2000)
     
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await Procedures.checkItemOnHistoryTable(jsonData.AddProcedure[index].pacr_que_name)){
        await Procedures.clickOnItemReview(jsonData.AddProcedure[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await Procedures.clickOnItemEdit(jsonData.AddProcedure[index].pacr_que_name);
        await ProceduresExtraDetails.clickOnDelete();
        await ProceduresExtraDetails.clickOnConfirmDelete();
        await ProceduresExtraDetails.enterDeleteReason('Deleted Existing item');
        await ProceduresExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
        await page.waitForTimeout(2000)
       
       //////Fetch Patient Details/////////
      var sqlQuery =
      "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
      "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;
      console.log("Patient Accessed by User:" + patId);

      ////////Check Remove and Restore Question from Customizable view/////
      
      // await Procedures.selectandAddClinicalItem(jsonData.AddProcedure[index].pacr_que_name); //This searches item and clicks on add button
      // await page.waitForTimeout(2000);  
      // await page.pause()    
      // await ProceduresExtraDetails.clickOnClincialItemCollapsable();
      // await page.waitForTimeout(1000);      
      // await contacthistory.clickOnSettingButton() 
      // await contacthistory.clickOnCustomizableView()     
      // await Procedures.clickOnDeleteQuestion(jsonData.AddProcedure[index].question_name)    
      // await page.waitForTimeout(3000)
      // await Procedures.clickOnRestoreQuestion(jsonData.AddProcedure[index].question_name)
      // await page.waitForTimeout(2000)
      // await Procedures.clickOnDeleteQuestion(jsonData.AddProcedure[index].question_name) 
      // await page.waitForTimeout(3000)
      // await ProceduresExtraDetails.clickOnSaveExtraDetails()
      // ////////Restored Customizable view//////
      // await Procedures.selectandAddClinicalItem(jsonData.AddProcedure[index].pacr_que_name)
      //   await page.waitForTimeout(2000);      
      //   await ProceduresExtraDetails.clickOnClincialItemCollapsable();
      //   await page.waitForTimeout(1000);      
      //   await contacthistory.clickOnSettingButton() 
      //   await contacthistory.clickOnCustomizableView()     
      //   //await Procedures.clickOnDeleteQuestion(jsonData.AddProcedure[index].question_name)   
      //   await page.waitForTimeout(4000)
      //   await Procedures.clickOnRestoreQuestion(jsonData.AddProcedure[index].question_name)
      //   await page.waitForTimeout(1000)
      //   await ProceduresExtraDetails.clickOnSave();
               // Add New Procedures
               await page.pause()
      await Procedures.selectandAddClinicalItem(jsonData.AddProcedure[index].pacr_que_name)
      await page.waitForTimeout(2000);      
      await page.getByLabel('cancelIcon').click();
      await Procedures.selectandAddClinicalItem(jsonData.AddProcedure[index].pacr_que_name)
     // await ProceduresExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);      
      //await ProceduresExtraDetails.selectClinicalItemSubcategory(jsonData.AddProcedure[index].eli_text);      
      await ProceduresExtraDetails.enterDateOfProcedure(jsonData.AddProcedure[index].proc_procedure_date)
      await ProceduresExtraDetails.selectProcedureType(jsonData.AddProcedure[index].proc_type)
      await ProceduresExtraDetails.selectProcedureSite(jsonData.AddProcedure[index].proc_site)      
     // await ProceduresExtraDetails.selectandAddPerformedByGP(jsonData.AddProcedure[index].medi_duration)
      await ProceduresExtraDetails.selectProcedureLevel(jsonData.AddProcedure[index].proc_procedure_level)
      await ProceduresExtraDetails.selectProcedureStatus(jsonData.AddProcedure[index].pacr_status)
      await ProceduresExtraDetails.selectProcedureOutcome(jsonData.AddProcedure[index].proc_outcome)
           
      
      await ProceduresExtraDetails.selectProcedureCheckboxSetAsDefault()      
      await ProceduresExtraDetails.selectProcedureCheckboxPrivateRecord()  
                await page.pause()
      await ProceduresExtraDetails.enterProcedureNotes(jsonData.AddProcedure[index].proc_notes) 
      await ProceduresExtraDetails.clickOnConditionExtraDetails();
      //await page.pause()
      //await page.getByLabel('saveChecklist').click()
    //  await page.waitForTimeout(2000);     
    //   await page.getByLabel('saveChecklist').click()     
    //   await page.waitForTimeout(500);
      
      await expect(page.getByText("Procedure record added successfully")).toHaveText("Procedure record added successfully");
     
     

      ////// Database comparison- Patient Clinical Records - ADDING NEW Procedures/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, proc_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join procedures on pacr_id=proc_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name like '%" + jsonData.AddProcedure[index].pacr_que_name + "%' and pacr_category='Procedure' order by 1 desc limit 1";


     console.log("Manoj add Procedure:  "+ sqlQuery);   
     //await page.pause()        
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddProcedure[index]);
    if (match) {
       console.log("\n Patient Clinical Records Comparision adding new Procedures: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Procedures: Parameters from both JSON files do not match!\n");
    }
   
    await page.waitForTimeout(1500)
    await page.pause()
     // await Procedures.clickOnItemEdit();
     await page.locator("xpath=//button[@aria-label='editIconButton']").click()
     // await ProceduresExtraDetails.clickOnClincialItemCollapsable();
      //await ProceduresExtraDetails.selectClinicalItemSubcategory(jsonData.AddProcedure[index].eli_text);      
      await ProceduresExtraDetails.enterDateOfProcedure(jsonData.AddProcedure[index].proc_procedure_date)
      await ProceduresExtraDetails.selectProcedureType(jsonData.AddProcedure[index].proc_type)
      await ProceduresExtraDetails.selectProcedureSite(jsonData.AddProcedure[index].proc_site)      
     // await ProceduresExtraDetails.selectandAddPerformedByGP(jsonData.AddProcedure[index].medi_duration)
      await ProceduresExtraDetails.selectProcedureLevel(jsonData.AddProcedure[index].proc_procedure_level)
      await ProceduresExtraDetails.selectProcedureStatus(jsonData.AddProcedure[index].pacr_status)
      await ProceduresExtraDetails.selectProcedureOutcome(jsonData.AddProcedure[index].proc_outcome)
      await ProceduresExtraDetails.clickOnConditionExtraDetails();      
      // await page.waitForTimeout(1500);           
      // await page.getByLabel('saveChecklist').click()    
      //await page.getByRole('button', { name: 'Save' }).click()
      //await page.waitForTimeout(1500);

       ////// Database comparison - Patient Clinical Records - UPDATE Procedures/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, proc_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join procedures on pacr_id=proc_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and proc_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query Procedures: "+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditProcedure[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit Procedures: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit Procedures: Parameters from both JSON files do not match!\n");
   }

   //await page.pause()
   ////////AUTO UPDATE RISK AFTER UPDATING Procedures /////
      //await Procedures.clickOnItemHistory();
      //page.locator("xpath=//a[normalize-space(text())='Division of Left Knee Tendon, Open Approach']/ancestor::tr//button[@aria-label='patientHistoryIconButton']")
      //await Procedures.clickOnHistoryItemDiv();
      //await page.waitForTimeout(500);
      //await Procedures.closeWindow();
      //await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await Procedures.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await Procedures.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await Procedures.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await Procedures.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await Procedures.selectAllRiskLevel();
      await Procedures.clickOnLevelTwoExtraDetails();
     // await Procedures.clickOnLevelThreeExtraDetails();
      await Procedures.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE Procedures RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditProcedure[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit Procedures Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit Procedures Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////

     // await Procedures.clickOnItemEdit();
      await page.locator("xpath=//button[@aria-label='editIconButton']").click()
      await ProceduresExtraDetails.clickOnDelete();
      await ProceduresExtraDetails.clickOnCancelDelete();
      await ProceduresExtraDetails.clickOnDelete();
      await ProceduresExtraDetails.clickOnConfirmDelete();
      await ProceduresExtraDetails.enterDeleteReason(jsonData.DeleteProcedure[index].pacr_delete_reason);
      await ProceduresExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000)
     // await page.pause();

       ////// Database comparison- Patient Clinical Records - DELETE Procedures/////////
       sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
       pacrId +
       " and pacr_record_status='wrong'";

     sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
     results = await executeQuery(sqlQuery, sqlFilePath);
     //  pacrId=results[0].pacr_id;
     console.log("\n Patient Details stored into the database: \n", results);
     var match = await compareJsons(sqlFilePath, null, jsonData.DeleteProcedure[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Medications: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Medications: Parameters from both JSON files do not match!\n"
       );
     }        

     await Procedures.clickOnGeneralItemsSection()
     await Procedures.clickOnSurgicalItemsSection()
      await Procedures.clickOnMigratedItemsSection();
      await Procedures.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await Procedures.clickOnArchivedItemsSection();
      await Procedures.clickOnAllItemsSection();
      //await Procedures.toggleHistorySection(); // Close the history section
   
     // await page.pause();
    }
  });
});
