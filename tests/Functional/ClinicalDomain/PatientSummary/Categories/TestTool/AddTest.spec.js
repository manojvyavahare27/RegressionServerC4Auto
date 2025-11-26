//Thayne

const convertExcelToJson = require("../../../../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
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
import TestToolDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Test/Tool Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
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
});

test.describe("Test and Tool Category", () => {
    test("Add, Edit, Delete Test and Tool", async ({ page }) => {
        if (!jsonData || !jsonData.PatientDetails) {
        throw new Error("JSON data is missing or invalid.");
        }
        let index = 0;
        for (const data of jsonData.DevicePatientDetails) {
            const loginpage = new LoginPage(page);
            const homepage = new Homepage(page);
            const environment = new Environment(page);
            const confirmexisting = new ConfirmExisting(page);
            const contacthistory = new ContactHistory(page);
            const patientsearch = new PatientSearch(page);
            const SummaryPage = new ClinicalSummary(page);
            const TestTool = new TestToolDetails(page);

            const menu = new Menu(page);
            await page.goto(environment.Test);
            await loginpage.enterUsername(jsonData.loginDetails[0].username);
            logger.info("Username enter successfully");
            await loginpage.enter_Password(jsonData.loginDetails[0].password);
            logger.info("Password enter successfully");
            await loginpage.clickOnLogin();
            logger.info("Clicked on Login button successfully");            
           
            await homepage.clickOnPatientIcon();
            logger.info("Clicked on Patient Icon successfully");
            await patientsearch.clickOnSearchButton();
            logger.info("Clicked on Search button successfully");
            await patientsearch.enterGivenName(data.pat_firstname);
            logger.info("Given Name entered successfully");
            //await page.pause()
            await patientsearch.enterFamilyName(data.pat_surname);
            logger.info("Family Name entered successfully");
            //await patientsearch.selectSexAtBirth(data.pat_sex);
            await patientsearch.selectBornDate(data.pat_dob);
            //await patientsearch.selectBornDate(formattedDate);
            await patientsearch.clickOnSearchButton();
            await patientsearch.clickOnSearchPatientLink();
            //await page.waitForTimeout(4000);
            //page.waitForSelector("xpath=//button[@data-testid='Confirm Existing Details']");
            await confirmexisting.btn_confirmExistingDetails.waitFor();
            await page.waitForTimeout(1000);
            await confirmexisting.clickOnConfirmExistingDetails();
            await page.waitForTimeout(4000);
      const alertPopup = page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible()) {
         const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
          await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
          await cancelButton.click();
        }
      await page.waitForTimeout(2000);
            await contacthistory.selectContactReason("Data Entry");
            await contacthistory.selectContactLocation("Cardio Location");
            await contacthistory.clickOnAddContact();
            await SummaryPage.selectCategoryFromList("Test Tools");
            await page.waitForTimeout(2000);

            //////CHECK FOR ANY EXISTING TEST AND DELETE/////
            await page.waitForTimeout(8000);
//await page.pause()
            var editButton = await TestTool.editIcon.isVisible();

            if (editButton) {
              await TestTool.clickOnEditIcon();
              await TestTool.clickOnDeleteDevice();
              await TestTool.clickOnOkPopup();
              await TestTool.enterDeleteDeviceReason(jsonData.EditTest[index].pacr_delete_reason);
              await TestTool.clickOnSaveDeleteReason();
              console.log("\x1bItem was deleted successfully\x1b[0m");
            }
            await page.waitForTimeout(2000);


            //////Fetch Patient Details/////////
            var sqlQuery =
              "select * from patient_audit where paa_use_username='" +
              jsonData.loginDetails[0].username +
              "' and paa_type='selected' order by 1 desc limit 1";
            var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
            var results = await executeQuery(sqlQuery, sqlFilePath);
            console.log("\n Patient Details stored into the database: \n", results);
            const patId = results[0].paa_pat_id;
            console.log("Patient Accessed by User:" + patId);

            //await page.pause()
            // Add New Test Pressure Ulcer Test
            await SummaryPage.selectTestToolItem(jsonData.AddTest[index].pattes_tests_question_que_name);
            await SummaryPage.clickOnAddButton()
            await TestTool.selectSensoryPerception(jsonData.AddTest[index].pattes_answer_0);
            await TestTool.selectMoisture(jsonData.AddTest[index].pattes_answer_1);
            await TestTool.selectActivityTest(jsonData.AddTest[index].pattes_answer_2);
            await TestTool.selectMobility(jsonData.AddTest[index].pattes_answer_3);
            await TestTool.selectNutrition(jsonData.AddTest[index].pattes_answer_4);
            await TestTool.selectFrictionAndShear(jsonData.AddTest[index].pattes_answer_5);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.AddTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            await TestTool.clickOnExtraDetailsView2();

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      
            // var count = 0;

            ///////// Database comparison- Patient Test Records - ADDING NEW TEST /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            let pacrId = results[0].pacr_id;
            console.log("Patient test clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Add Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            let mismatchedValues = [];
            var match = 1;
            if(results[0].pattes_tests_question_que_name !== jsonData.AddTest[index].pattes_tests_question_que_name) {
              match = 0;
              mismatchedValues.push('pattes_tests_question_que_name');
            }
            if(results[0].pattes_notes!== jsonData.AddTest[index].pattes_notes) {
              match = 0;
              mismatchedValues.push('pattes_notes');
            }
            if(results[1].pattes_answer !== jsonData.AddTest[index].pattes_answer_3) {
              match = 0;
              mismatchedValues.push('pattes_answer_3');
            }
            if(results[2].pattes_answer !== jsonData.AddTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }
            if(results[3].pattes_answer !== jsonData.AddTest[index].pattes_answer_5) {
              match = 0;
              mismatchedValues.push('pattes_answer_5');
            }
            if(results[4].pattes_answer !== jsonData.AddTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[5].pattes_answer !== jsonData.AddTest[index].pattes_answer_4) {
              match = 0;
              mismatchedValues.push('pattes_answer_4');
            }
            if(results[6].pattes_answer !== jsonData.AddTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            // Edit Test
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTest[index].pattes_review_date);
            await TestTool.enterLastReviewedDate(jsonData.EditTest[index].pattes_last_reviewed);
            //await page.pause()
            await TestTool.selectSensoryPerception(jsonData.EditTest[index].pattes_answer_0);
            await TestTool.selectMoisture(jsonData.EditTest[index].pattes_answer_1);
            await TestTool.selectActivityTest(jsonData.EditTest[index].pattes_answer_2);
            await TestTool.selectMobility(jsonData.EditTest[index].pattes_answer_3);
            await TestTool.selectNutrition(jsonData.EditTest[index].pattes_answer_4);
            await TestTool.selectFrictionAndShear(jsonData.EditTest[index].pattes_answer_5);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.EditTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Test /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            match = 1;
            mismatchedValues = [];

            if(results[1].pattes_answer !== jsonData.EditTest[index].pattes_answer_3) {
              match = 0;
              mismatchedValues.push('pattes_answer_3');
            }
            if(results[2].pattes_answer !== jsonData.EditTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }
            if(results[3].pattes_answer !== jsonData.EditTest[index].pattes_answer_5) {
              match = 0;
              mismatchedValues.push('pattes_answer_5');
            }
            if(results[4].pattes_answer !== jsonData.EditTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[5].pattes_answer !== jsonData.EditTest[index].pattes_answer_4) {
              match = 0;
              mismatchedValues.push('pattes_answer_4');
            }
            if(results[6].pattes_answer !== jsonData.EditTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Edit test: Parameters from questions both match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Edit test: Parameters from questions do not match!\n"
              );
            }

            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc limit 1;";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Test
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTest[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Test /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
            index++

            // Add New Test Malnutrition universal screening Test
            await SummaryPage.selectTestToolItem(jsonData.AddTest[index].pattes_tests_question_que_name);
            await SummaryPage.clickOnAddButton()
            await TestTool.selectBmiScore(jsonData.AddTest[index].pattes_answer_0);
            await TestTool.selectUnplannedWeightLoss(jsonData.AddTest[index].pattes_answer_1);
            await TestTool.selectNoNutritonalIntake(jsonData.AddTest[index].pattes_answer_2);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.AddTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //await expect.soft(page.getByText("Device record added successfully")).toHaveText("Device record added successfully");
            await TestTool.clickOnExtraDetailsView2();

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      


            ///////// Database comparison- Patient Test Records - ADDING NEW TEST /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Add Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            
            mismatchedValues = [];
            match = 1;
            
            if(results[0].pattes_tests_question_que_name !== jsonData.AddTest[index].pattes_tests_question_que_name) {
              match = 0;
              mismatchedValues.push('pattes_tests_question_que_name');
            }
            if(results[0].pattes_notes !== jsonData.AddTest[index].pattes_notes) {
              match = 0;
              mismatchedValues.push('pattes_notes');
            }
            if(results[1].pattes_answer!== jsonData.AddTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.AddTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.AddTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            
            // Edit Test
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTest[index].pattes_review_date);
            await TestTool.enterLastReviewedDate(jsonData.EditTest[index].pattes_last_reviewed);
            await TestTool.selectBmiScore(jsonData.EditTest[index].pattes_answer_0);
            await TestTool.selectUnplannedWeightLoss(jsonData.EditTest[index].pattes_answer_1);
            await TestTool.selectNoNutritonalIntake(jsonData.EditTest[index].pattes_answer_2);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.EditTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Test /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );

            mismatchedValues = [];
            match = 1;
            
            if(results[0].pattes_tests_question_que_name !== jsonData.EditTest[index].pattes_tests_question_que_name) {
              match = 0;
              mismatchedValues.push('pattes_tests_question_que_name');
            }
            if(results[0].pattes_notes !== jsonData.EditTest[index].pattes_notes) {
              match = 0;
              mismatchedValues.push('pattes_notes');
            }
            if(results[1].pattes_answer!== jsonData.EditTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.EditTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.EditTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Edit test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from both JSON files do not match!\n"
              );
            }

            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc limit 1;";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Test
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTest[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Test /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
            index++;

            // Add New Test Falls Risk Assessment Scale
            await SummaryPage.selectTestToolItem(jsonData.AddTest[index].pattes_tests_question_que_name);
            await SummaryPage.clickOnAddButton()
            await TestTool.selectRecentFalls(jsonData.AddTest[index].pattes_answer_0);
            await TestTool.selectMedications(jsonData.AddTest[index].pattes_answer_1);
            await TestTool.selectPsycological(jsonData.AddTest[index].pattes_answer_2);
            await TestTool.selectCognitiveStatus(jsonData.AddTest[index].pattes_answer_3);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.AddTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //await expect.soft(page.getByText("Device record added successfully")).toHaveText("Device record added successfully");
            await TestTool.clickOnExtraDetailsView2();

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      


            ///////// Database comparison- Patient Test Records - ADDING NEW TEST /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Add Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            
            match = 1;
            mismatchedValues = [];

            if(results[0].pattes_tests_question_que_name !== jsonData.AddTest[index].pattes_tests_question_que_name) {
              match = 0;
              mismatchedValues.push('pattes_tests_question_que_name');
            }
            if(results[0].pattes_notes !== jsonData.AddTest[index].pattes_notes) {
              match = 0;
              mismatchedValues.push('pattes_notes');
            }
            if(results[1].pattes_answer !== jsonData.AddTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.AddTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.AddTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }
            if(results[4].pattes_answer !== jsonData.AddTest[index].pattes_answer_3) {
              match = 0;
              mismatchedValues.push('pattes_answer_3');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            // Edit Test Falls Risk Assessment Scale
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTest[index].pattes_review_date);
            await TestTool.enterLastReviewedDate(jsonData.EditTest[index].pattes_last_reviewed);
            await TestTool.selectRecentFalls(jsonData.EditTest[index].pattes_answer_0);
            await TestTool.selectMedications(jsonData.EditTest[index].pattes_answer_1);
            await TestTool.selectPsycological(jsonData.EditTest[index].pattes_answer_2);
            await TestTool.selectCognitiveStatus(jsonData.EditTest[index].pattes_answer_3);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.EditTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Test /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );

            mismatchedValues = [];
            match = 1;

            if(results[1].pattes_answer !== jsonData.EditTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.EditTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.EditTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Edit test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from both JSON files do not match!\n"
              );
            }

            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc limit 1;";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Test
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTest[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Test /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
            index++;

            // Add New Test PHQ-9
            await SummaryPage.selectTestToolItem(jsonData.AddTest[index].pattes_tests_question_que_name);
            await SummaryPage.clickOnAddButton()
            await TestTool.selectInterestOrPleasure(jsonData.AddTest[index].pattes_answer_0);
            await TestTool.selectDownOrDepressed(jsonData.AddTest[index].pattes_answer_1);
            await TestTool.selectTroubleSleeping(jsonData.AddTest[index].pattes_answer_2);
            await TestTool.selectTiredLittleEnergy(jsonData.AddTest[index].pattes_answer_3);
            await TestTool.selectPoorAppetite(jsonData.AddTest[index].pattes_answer_4);
            await TestTool.selectFeelingBadAboutYourself(jsonData.AddTest[index].pattes_answer_5);
            await TestTool.selectTroubleConcentrating(jsonData.AddTest[index].pattes_answer_6);
            await TestTool.selectMovingSlowly(jsonData.AddTest[index].pattes_answer_7);
            await TestTool.selectThoughtsOfDeath(jsonData.AddTest[index].pattes_answer_8);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.AddTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //await expect.soft(page.getByText("Device record added successfully")).toHaveText("Device record added successfully");
            await TestTool.clickOnExtraDetailsView2();

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      
           
            ///////// Database comparison- Patient Test Records - ADDING NEW TEST /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Add Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );

            mismatchedValues = [];
            match = 1;

            if(results[0].pattes_tests_question_que_name !== jsonData.AddTest[index].pattes_tests_question_que_name) {
              match = 0;
              mismatchedValues.push('pattes_tests_question_que_name');
            }
            if(results[0].pattes_notes!== jsonData.AddTest[index].pattes_notes) {
              match = 0;
              mismatchedValues.push('pattes_notes');
            }
            if(results[1].pattes_answer !== jsonData.AddTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.AddTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.AddTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }
            if(results[4].pattes_answer !== jsonData.AddTest[index].pattes_answer_3) {
              match = 0;
              mismatchedValues.push('pattes_answer_3');
            }
            if(results[5].pattes_answer !== jsonData.AddTest[index].pattes_answer_4) {
              match = 0;
              mismatchedValues.push('pattes_answer_4');
            }
            if(results[6].pattes_answer !== jsonData.AddTest[index].pattes_answer_5) {
              match = 0;
              mismatchedValues.push('pattes_answer_5');
            }
            if(results[7].pattes_answer !== jsonData.AddTest[index].pattes_answer_6) {
              match = 0;
              mismatchedValues.push('pattes_answer_6');
            }
            if(results[8].pattes_answer !== jsonData.AddTest[index].pattes_answer_7) {
              match = 0;
              mismatchedValues.push('pattes_answer_7');
            }
            if(results[9].pattes_answer !== jsonData.AddTest[index].pattes_answer_8) {
              match = 0;
              mismatchedValues.push('pattes_answer_8');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Add new test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            // Edit Test PHQ-9
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTest[index].pattes_review_date);
            await TestTool.enterLastReviewedDate(jsonData.EditTest[index].pattes_last_reviewed);
            await TestTool.selectInterestOrPleasure(jsonData.EditTest[index].pattes_answer_0);
            await TestTool.selectDownOrDepressed(jsonData.EditTest[index].pattes_answer_1);
            await TestTool.selectTroubleSleeping(jsonData.EditTest[index].pattes_answer_2);
            await TestTool.selectTiredLittleEnergy(jsonData.EditTest[index].pattes_answer_3);
            await TestTool.selectPoorAppetite(jsonData.EditTest[index].pattes_answer_4);
            await TestTool.selectFeelingBadAboutYourself(jsonData.EditTest[index].pattes_answer_5);
            await TestTool.selectTroubleConcentrating(jsonData.EditTest[index].pattes_answer_6);
            await TestTool.selectMovingSlowly(jsonData.EditTest[index].pattes_answer_7);
            await TestTool.selectThoughtsOfDeath(jsonData.EditTest[index].pattes_answer_8);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterNotes(jsonData.EditTest[index].pattes_notes);
            await TestTool.clickOnSaveTest();
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Test /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTest[index].pattes_tests_question_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_answer, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc;";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            match = 1;
            mismatchedValues = [];

            if(results[1].pattes_answer !== jsonData.EditTest[index].pattes_answer_0) {
              match = 0;
              mismatchedValues.push('pattes_answer_0');
            }
            if(results[2].pattes_answer !== jsonData.EditTest[index].pattes_answer_1) {
              match = 0;
              mismatchedValues.push('pattes_answer_1');
            }
            if(results[3].pattes_answer !== jsonData.EditTest[index].pattes_answer_2) {
              match = 0;
              mismatchedValues.push('pattes_answer_2');
            }
            if(results[4].pattes_answer !== jsonData.EditTest[index].pattes_answer_3) {
              match = 0;
              mismatchedValues.push('pattes_answer_3');
            }
            if(results[5].pattes_answer !== jsonData.EditTest[index].pattes_answer_4) {
              match = 0;
              mismatchedValues.push('pattes_answer_4');
            }
            if(results[6].pattes_answer !== jsonData.EditTest[index].pattes_answer_5) {
              match = 0;
              mismatchedValues.push('pattes_answer_5');
            }
            if(results[7].pattes_answer !== jsonData.EditTest[index].pattes_answer_6) {
              match = 0;
              mismatchedValues.push('pattes_answer_6');
            }
            if(results[8].pattes_answer !== jsonData.EditTest[index].pattes_answer_7) {
              match = 0;
              mismatchedValues.push('pattes_answer_7');
            }
            if(results[9].pattes_answer !== jsonData.EditTest[index].pattes_answer_8) {
              match = 0;
              mismatchedValues.push('pattes_answer_8');
            }

            if (match == 1) {
              console.log(
                "\n Patient - Edit test: Parameters from questions both match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Edit test: Parameters from questions do not match!\n"
              );
            }

            sqlQuery = 
            "select pattes_test_pacr_id, pattes_pat_id, pattes_tests_question_que_name, pattes_notes, "+
            "pattes_review_date, pattes_last_reviewed "+
            "from patient_tests "+
            "where pattes_test_pacr_id = "+pacrId+" and pattes_record_status = 'approved' "+
            "order by 1 asc limit 1;";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit test: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Test
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTest[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Test /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTest[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete test: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
        }
    });
});