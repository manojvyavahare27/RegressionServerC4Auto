import { test, expect } from "@playwright/test";

const convertExcelToJson = require("../../../config/global-setupOptimized");
const { executeQuery } = require("../../../databaseWriteFile");
import compareJsons from "../../../compareFileOrJson";

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
} from "../../../UtilFiles/DynamicUtility";

import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import Environment from "../../../Pages/BaseClasses/Environment";
import Menu from "../../../Pages/BaseClasses/Menu";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";
import ClinicalSummary from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";
import ContactHistory from "../../../Pages/ClinicalDomain/PatientSummary/ContactHistory";
import TopBlueBar from "../../../Pages/BaseClasses/TopBlueBar";
import AddReferral from "../../../Pages/PatientDomain/AddReferral";
import ServiceReferrals from "../../../Pages/ReferralDomain/ServiceReferrals";

const consoleLogs = [];
let jsonData;

test.describe("Database Comparison Document Domain", () => {
  test("Extract Document Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/DocumentDomain.xlsx";
    const jsonFilePath =
      "./TestDataWithJSON/DocumentDomain/DocumentDetails.json";
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );

    if (conversionSuccess) {
      jsonData = require("../../../TestDataWithJSON//DocumentDomain/DocumentDetails.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });

  test("Document Domain", async ({ page }) => {
    const loginpage = new LoginPage(page);
    const homepage = new Homepage(page);
    const environment = new Environment(page);
    const patientsearch = new PatientSearch(page);
    const confirmexisting = new ConfirmExisting(page);
    const documents = new ClinicalSummary(page);
    const documentsExtraDetails = new ClinicalExtraDetails(page);
    const contacthistory = new ContactHistory(page);
    const menu = new Menu(page);
    const topbluebar = new TopBlueBar(page);
    const addreferral = new AddReferral(page);
    const servicereferrals = new ServiceReferrals(page);

    let index = 0;

    await page.goto(environment.Test);
    await page.waitForTimeout(1500);
    await loginpage.enterUsername(jsonData.loginDetails[0].username);
    await page.waitForTimeout(1500);
    await loginpage.enter_Password(jsonData.loginDetails[0].password);
    await page.waitForTimeout(1500);
    await loginpage.clickOnLogin();
    await homepage.clickOnSideIconPatient();
    await page.waitForTimeout(3000);

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
      patientsearch.checkbox_Soundex,
    ];
    await checkAllLocatorVisibility(locators, expect);

    await numberValidator(patientsearch.txtbox_Barcode, expect);
    await alphaNumericValidator(patientsearch.txtbox_Card, expect); //What validator to use here?
    await numberValidator(patientsearch.txtbox_NHSNo, expect);
    await numberValidator(patientsearch.txtbox_HospitalRef, expect);
    await nameValidator(patientsearch.txtbox_GivenName, expect);
    await nameValidator(patientsearch.txtbox_FamilyName, expect);
    await mobileValidator(patientsearch.txtbox_MobileNumber, expect);
    await alphaNumericValidator(patientsearch.txtbox_Postcode, expect);
    await alphaNumericValidator(patientsearch.txtbox_MRNNumber, expect); //?
    await alphaNumericValidator(patientsearch.txtbox_IdentificationId, expect); //?
    await nameValidator(patientsearch.txtbox_PatNameInOtherLang, expect);

    await patientsearch.enterBarcode(jsonData.findPatientPage[index].barcode);
    await patientsearch.clickOnSearchButton();

    let filePath = "LocatorJSON";
    let fileName = "LocatorJSON/findPatientPage.json";
    await createPageLocatorJSON(locators, filePath, fileName);

    let matched = await compareJsons(
      fileName,
      null,
      jsonData.findPatientPage[index]
    );
    if (matched) {
      console.log("\n Front end data matches data from excel sheet\n");
    } else {
      console.log("\n Front end data does not match!\n");
    }

    await patientsearch.clickOnSearchPatientLink();
    await page.waitForTimeout(3000);
    await confirmexisting.clickOnConfirmExistingDetails();

    await page.waitForTimeout(5000);
    const alertPopup = await page
      .locator("xpath=//h2[text()='Alerts']")
      .isVisible();
    if (alertPopup == true) {
      await documents.closePopUp();
    }
    await page.waitForTimeout(2000);

    await contacthistory.selectContactReason("Assessments");
    await contacthistory.selectContactLocation("Cardio Location");
    await contacthistory.clickOnAddContact();
    await documents.selectCategoryFromList("Documents");

    ////////REVIEW EXISTING ITEM AND DELETE/////
    let existingDocument = page.getByRole("cell", { name: "dummy" });

    try {
      await existingDocument.waitFor({ state: "visible", timeout: 8000 });
    } catch (error) {
      // If the locator is not visible, log failure
      console.log(`Error: Document is NOT visible. Error: ${error.message}`);
    }

    if (await existingDocument.isVisible()) {
      await documents.clickOnEditIcon();
      await documentsExtraDetails.clickOnDelete();
      await documentsExtraDetails.clickOnConfirmDelete();
      await documentsExtraDetails.enterDeleteReason("Deleted Existing item");
      await documentsExtraDetails.clickOnSaveDeleteReason();
      console.log("\x1bItem was deleted successfully\x1b[0m");
    }
    await page.waitForTimeout(2000);

    await documents.clickOnAddDocumentBtn();

    locators = [
      documents.dropdownDocumentCategory,
      documents.dropdownDocumentSubCategory,
      documents.dropdownSpecialty,
      documents.txtboxFrom,
      documents.txtboxTo,
      documents.txtboxSentDate,
      documents.txtboxReceivedDate,
      documents.txtboxDateOfUpload,
      documents.checkboxPrivate,
      documents.checkboxShareOnPortal,
      documents.checkboxShareWithPIP,
      documents.txtboxDescription,
      documents.txtboxDisplayName,
    ];

    await checkAllLocatorVisibility(locators, expect);

    // documents.txtboxFrom,
    // documents.txtboxTo,
    // documents.txtboxSentDate,
    // documents.txtboxReceivedDate,
    // documents.txtboxDateOfUpload,
    // documents.txtboxDescription,
    // documents.txtboxDisplayName,

    await documents.selectDocumentCategory(
      jsonData.addDocument[index].doc_category
    );
    await documents.selectDocumentSubCategory(
      jsonData.addDocument[index].doc_subcategory_eli_text
    );
    await documents.selectSpecialty(jsonData.addDocument[index].specialty);
    await documents.enterFrom(jsonData.addDocument[index].doc_from);
    await documents.enterTo(jsonData.addDocument[index].doc_to);
    await documents.enterSentDate(jsonData.addDocument[index].doc_sent);
    await documents.enterReceivedDate(jsonData.addDocument[index].doc_received);
    await documents.enterDateOfUpload(
      jsonData.addDocument[index].doc_uploaded_date
    );
    await documents.enterDescription(
      jsonData.addDocument[index].doc_description
    );
    await documents.clickOnChooseBtn();
    let fileInput = page.locator("xpath=//input[@type='file']");
    filePath = "../RegressionServerC4Auto/UploadDocuments/dummy.pdf";
    await fileInput.setInputFiles(filePath, fileInput);
    await documents.clickOnUploadBtn();
    // await page.getByLabel("expandRowIcon").click();
    // await page.getByLabel("expandRowIcon").click();
    await documents.clickOnEditIcon();
    await documents.enterDescription(
      jsonData.editDocument[index].doc_description
    );

    fileName = "LocatorJSON/addDocumentPage.json";
    await createPageLocatorJSON(locators, filePath, fileName);

    matched = await compareJsons(
      fileName,
      null,
      jsonData.addDocumentPage[index]
    );
    if (matched) {
      console.log("\n Front end data matches data from excel sheet\n");
    } else {
      console.log("\n Front end data does not match!\n");
    }

    await documents.clickOnSaveBtn();

    // DATABASE CHECK EDIT
    var sqlFilePath = "SQLResults/DocumentDomain/DocumentData.json";
    var sqlQuery =
      "select * from document_management where doc_pat_id = '" +
      jsonData.editDocument[index].doc_pat_id +
      "' order by 1 desc limit 1";
    console.log(sqlQuery);
    var results = await executeQuery(sqlQuery, sqlFilePath);

    var match = await compareJsons(
      sqlFilePath,
      null,
      jsonData.editDocument[index]
    );
    if (match) {
      console.log("\n Edit Document: Parameters from both JSON files match!\n");
    } else {
      console.log(
        "\n Edit Document: Parameters from both JSON files do not match!\n"
      );
    }

    // await page.getByLabel("expandRowIcon").click();
    await documents.clickOnEditIcon();
    await documentsExtraDetails.clickOnDelete();
    await documentsExtraDetails.clickOnConfirmDelete();
    await documentsExtraDetails.enterDeleteReason(
      jsonData.deleteDocument[index].doc_delete_reason
    );
    await documentsExtraDetails.clickOnSaveDeleteReason();

    // DATABASE CHECK DELETE
    var sqlFilePath = "SQLResults/DocumentDomain/DocumentData.json";
    sqlQuery =
      "select * from document_management where doc_pat_id = '" +
      jsonData.deleteDocument[index].doc_pat_id +
      "' order by 1 desc limit 1";
    console.log(sqlQuery);
    results = await executeQuery(sqlQuery, sqlFilePath);

    var match = await compareJsons(
      sqlFilePath,
      null,
      jsonData.deleteDocument[index]
    );
    if (match) {
      console.log(
        "\n Add Referral Documents: Parameters from both JSON files match!\n"
      );
    } else {
      console.log(
        "\n Add Referral Documents: Parameters from both JSON files do not match!\n"
      );
    }

  });
});
