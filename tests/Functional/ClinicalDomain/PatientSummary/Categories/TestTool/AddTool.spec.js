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
             await page.waitForTimeout(1000)
             
            await homepage.clickOnPatientIcon();
            logger.info("Clicked on Patient Icon successfully");
            await patientsearch.clickOnSearchButton();
            logger.info("Clicked on Search button successfully");
            await patientsearch.enterGivenName(data.pat_firstname);
            logger.info("Given Name entered successfully");
            await patientsearch.enterFamilyName(data.pat_surname);
            logger.info("Family Name entered successfully");
            //await page.pause()
           // await patientsearch.selectSexAtBirth(data.pat_sex);
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

            await page.waitForTimeout(5000)
            
            const alert = await page.getByRole('heading', { name: 'Alerts', exact: true }).isVisible()
            if (alert) {
              await TestTool.clickPopup();              
            }

            await contacthistory.selectContactReason("Data Entry");
            await contacthistory.selectContactLocation("Cardio Location");
            await contacthistory.clickOnAddContact();
            await SummaryPage.selectCategoryFromList("Test Tools");
            await page.waitForTimeout(2000);

            //////CHECK FOR ANY EXISTING TEST AND DELETE/////
            await page.waitForTimeout(8000);

            const editButton = await TestTool.editIcon.isVisible();

            if (editButton) {
              await TestTool.clickOnEditIcon();
              await TestTool.clickOnDeleteDevice();
              await TestTool.clickOnOkPopup();
              await TestTool.enterDeleteDeviceReason(jsonData.EditTool[index].pacr_delete_reason);
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

            // Add New Tool Audiogram Tool
            await SummaryPage.selectTestToolItem(jsonData.AddTool[index].clinicItem);
            await SummaryPage.clickOnAddButton()
            await TestTool.clickOnAirConduction()
            await TestTool.selectAirConductionTestingMethods(jsonData.AddTool[index].pattod_var_value_0);
            await TestTool.selectAirConductionTransducerUsed(jsonData.AddTool[index].pattod_var_value_3);
            await TestTool.selectAirConductionStimulusSignalType(jsonData.AddTool[index].pattod_var_value_1)
            await TestTool.enterAirConductionReliability(jsonData.AddTool[index].pattod_var_value_2)
            await TestTool.enterAirConductionNotes(jsonData.AddTool[index].patto_notes_0)
            await TestTool.clickOnBoneConduction()
            await TestTool.selectBoneConductionTestingMethods(jsonData.AddTool[index].pattod_var_value_4)
            await TestTool.selectBoneConductionStimulusSignalType(jsonData.AddTool[index].pattod_var_value_5)
            await TestTool.enterBoneConductionReliability(jsonData.AddTool[index].pattod_var_value_6)
            await TestTool.enterBoneConductionNotes(jsonData.AddTool[index].patto_notes_1);
            await TestTool.clickOnUnaidedSoundField()
            await TestTool.selectUnaidedSoundFieldTestingMethods(jsonData.AddTool[index].pattod_var_value_7)
            await TestTool.selectUnaidedSoundFieldStimulusSignalType(jsonData.AddTool[index].pattod_var_value_8)
            await TestTool.enterUnaidedSoundFieldReliability(jsonData.AddTool[index].pattod_var_value_9)
            await TestTool.enterUnaidedSoundFieldNotes(jsonData.AddTool[index].patto_notes_2);
            await TestTool.clickOnAidedSoundField()
            await TestTool.selectAidedSoundFieldTestingMethods(jsonData.AddTool[index].pattod_var_value_10)
            await TestTool.selectAidedSoundFieldStimulusSignalType(jsonData.AddTool[index].pattod_var_value_11)
            await TestTool.enterAidedSoundFieldReliability(jsonData.AddTool[index].pattod_var_value_12)
            await TestTool.enterAidedSoundFieldNotes(jsonData.AddTool[index].patto_notes_3);
            await TestTool.clickOnSaveBtn();
            await page.waitForTimeout(2000);
            await TestTool.clickOnExtraDetailsView2();
            //await page.pause()

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      
            // var count = 0;

            ///////// Database comparison- Patient Test Records - ADDING NEW TOOL /////////
            sqlQuery = 
            "select patto_tool_pacr_id from patient_tools "+
            "join patient_clinical_records on patto_tool_pacr_id = pacr_id "+
            "where pacr_que_name = '"+ jsonData.AddTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            let pacrId = results[0].patto_tool_pacr_id;
            console.log("Patient tool clinical record: " + pacrId);
            
            sqlQuery =
            "select pattod_id, patto_tool_pacr_id, pacr_que_name, patto_pat_id, patto_notes, pattod_var_name, pattod_var_value, pacr_clinic_date "+
            "from patient_tools "+
            "join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_clinical_records on pacr_id = patto_tool_pacr_id "+
            "where patto_tool_pacr_id = "+pacrId+" and patto_record_status = 'approved' and pattod_record_status = 'approved' "+
            "order by pattod_id asc";

            console.log("Add Tool:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool records stored into the database: \n",
              results
            );

            let mismatchedValues = [];
            var match = 1;
            if(results[0].pacr_que_name !== jsonData.AddTool[index].pacr_que_name) {
              match = 0;
              mismatchedValues.push('pacr_que_name');
            }
            if(results[0].patto_notes!== jsonData.AddTool[index].patto_notes_0) {
              match = 0;
              mismatchedValues.push('patto_notes_0');
            }
            if(results[0].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_0) {
              match = 0;
              mismatchedValues.push('pattod_var_value_0');
            }
            if(results[1].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_1) {
              match = 0;
              mismatchedValues.push('pattod_var_value_1');
            }
            if(results[2].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_2) {
              match = 0;
              mismatchedValues.push('pattod_var_value_2');
            }
            if(results[3].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_3) {
              match = 0;
              mismatchedValues.push('pattod_var_value_3');
            }
            if(results[4].patto_notes!== jsonData.AddTool[index].patto_notes_1) {
              match = 0;
              mismatchedValues.push('patto_notes_1');
            }
            if(results[4].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_4) {
              match = 0;
              mismatchedValues.push('pattod_var_value_4');
            }
            if(results[5].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_5) {
              match = 0;
              mismatchedValues.push('pattod_var_value_5');
            }
            if(results[6].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_6) {
              match = 0;
              mismatchedValues.push('pattod_var_value_6');
            }
            if(results[7].patto_notes!== jsonData.AddTool[index].patto_notes_2) {
              match = 0;
              mismatchedValues.push('patto_notes_2');
            }
            if(results[7].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_7) {
              match = 0;
              mismatchedValues.push('pattod_var_value_7');
            }
            if(results[8].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_8) {
              match = 0;
              mismatchedValues.push('pattod_var_value_8');
            }
            if(results[9].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_9) {
              match = 0;
              mismatchedValues.push('pattod_var_value_9');
            }
            if(results[10].patto_notes!== jsonData.AddTool[index].patto_notes_3) {
              match = 0;
              mismatchedValues.push('patto_notes_3');
            }
            if(results[10].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_10) {
              match = 0;
              mismatchedValues.push('pattod_var_value_10');
            }
            if(results[11].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_11) {
              match = 0;
              mismatchedValues.push('pattod_var_value_11');
            }
            if(results[12].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_12) {
              match = 0;
              mismatchedValues.push('pattod_var_value_12');
            }
            
            if (match == 1) {
              console.log(
                "\n Patient - Add new tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Add new tool: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(2000);
            await SummaryPage.selectCategoryFromList("Devices");
            await page.waitForTimeout(2000);
            await SummaryPage.selectCategoryFromList("Test Tools");
            await page.waitForTimeout(2000);
            await TestTool.clickOnExtraDetailsView2();

            // Edit Tool // Editing currently bugged.
            // Dropdowns hidden as not being populated
            await TestTool.clickOnEditIcon();
            //await TestTool.enterTestDate(jsonData.EditTool[index].pacr_clinic_date)
            //await TestTool.enterReviewDate(jsonData.EditTool[index].patto_review_date);
            //await TestTool.enterLastReviewed(jsonData.EditTool[index].patto_last_reviewed);
            await TestTool.clickOnAirConduction()
            //await TestTool.selectAirConductionTestingMethods(jsonData.EditTool[index].pattod_var_value_0);
            //await TestTool.selectAirConductionTransducerUsed(jsonData.EditTool[index].pattod_var_value_3);
            //await TestTool.selectAirConductionStimulusSignalType(jsonData.EditTool[index].pattod_var_value_1)
            await TestTool.enterAirConductionReliability(jsonData.EditTool[index].pattod_var_value_2)
            await TestTool.enterAirConductionNotes(jsonData.EditTool[index].patto_notes_0)
            await TestTool.clickOnBoneConduction()
            //await TestTool.selectBoneConductionTestingMethods(jsonData.EditTool[index].pattod_var_value_4)
            //await TestTool.selectBoneConductionStimulusSignalType(jsonData.EditTool[index].pattod_var_value_5)
            await TestTool.enterBoneConductionReliability(jsonData.EditTool[index].pattod_var_value_6)
            await TestTool.enterBoneConductionNotes(jsonData.EditTool[index].patto_notes_1);
            await TestTool.clickOnUnaidedSoundField()
            //await TestTool.selectUnaidedSoundFieldTestingMethods(jsonData.EditTool[index].pattod_var_value_7)
            //await TestTool.selectUnaidedSoundFieldStimulusSignalType(jsonData.EditTool[index].pattod_var_value_8)
            await TestTool.enterUnaidedSoundFieldReliability(jsonData.EditTool[index].pattod_var_value_9)
            await TestTool.enterUnaidedSoundFieldNotes(jsonData.EditTool[index].patto_notes_2);
            await TestTool.clickOnAidedSoundField()
            //await TestTool.selectAidedSoundFieldTestingMethods(jsonData.EditTool[index].pattod_var_value_10)
            //await TestTool.selectAidedSoundFieldStimulusSignalType(jsonData.EditTool[index].pattod_var_value_11)
            await TestTool.enterAidedSoundFieldReliability(jsonData.EditTool[index].pattod_var_value_12)
            await TestTool.enterAidedSoundFieldNotes(jsonData.EditTool[index].patto_notes_3);
            await TestTool.clickOnSaveBtn();
            await page.waitForTimeout(2000);
            await TestTool.clickOnExtraDetailsView2();
            await page.waitForTimeout(1000);
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Tool /////////
            sqlQuery = 
            "select patto_tool_pacr_id from patient_tools "+
            "join patient_clinical_records on patto_tool_pacr_id = pacr_id "+
            "where pacr_que_name = '"+ jsonData.EditTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].patto_tool_pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattod_id, patto_tool_pacr_id, pacr_que_name, patto_pat_id, patto_notes, pattod_var_name, pattod_var_value, pacr_clinic_date, patto_review_date, patto_last_reviewed "+
            "from patient_tools "+
            "join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_clinical_records on pacr_id = patto_tool_pacr_id "+
            "where patto_tool_pacr_id = "+pacrId+" and patto_record_status = 'approved' and pattod_record_status = 'approved' "+
            "order by pattod_id asc";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            match = 1;
            mismatchedValues = [];

            if(results[0].pacr_que_name !== jsonData.EditTool[index].pacr_que_name) {
              match = 0;
              mismatchedValues.push('pacr_que_name');
            }
            if(results[0].patto_notes!== jsonData.EditTool[index].patto_notes_0) {
              match = 0;
              mismatchedValues.push('patto_notes_0');
            }
            if(results[0].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_0) {
              match = 0;
              mismatchedValues.push('pattod_var_value_0');
            }
            if(results[1].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_1) {
              match = 0;
              mismatchedValues.push('pattod_var_value_1');
            }
            if(results[2].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_2) {
              match = 0;
              mismatchedValues.push('pattod_var_value_2');
            }
            if(results[3].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_3) {
              match = 0;
              mismatchedValues.push('pattod_var_value_3');
            }
            if(results[4].patto_notes!== jsonData.EditTool[index].patto_notes_1) {
              match = 0;
              mismatchedValues.push('patto_notes_1');
            }
            if(results[4].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_4) {
              match = 0;
              mismatchedValues.push('pattod_var_value_4');
            }
            if(results[5].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_5) {
              match = 0;
              mismatchedValues.push('pattod_var_value_5');
            }
            if(results[6].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_6) {
              match = 0;
              mismatchedValues.push('pattod_var_value_6');
            }
            if(results[7].patto_notes!== jsonData.EditTool[index].patto_notes_2) {
              match = 0;
              mismatchedValues.push('patto_notes_2');
            }
            if(results[7].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_7) {
              match = 0;
              mismatchedValues.push('pattod_var_value_7');
            }
            if(results[8].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_8) {
              match = 0;
              mismatchedValues.push('pattod_var_value_8');
            }
            if(results[9].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_9) {
              match = 0;
              mismatchedValues.push('pattod_var_value_9');
            }
            if(results[10].patto_notes!== jsonData.EditTool[index].patto_notes_3) {
              match = 0;
              mismatchedValues.push('patto_notes_3');
            }
            if(results[10].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_10) {
              match = 0;
              mismatchedValues.push('pattod_var_value_10');
            }
            if(results[11].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_11) {
              match = 0;
              mismatchedValues.push('pattod_var_value_11');
            }
            if(results[12].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_12) {
              match = 0;
              mismatchedValues.push('pattod_var_value_12');
            }
            if (match == 1) {
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files do not match!\n"
              );
            }

            // sqlQuery = 
            // "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, patto_review_date, patto_last_reviewed "+
            // "from patient_tools join patient_tool_details on patto_tool_pacr_id = pattod_pacr_id "+
            // "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            // "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+ 
            // "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' "+
            // "order by 1 asc limit 1;";

            // sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            // results = await executeQuery(sqlQuery, sqlFilePath);
            // console.log(
            //   "\n Patient Test record stored into the database: \n",
            //   results
            // );
            // var match = await compareJsons(
            //   sqlFilePath,
            //   null,
            //   jsonData.EditTool[index]
            // );
            // if (match) {
            //   console.log(
            //     "\n Patient - Edit tool: Parameters from additional fields match!\n"
            //   );
            // } else {
            //   console.log(
            //     "\n Patient - Edit tool: Parameters from additional fields do not match!\n"
            //   );
            // }

            await page.waitForTimeout(5000);

            // Delete Tool
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTool[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Tool /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            index++;
            // Add New Tool DAS 28 Examination Tool
            await SummaryPage.selectTestToolItem(jsonData.AddTool[index].clinicItem);
            await SummaryPage.clickOnAddButton()
            await TestTool.clickOnSwollen1()
            await TestTool.clickOnTender2()
            await TestTool.clickOnSwollen3()
            await TestTool.clickOnTender4()
            await TestTool.clickOnSwollen5()
            await TestTool.clickOnTender1()
            await TestTool.clickOnMarkerButton()
            await TestTool.clickOnSwollen1()
            await TestTool.clickOnFirstMarker()
            await TestTool.enterMarkerNotes(jsonData.AddTool[index].pattom_notes)
            await TestTool.clickOnSaveNotes();
            await TestTool.enterHealthState(jsonData.AddTool[index].pattod_var_value_0);
            await TestTool.enterEsr(jsonData.AddTool[index].pattod_var_value_1);
            await TestTool.enterCrp(jsonData.AddTool[index].pattod_var_value_2);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterDeviceNotes(jsonData.AddTool[index].patto_notes);
            await TestTool.clickOnSaveTool();
            await TestTool.clickOnExtraDetailsView2();
            await page.waitForTimeout(2000);

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      
            // var count = 0;

            ///////// Database comparison- Patient Test Records - ADDING NEW TOOL /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient tool clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, pattom_notes "+
            "from patient_tools join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' "+
            "order by 1 asc";

            console.log("Add Tool:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool records stored into the database: \n",
              results
            );
            mismatchedValues = [];
            var match = 1;
            if(results[0].pacr_que_name !== jsonData.AddTool[index].pacr_que_name) {
              match = 0;
              mismatchedValues.push('pacr_que_name');
            }
            if(results[0].patto_notes!== jsonData.AddTool[index].patto_notes) {
              match = 0;
              mismatchedValues.push('patto_notes');
            }
            if(results[2].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_0) {
              match = 0;
              mismatchedValues.push('pattod_var_value_0');
            }
            if(results[1].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_1) {
              match = 0;
              mismatchedValues.push('pattod_var_value_1');
            }
            if(results[0].pattod_var_value !== jsonData.AddTool[index].pattod_var_value_2) {
              match = 0;
              mismatchedValues.push('pattod_var_value_2');
            }
            if (match == 1) {
              console.log(
                "\n Patient - Add new tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Add new tool: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(4000);
            await SummaryPage.selectCategoryFromList("Devices");
            await page.waitForTimeout(1500);
            await SummaryPage.selectCategoryFromList("Test Tools");
            await TestTool.clickOnExtraDetailsView2();

            // Edit Tool
            //await page.pause();
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTool[index].patto_review_date);
            await TestTool.enterLastReviewed(jsonData.EditTool[index].patto_last_reviewed);
            await TestTool.enterHealthState(jsonData.EditTool[index].pattod_var_value_0);
            await TestTool.enterEsr(jsonData.EditTool[index].pattod_var_value_1);
            await TestTool.enterCrp(jsonData.EditTool[index].pattod_var_value_2);
            await TestTool.enterTender(jsonData.EditTool[index].pattod_var_value_3);
            await TestTool.enterSwollen(jsonData.EditTool[index].pattod_var_value_4);
            await TestTool.clickOnCalculateButton();
            await TestTool.enterDeviceNotes(jsonData.EditTool[index].patto_notes);
            await TestTool.clickOnSaveTool();
            await page.waitForTimeout(1000);
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Tool /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.EditTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, patto_review_date, patto_last_reviewed "+
            "from patient_tools join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' and patto_record_status = 'approved' "+
            "order by 1 asc";

            console.log("Edit Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            match = 1;
            mismatchedValues = [];

            if(results[2].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_0) {
              match = 0;
              mismatchedValues.push('pattod_var_value_0');
            }
            if(results[1].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_1) {
              match = 0;
              mismatchedValues.push('pattod_var_value_1');
            }
            if(results[0].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_2) {
              match = 0;
              mismatchedValues.push('pattod_var_value_2');
            }
            if(results[3].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_3) {
              match = 0;
              mismatchedValues.push('pattod_var_value_3');
            }
            if(results[4].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_4) {
              match = 0;
              mismatchedValues.push('pattod_var_value_4');
            }
            if (match == 1) {
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files do not match!\n"
              );
            }

            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, patto_review_date, patto_last_reviewed "+
            "from patient_tools join patient_tool_details on patto_tool_pacr_id = pattod_pacr_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+ 
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' "+
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
              jsonData.EditTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit tool: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit tool: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Tool
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTool[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Tool /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
            index++;

            // Add New Tool DAS 78 Examination Tool
            await SummaryPage.selectTestToolItem(jsonData.AddTool[index].clinicItem);
            await SummaryPage.clickOnAddButton()
            await TestTool.clickOnCircle1()
            await TestTool.clickOnCircle2()
            await TestTool.clickOnCircle3()
            await TestTool.clickOnCircle4()
            await TestTool.clickOnMarkerButton()
            await TestTool.clickOnCircle1()
            await TestTool.clickOnFirstMarker()
            await page.waitForTimeout(3000);
            await TestTool.enterMarkerNotes(jsonData.AddTool[index].pattom_notes);
            await TestTool.clickOnSaveNotes();
            await TestTool.enterDeviceNotes(jsonData.AddTool[index].patto_notes);
            await TestTool.clickOnSaveTool();

            ////////////////////////// FRONT END COMPARISON OF ENTERED INFORMAION //////////////////////////      
            // var count = 0;

            ///////// Database comparison- Patient Test Records - ADDING NEW TOOL /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.AddTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient tool clinical record: " + pacrId);
            
            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, pattom_notes "+
            "from patient_tools join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' and patto_record_status = 'approved' "+
            "order by 1 asc limit 1";

            console.log("Add Tool:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestTool.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool records stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.AddTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Add tool: Parameters from JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Add tool: Parameters from JSON files do not match!\n"
              );
            }

            await page.waitForTimeout(5000);
            await SummaryPage.selectCategoryFromList("Devices");
            await page.waitForTimeout(1500);
            await SummaryPage.selectCategoryFromList("Test Tools");
            await TestTool.clickOnExtraDetailsView2();

            // Edit Tool
            //await page.pause();
            await TestTool.clickOnEditIcon();
            await TestTool.enterReviewDate(jsonData.EditTool[index].patto_review_date);
            await TestTool.enterLastReviewed(jsonData.EditTool[index].patto_last_reviewed);
            await TestTool.enterTender78(jsonData.EditTool[index].pattod_var_value_0);
            await TestTool.enterSwollen78(jsonData.EditTool[index].pattod_var_value_1);
            await TestTool.enterDeviceNotes(jsonData.EditTool[index].patto_notes);
            await TestTool.clickOnSaveTool();
            await page.waitForTimeout(1000);
            //assert device edited -Device record updated successfully
            //await expect.soft(page.getByText("Device record updated successfully")).toHaveText("Device record updated successfully");

            ///////// Database comparison- Patient Test Records - Editing Tool /////////
            sqlQuery = 
            "select pacr_id from patient_clinical_records "+
            "where pacr_que_name = '"+ jsonData.EditTool[index].pacr_que_name +"' "+
            "order by 1 desc limit 1";

            sqlFilePath = "SQLResults/ClinicalDomain/PatientClinicalRecord.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            pacrId = results[0].pacr_id;
            console.log("Patient test clinical record " + pacrId);
            
            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, patto_review_date, patto_last_reviewed "+
            "from patient_tools join patient_tool_details on patto_id = pattod_patto_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' and patto_record_status = 'approved' "+
            "order by 1 asc";

            console.log("Edit Tool:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolEdit.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Test records stored into the database: \n",
              results
            );
            match = 1;
            mismatchedValues = [];

            if(results[0].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_0) {
              match = 0;
              mismatchedValues.push('pattod_var_value_0');
            }
            if(results[1].pattod_var_value !== jsonData.EditTool[index].pattod_var_value_1) {
              match = 0;
              mismatchedValues.push('pattod_var_value_1');
            }
            if (match == 1) {
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log('\nMismatched values:\n', mismatchedValues);
              console.log(
                "\n Patient - Edit tool: Parameters from both JSON files do not match!\n"
              );
            }

            sqlQuery = 
            "select pattod_pacr_id, pattod_pat_id, pattod_var_name, pattod_var_value, pacr_que_name, patto_notes, patto_review_date, patto_last_reviewed "+
            "from patient_tools join patient_tool_details on patto_tool_pacr_id = pattod_pacr_id "+
            "join patient_tool_markers on pattod_pacr_id = pattom_tool_pacr_id "+
            "join patient_clinical_records on pattom_tool_pacr_id = pacr_id "+ 
            "where pattod_pacr_id = "+pacrId+" and pattod_record_status = 'approved' "+
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
              jsonData.EditTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit tool: Parameters from additional fields match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit tool: Parameters from additional fields do not match!\n"
              );
            }

            await page.waitForTimeout(5000);

            // Delete Tool
            await TestTool.clickOnExtraDetailsView2();
            await TestTool.clickOnEditIcon();
            await TestTool.clickOnDeleteDevice();
            await TestTool.clickOnOkPopup();
            await TestTool.enterDeleteDeviceReason(jsonData.EditTool[index].pacr_delete_reason);
            await TestTool.clickOnSaveDeleteReason();
            //await page.pause()

            //assert device deleted - Device deleted successfully
            //await expect.soft(page.getByText("Device deleted successfully")).toHaveText("Device deleted successfully");

            ///////// Database comparison- Patient Test Records - Delete Tool /////////
            sqlQuery =
            "SELECT pacr_delete_reason, pacr_record_status "+
            "FROM patient_clinical_records "+
            "WHERE pacr_id = " + pacrId +
            " and pacr_record_status = 'wrong'";

            console.log("Delete Test:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientTestToolDelete.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Tool record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditTool[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete tool: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
        }
    });
});