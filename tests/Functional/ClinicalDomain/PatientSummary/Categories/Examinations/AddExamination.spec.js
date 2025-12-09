const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
const connectToDatabase = require("../../../../../../manoj").default;
const { executeQuery } = require("../../../../../../databaseWriteFile"); // Update the path accordingly
import compareJsons from "../../../../../../compareFileOrJson";

import {
  checkAllLocatorVisibility,
  createPageLocatorJSON,
  numberValidator,
  mobileValidator,
  nameValidator,
  alphaNumericValidator,
  emailValidator,
  dateValidator,
  timeValidator,
} from "../../../../../../UtilFiles/DynamicUtility";

import logger from "../../../../../../Pages/BaseClasses/logger";
import LoginPage from "../../../../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../../../../Pages/BaseClasses/Homepage";
import ConfirmExisting from "../../../../../../Pages/PatientDomain/ConfirmExisting";
import ContactHistory from "../../../../../../Pages/ClinicalDomain/PatientSummary/ContactHistory"
import PatientSearch from "../../../../../../Pages/PatientDomain/PatientSearch";
import Environment from "../../../../../../Pages/BaseClasses/Environment";
import Menu from "../../../../../../Pages/BaseClasses/Menu";
import ExaminationHomePage from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Examinations/ExaminationsHomePage";
import ExaminationAddED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Examinations/ExaminationAddED";
import RecommendationHomePage from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Recommendations/RecommendationsHomepage";
import RecommendationED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Recommendations/RecommendationAddED";
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";
import ClinicalSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";

import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Examination Category", () => {
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
});



test.describe("Examination Category", () => {
  test("Add Examination", async ({ page }) => {
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
      const examinationhome = new ExaminationHomePage(page);
      const examinationEd = new ExaminationAddED(page);
      const recommendationhome = new RecommendationHomePage(page);
      const recommendationEd = new RecommendationED(page);
      const patientsummary = new PatientSummary(page);
      const examination = new ClinicalSummary(page);
      const examinationExtraDetails = new ClinicalExtraDetails(page);
      const Recommendations = new ClinicalSummary(page);
      const RecommendationsExtraDetails = new ClinicalExtraDetails(page);

      const menu = new Menu(page);
      
      await page.goto(environment.Test);

      // Set zoom level to 70% using page.evaluate
      // await page.evaluate(() => {
      //   document.body.style.zoom = '70%';
      // });

      
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();
      logger.info("Clicked on Login button successfully");
      await homepage.scrollDivToLastIcon(page);
      await homepage.clickOnHomeDashboardIcon()
       await page.waitForTimeout(2000)
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
      await patientsearch.checkbox_IncludeServicePatient.click();
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();

      let locators = [
        patientsearch.txtbox_MPINumber,
        patientsearch.txtbox_Barcode,
        patientsearch.txtbox_Card,
        patientsearch.txtbox_GivenName,
        patientsearch.txtbox_FamilyName,
        patientsearch.dropdown_sex,
        patientsearch.txtbox_BornDate,
        patientsearch.txtbox_Postcode,
        patientsearch.txtbox_MRNNumber,
        patientsearch.txtbox_IdentificationId,
        patientsearch.txtbox_NHSNo,
        patientsearch.txtbox_HospitalRef,
        patientsearch.txtbox_MobileNumber,
        patientsearch.txtbox_PatNameInOtherLang,
        patientsearch.dropdown_PatientSeenInLastDays,
        patientsearch.checkbox_IncludeDeceasedPatient,
        patientsearch.checkbox_IncludeServicePatient,
        patientsearch.checkbox_Soundex
      ];
      await checkAllLocatorVisibility(locators, expect);
      
      await patientsearch.clickOnSearchPatientLink();
      //await page.waitForTimeout(3000);
      

      await confirmexisting.clickOnConfirmExistingDetails();
      await page.waitForTimeout(6000);
      const alertPopup = page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible({ timeout: 4000 })) {
        const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
        await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
        await cancelButton.click({ force: true });
      }

      // //Add Recommendation      
      //  await patientsummary.clickOniconExaminationsCategory();
      //  await patientsummary.clickOnallCategory()
      //   await recommendationhome.searchRecommendation(jsonData.AddRecommendations[index].pacr_que_name);
      // await page.waitForTimeout(3000);           
      //   //await recommendationhome.searchRecommendation(jsonData.AddRecommendations[index].pacr_que_name);
      //   await recommendationhome.clickonAddRecommendationButton();
      //   // await recommendationEd.clickOnExpandRecommendation();
      //   // await recommendationEd.clickOnExpandRecommendation();
      //   // await recommendationEd.selectSubcategory(jsonData.AddRecommendations[index].pacr_subcategory);
      //   await recommendationEd.enterReviewDate(jsonData.AddRecommendations[index].recom_review_date);
      //   //await recommendationEd.selectCheckboxPrivateRecord();
      //   await recommendationEd.selectCheckboxSetAsDefault();
         
      //   await recommendationEd.enterNotes();
      //   await recommendationEd.clickOnSaveButton();
      //   await page.waitForTimeout(500);
       
      //Add Favourites

      await page.getByRole('button', { name: 'Examinations' }).click();
      await patientsummary.clickOniconExaminationsCategory();
      await page.waitForTimeout(500);
      await examination.clickOnFavouriteQueExam();
      await page.waitForTimeout(500);
      await examination.clickOnFavouritemItemExam()
      
      locators = [
        examinationEd.dropdownOutcome,
        examinationEd.checkboxPrivateRecord,
        examinationEd.checkboxSetasDefault,
        examinationEd.textareaNotes
      ];
        
      await examinationEd.SelectOutcome(jsonData.AddExamination[index].exam_outcome);
      //await examinationEd.SelectRecommendation(jsonData.AddExamination[index].pacr_que_name_recommendation);
      await examinationEd.selectCheckboxes();
      await examinationEd.EnterNotes(jsonData.AddExamination[index].exam_notes);
      
      const filePath = "LocatorJSON";
      let fileName = "LocatorJSON/addExamFavourite.json";
      await createPageLocatorJSON(locators, filePath, fileName);

      let matched = await compareJsons(
        fileName,
        null,
        jsonData.addExamPage[index]
      );
      if (matched) {
        console.log(
          "\n Front end data matches data from excel sheet\n"
        );
      } else {
        console.log(
          "\n Front end data does not match!\n"
        );
      }

      await examinationExtraDetails.clickOnSaveExamFavourites();
      await page.waitForTimeout(500);

      //Delete Favourites
          
      await examinationhome.clickOnEditExaminationButton();     
      await examinationEd.clickOnDeleteButton();
      await examinationEd.clickOnCancelExamination();
      await examinationEd.clickOnDeleteButton();
      await examinationEd.clickOnOkDeleteExamination();

      locators = [
        examinationEd.txtboxDeleteExaminationReason
      ];
      await checkAllLocatorVisibility(locators, expect);

      await examinationEd.enterDeleteExaminationReason(jsonData.DeleteExamination[index].pacr_delete_reason);

      fileName = "LocatorJSON/editExamFavourite.json";
      await createPageLocatorJSON(locators, filePath, fileName);

      matched = await compareJsons(
        fileName,
        null,
        jsonData.editExamPage[index]
      );
      if (matched) {
        console.log(
          "\n Front end data matches data from excel sheet\n"
        );
      } else {
        console.log(
          "\n Front end data does not match!\n"
        );
      }

      await examinationEd.clickOnSaveForReason();
      await page.waitForTimeout(500);
      await expect(page.getByText("Examination deleted successfully ")).toHaveText("Examination deleted successfully ");
        
      //Contact History page
      await patientsummary.clickOniconExaminationsCategory();
      await page.waitForTimeout(5000);
      // Delete Existing item
      if (await examinationhome.checkItemOnHistoryTable(jsonData.AddExamination[index].pacr_que_name)) {
        // await diagnosis.clickOnItemReview(jsonData.AddDiagnosis[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await examinationhome.clickOnEditExaminationButton()
        //await examination.clickOnItemEdit(jsonData.AddExamination[index].pacr_que_name);
        await examinationEd.clickOnDeleteButton();
        await examinationEd.clickOnCancelExamination();
        await examinationEd.clickOnDeleteButton();
        await examinationEd.clickOnOkDeleteExamination();
        await examinationEd.enterDeleteExaminationReason(
          jsonData.DeleteExamination[index].pacr_delete_reason
        );

        await createPageLocatorJSON(locators, filePath, fileName);

        matched = await compareJsons(
          fileName,
          null,
          jsonData.editExamPage[index]
        );
        if (matched) {
          console.log(
            "\n Front end data matches data from excel sheet (f)\n"
          );
        } else {
          console.log(
            "\n Front end data does not match! (f)\n"
          );
        }

        await examinationEd.clickOnSaveForReason();
        //await expect(page.getByText('Diagnosis deleted successfully')).toHaveText('Diagnosis deleted successfully')

        console.log('\x1bItem was deleted successfully\x1b[0m');
      }


      await examinationhome.searchExamination(jsonData.AddExamination[index].pacr_que_name);
      await examinationhome.clickonAddExaminationButton();
      await page.waitForTimeout(1000);
      await page.getByLabel('cancelIcon').click();
      await examinationhome.searchExamination(jsonData.AddExamination[index].pacr_que_name);
      await examinationhome.clickonAddExaminationButton();

      locators = [
        examinationEd.dropdownOutcome,
        examinationEd.checkboxPrivateRecord,
        examinationEd.checkboxSetasDefault,
        examinationEd.textareaNotes
      ];
      await checkAllLocatorVisibility(locators, expect);

      await examinationEd.SelectOutcome(jsonData.AddExamination[index].exam_outcome);
     // await examinationEd.SelectRecommendation(jsonData.AddExamination[index].pacr_que_name_recommendation);
      await examinationEd.selectCheckboxes();
      await examinationEd.EnterNotes(jsonData.AddExamination[index].exam_notes);
      
      fileName = "LocatorJSON/addExaminationPage.json";
      await createPageLocatorJSON(locators, filePath, fileName);

      matched = await compareJsons(
        fileName,
        null,
        jsonData.editExamPage[index]
      );
      if (matched) {
        console.log(
          "\n Front end data matches data from excel sheet\n"
        );
      } else {
        console.log(
          "\n Front end data does not match!\n"
        );
      }

      await examinationEd.clickOnSaveButton();
      await page.waitForTimeout(500);

      //await page.getByTestId('Check All').click()
      //await page.getByLabel('saveChecklist').click()
      //await page.waitForTimeout(1000);
      await expect(page.getByText("Examination record added successfully")).toHaveText("Examination record added successfully");

      //////Fetch Patient Details/////////
      var sqlQuery =
        "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;

      console.log("Patient Accessed by User:" + patId);

      ////// Database comparison- Patient Clinical Records/////////
      //sqlQuery ="select * from patient_clinical_records where pacr_pat_id=" +patId +" and pacr_record_status='approved' and pacr_que_name='"+ jsonData.AddExamination[index].pacr_que_name +"' and pacr_category='examination' order by 1 desc limit 1;";
      sqlQuery =
        "select pacr_id, pacr_category, pacr_que_name, exam_outcome, pacr_clinic_date, exam_notes" +
        " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id" +
        " join examinations on pacr_id=exam_pacr_id where pacr_record_status='approved' and " +
        "pacrd_record_status='approved' and exam_record_status='approved' and pacr_pat_id=" +
        patId +
        " and pacr_record_status='approved' and pacr_que_name='" +
        jsonData.AddExamination[index].pacr_que_name +
        "' and pacr_category='examination' order by 1 desc limit 1";
      //console.log("Query Output:"+sqlQuery);

      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      const pacrId = results[0].pacr_id;

      console.log("\n Patient Clinical Records stored into the database: \n", results);
      var match = await compareJsons(sqlFilePath, null, jsonData.AddExamination[index]);
      if (match) {
        console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
      }

      //////Database comparison- Patient Clinical records Linking/////////
      // sqlQuery =
      //   "select pacr_id from patient_clinical_records where pacr_pat_id=" +
      //   patId +
      //   " and pacr_category='Recommendation' and pacr_record_status='approved' and pacr_que_name='" +
      //   jsonData.AddExamination[index].pacr_que_name_recommendation +
      //   "' order by pacr_id desc limit 1";

      // //console.log("Manoj Vyavahare"+sqlQuery);
      // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicRecordlinking.json";
      // results = await executeQuery(sqlQuery, sqlFilePath);
      // console.log("Waiting for SQL result....");
      // if (results) {
      //   console.log("\n Examination is successfully linked with the Recommendation!\n");
      // } else {
      //   console.log("\n Examination is not linked with the Recommendation!\n");
      // }

      await page.waitForTimeout(10000);

      //Check Examination History section

      await examinationhome.expandExaminationHistory();
      await examinationhome.expandExaminationHistory();
      await examinationhome.clickOnAllLinks();
      await examinationhome.clickOnHistoryIcon();
      await examinationhome.expandsHistoryofExaminationIcon();
      await examinationhome.expandsHistoryofExaminationIcon();
      await examinationhome.closeExaminationHistoryPopup();
      await page.waitForTimeout(2000);
      // await examinationhome.clickOnReviewExaminationButton();
      // await page.waitForTimeout(2000);
      await examinationhome.clickOnHighlightedNoneRisk();
      await page.waitForTimeout(2000);
      await examinationhome.clickOnLowRiskLevel();
      await page.waitForTimeout(2000);
      await examinationhome.clickOnModerateRiskLevel();
      await page.waitForTimeout(2000);
      await examinationhome.clickOnHighRiskLevel();
      await page.waitForTimeout(2000);
      await examinationhome.clickOnAllRiskLevel();
      await page.waitForTimeout(1000);

      await examinationhome.checkExtradetailsLevel();

      //Edit Examination
     
      await examinationhome.clickOnEditExaminationButton();
      //await page.waitForTimeout(2000)
      // await examinationEd.clickOnExpandExamination();
      await page.waitForTimeout(3000)

      locators = [
        examinationEd.dropdownOutcome,
        examinationEd.checkboxPrivateRecord,
        examinationEd.checkboxSetasDefault,
        examinationEd.textareaNotes
      ];
      await checkAllLocatorVisibility(locators, expect);

      //await examinationEd.selectSubCategory(jsonData.AddExamination[index].pacr_subcategory);
      await examinationEd.SelectOutcome(jsonData.EditExamination[index].exam_outcome);
      await examinationEd.EnterNotes(jsonData.EditExamination[index].exam_notes);

      fileName = "LocatorJSON/editExaminationPage.json";
      await createPageLocatorJSON(locators, filePath, fileName);

      matched = await compareJsons(
        fileName,
        null,
        jsonData.editExamPage[index]
      );
      if (matched) {
        console.log(
          "\n Front end data matches data from excel sheet\n"
        );
      } else {
        console.log(
          "\n Front end data does not match!\n"
        );
      }
      
      await examinationEd.clickOnSaveButton();
      await page.waitForTimeout(500);
      //await page.getByTestId('Check All').click()
      //await page.getByLabel('saveChecklist').click()
      await page.waitForTimeout(500);
      await expect(page.getByText("Examination record updated successfully")).toHaveText("Examination record updated successfully");

      ////// Database comparison- Patient Clinical Records/////////
      sqlQuery =
        "select * from patient_clinical_records where pacr_id=" +
        pacrId +
        " and pacr_record_status='approved'";
      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      // pacrId=results[0].pacr_id;
      console.log("\n Patient Details stored into the database: \n", results);
      var match = await compareJsons(sqlFilePath, null, jsonData.EditExamination[index]);
      if (match) {
        console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
      }

      //////Database comparison- Examination table/////////
      sqlQuery =
        "select * from examinations where exam_pacr_id=" +
        pacrId +
        " and exam_record_status='approved';";
      sqlFilePath = "SQLResults/ClinicalDomain/patientExamination.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      var match = await compareJsons(sqlFilePath, null, jsonData.EditExamination[index]);
      if (match) {
        console.log("\n Examination table Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Examination table Comparision: Parameters from both JSON files do not match!\n");
      }

      //////Database comparison- Patient Clinical records Details table/////////
      sqlQuery =
        "select pacrd_subcategory_eli_code from patient_clinical_records_details where pacrd_pacr_id=" +
        pacrId +
        "";
      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicRecordDetails.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Clinical records Details stored into the database: \n", results);
      var match = await compareJsons(sqlFilePath, null, jsonData.DeleteExamination[index]);
      if (match) {
        console.log("\n Patient Clinical records Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Clinical records Details Comparision: Parameters from both JSON files do not match!\n");
      }

      console.log("Waiting for SQL result....");
      await page.waitForTimeout(10000);

      //Delete Examination      
      await examinationhome.clickOnEditExaminationButton();     
      await examinationEd.clickOnDeleteButton();
      await examinationEd.clickOnCancelExamination();
      await examinationEd.clickOnDeleteButton();
      await examinationEd.clickOnOkDeleteExamination();

      locators = [
        examinationEd.txtboxDeleteExaminationReason
      ];
      await checkAllLocatorVisibility(locators, expect);

      await examinationEd.enterDeleteExaminationReason(jsonData.DeleteExamination[index].pacr_delete_reason);

      fileName = "LocatorJSON/editExaminationPage.json";
      await createPageLocatorJSON(locators, filePath, fileName);

      matched = await compareJsons(
        fileName,
        null,
        jsonData.toolEditPage[index]
      );
      if (matched) {
        console.log(
          "\n Front end data matches data from excel sheet\n"
        );
      } else {
        console.log(
          "\n Front end data does not match!\n"
        );
      }
      
      await examinationEd.clickOnSaveForReason();
      await page.waitForTimeout(500);
      await expect(page.getByText("Examination deleted successfully ")).toHaveText("Examination deleted successfully ");


      //Delete Recommendation
      
      // await patientsummary.clickOniconExaminationsCategory();
      //  await patientsummary.clickOnallCategory()
      // await recommendationhome.searchRecommendation(jsonData.AddRecommendations[index].pacr_que_name);

      // await Recommendations.clickOnItemEdit();
      // await RecommendationsExtraDetails.clickOnDelete();
      // await RecommendationsExtraDetails.clickOnCancelDelete();
      // await RecommendationsExtraDetails.clickOnDelete();
      // await RecommendationsExtraDetails.clickOnConfirmDelete();
      // await RecommendationsExtraDetails.enterDeleteReason(jsonData.DeleteRecommendations[index].pacr_delete_reason);
      // await RecommendationsExtraDetails.clickOnSaveDeleteReason();
      ////// Database comparison- Patient Clinical Records/////////
      sqlQuery =
        "select * from patient_clinical_records where pacr_id=" +
        pacrId +
        " and pacr_record_status='wrong'";
      console.log("Manoj" + sqlQuery);
      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      //  pacrId=results[0].pacr_id;
      console.log("\n Patient Details stored into the database: \n", results);
      var match = await compareJsons(
        sqlFilePath,
        null,
        jsonData.EditExamination[index]
      );
      if (match) {
        console.log(
          "\n  Patient Clinical Records Comparision: Parameters from both JSON files match!\n"
        );
      } else {
        console.log(
          "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
        );
      }

     
    }


  });
});
