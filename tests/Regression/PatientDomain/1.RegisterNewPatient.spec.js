//Added by Manoj Vyavahare

const fs = require("fs");
const XLSX = require("xlsx");
//const path = "D:/Riomed/Cellma4Automation";
const path = require('path');
const mysql = require("mysql2");
const convertExcelToJson = require('../../../config/global-setupOptimized');

const { test, expect, chromium } = require("@playwright/test");
const connectToDatabase = require("../../../manoj");
const { executeQuery } = require("../../../databaseWriteFile"); // Update the path accordingly
import compareJsons from "../../../compareFileOrJson"; // Update the path accordingly

import logger from "../../../Pages/BaseClasses/logger";
import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import PatientDetails from "../../../Pages/PatientDomain/PatientDetails";
import Environment from "../../../Pages/BaseClasses/Environment";
import Menu from "../../../Pages/BaseClasses/Menu";
import PatientWizard from "../../../Pages/PatientDomain/PatientWizard";
import PatientDuplicateCheck from "../../../Pages/PatientDomain/PatientDuplicateCheck";
import AddPatient from "../../../Pages/PatientDomain/AddPatient";
import AddAddress from "../../../Pages/PatientDomain/AddAddress";
import AddPIP from "../../../Pages/PatientDomain/AddPIP";
import ViewPIP from "../../../Pages/PatientDomain/ViewPIP";
import AddGP from "../../../Pages/PatientDomain/AddGP";
import PrintIDCard from "../../../Pages/PatientDomain/PrintIDCard";
import { TIMEOUT } from "dns";
import { error, log } from "console";
import { before } from "node:test";

const logindata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/Login.json")));
const patientdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/PatientDetails.json")));
const pipdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/PIPDetails.json")));
const gpdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/NewGPDetails.json")));
//const jsonData = JSON.parse(JSON.stringify(require("../../../TestDataWithJSON/ExcelToJSON.json")))

// // Array to store console logs
const consoleLogs = [];
let jsonData;

test.describe('Excel Conversion', () => {
  test('Extract Patient Details', async ({ }) => {
    const excelFilePath = process.env.EXCEL_FILE_PATH || './ExcelFiles/PatientDomain.xlsx';
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientDetails.json";
    const conversionSuccess = await convertExcelToJson(excelFilePath, jsonFilePath);

    if (conversionSuccess) {
      jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      console.log('Excel file has been converted successfully!');
      console.log('jsonData:', jsonData); // Log the loaded JSON data
      console.log('excelFilePath after conversion:', excelFilePath);
      console.log('jsonFilePath after conversion:', jsonFilePath);
    } else {
      throw new Error('Excel to JSON conversion failed.');
    }
  });
})

// Proceed with the test loop after Excel to JSON conversion
test.describe('New Patient', () => {
  test('Register New Patient', async ({ page }) => {
    if (!jsonData || !jsonData.addPatient) {
      throw new Error('JSON data is missing or invalid.');
    }
    let index = 0
    for (const data of jsonData.addPatient) {
      //	try {
      const loginpage = new LoginPage(page);
      const homepage = new Homepage(page);
      const environment = new Environment(page);
      const patientsearch = new PatientSearch(page);
      const patientduplicatecheck = new PatientDuplicateCheck(page);
      const addpatient = new AddPatient(page);
      const addaddress = new AddAddress(page);
      const addpip = new AddPIP(page);
      const viewpip = new ViewPIP(page);
      const addgp = new AddGP(page);
      const printidcard = new PrintIDCard(page);
      //const patientwizard=new PatientWizard(page)
      const menu = new Menu(page);

      await page.goto(environment.Test);
      await page.waitForTimeout(2000);
     //await expect(page.locator('text=Please Login Here')).toBeVisible();

     
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      await page.waitForTimeout(2000);
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      await page.waitForTimeout(2000);
      await loginpage.clickOnLogin();
      logger.info("Clicked on Login button successfully");
     
      await homepage.clickonSidebarHomeIcon()
      await homepage.clickOnPatientIcon();


      await page.pause()


        // ===========================
      // Field Visibility
      // ===========================
      await expect(patientsearch.field_MPI).toBeVisible();
      await expect(patientsearch.field_Barcode).toBeVisible();
      await expect(patientsearch.field_Card).toBeVisible();
      await expect(patientsearch.field_GivenName).toBeVisible();
      await expect(patientsearch.field_FamilyName).toBeVisible();
      await expect(patientsearch.field_SexAtBirth).toBeVisible();
      await expect(patientsearch.field_Born).toBeVisible();
      await expect(patientsearch.field_Postcode).toBeVisible();
      await expect(patientsearch.field_MRNNumber).toBeVisible();
      await expect(patientsearch.field_IdentificationId).toBeVisible();
      await expect(patientsearch.field_NHSNo).toBeVisible();
      await expect(patientsearch.field_HospitalRef).toBeVisible();
      await expect(patientsearch.field_Mobile).toBeVisible();
      await expect(patientsearch.field_PatientNameInOtherLanguage).toBeVisible();
      await expect(patientsearch.field_PatientSeenInLastDays).toBeVisible();

      // ===========================
      // Field Validation: MPI Number
      // ===========================
      await patientsearch.enterMPI('1234567890');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterMPI('ABC#123');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Invalid MPI Number')).toBeVisible();  // Error for invalid input

      // ===========================
      // Field Validation: Barcode
      // ===========================
      await patientsearch.enterBarcode('123456');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterBarcode('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Barcode is required')).toBeVisible();  // Error for empty input

      // ===========================
      // Field Validation: Given Name
      // ===========================
      await patientsearch.enterGivenName('John');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterGivenName('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Given Name is required')).toBeVisible();  // Error for empty input

      // ===========================
      // Field Validation: Family Name
      // ===========================
      await patientsearch.enterFamilyName('Doe');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterFamilyName('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Family Name is required')).toBeVisible();  // Error for empty input

      // ===========================
      // Field Validation: Sex at Birth
      // ===========================
      await patientsearch.selectSex('Male');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid selection

      await patientsearch.selectSex('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Sex at Birth is required')).toBeVisible();  // Error for empty selection

      // ===========================
      // Field Validation: Born Date (Date Picker)
      // ===========================
      await patientsearch.selectBornDate('01/01/1990');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.selectBornDate('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Born Date is required')).toBeVisible();  // Error for empty date picker

      // ===========================
      // Field Validation: Postcode
      // ===========================
      await patientsearch.enterPostcode('12345');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterPostcode('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Postcode is required')).toBeVisible();  // Error for empty postcode

      // ===========================
      // Field Validation: MRN Number
      // ===========================
      await patientsearch.enterMRNNumber('MRN123');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterMRNNumber('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('MRN Number is required')).toBeVisible();  // Error for empty MRN

      // ===========================
      // Field Validation: Identification Id
      // ===========================
      await patientsearch.enterIdentificationId('ID123456');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterIdentificationId('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Identification Id is required')).toBeVisible();  // Error for empty Identification Id

      // ===========================
      // Field Validation: NHS No
      // ===========================
      await patientsearch.enterNHSNo('NHS12345');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterNHSNo('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('NHS No is required')).toBeVisible();  // Error for empty NHS No

      // ===========================
      // Field Validation: Hospital Ref
      // ===========================
      await patientsearch.enterHospitalRef('REF123');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterHospitalRef('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Hospital Ref is required')).toBeVisible();  // Error for empty Hospital Ref

      // ===========================
      // Field Validation: Mobile
      // ===========================
      await patientsearch.enterMobile('1234567890');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterMobile('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Mobile is required')).toBeVisible();  // Error for empty Mobile number

      // ===========================
      // Field Validation: Patient Name in Other Language
      // ===========================
      await patientsearch.enterPatientNameInOtherLanguage('患者');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid input

      await patientsearch.enterPatientNameInOtherLanguage('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Patient name in other language is required')).toBeVisible();  // Error for empty input

      // ===========================
      // Field Validation: Patient Seen in Last (Days)
      // ===========================
      await patientsearch.selectPatientSeenInLastDays('30');
      await patientsearch.clickOnSearchButton();
      await expect(page.locator('.error-message')).not.toBeVisible();  // No error for valid selection

      await patientsearch.selectPatientSeenInLastDays('');
      await patientsearch.clickOnSearchButton();
      await expect(page.getByText('Patient seen in last days is required')).toBeVisible();

//Regression for Patient search page
      //Check all links
      // await patientsearch.clickOnAppointmentLink()
      // await patientsearch.assertPageTitleAfterClick(patientsearch.link_AppointmentLink, "Service Appointments");

      //Check all fields

//       await page.pause()
//       await patientsearch.validateMPIField(page, {
//     shouldBeEnabled: true,
//     defaultValue: '',
//     validInput: '1234567890',
//     invalidInput: 'ABC#123',
//     errorSelector: '.error-message',
//     errorText: 'Invalid MPI Number',
//     submitSelector: 'button:has-text("Save")'
// });
      





      // await patientsearch.assertFieldIsVisible(patientsearch.field_AppointmentDate);
      // await patientsearch.assertFieldIsVisible(patientsearch.field_AppointmentTime);
      // await patientsearch.assertFieldIsVisible(patientsearch.field_AppointmentType);
      // await patientsearch.assertFieldIsVisible(patientsearch.field_AppointmentStatus);

      // await page.pause()
      


      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
await expect(page.getByText("At least one search field should be set for a search.")).toHaveText("At least one search field should be set for a search.");
      

      await patientsearch.enterGivenName(data.pat_firstname);
      //await patientsearch.enterGivenName("EonFVBY");
      logger.info("Given Name entered successfully");
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      await patientsearch.selectSex(data.pat_sex);
      logger.info("Sex selected successfully");
      await patientsearch.selectBornDate(jsonData.addPatient[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      logger.info("Born Date selected successfully");
      
      await patientsearch.clickOnSearchButton();

      logger.info("Clicked on Search button successfully");
     await page.waitForTimeout(1000)
      //await expect(page.getByText("No patient found")).toHaveText("No patient found");   
    //  logger.info("No Patient Found text is visible");  

      await patientsearch.clickOnAddPatientbutton();
      logger.info("Clicked on Add Patient button successfully");
      await patientduplicatecheck.clickOnDuplicateCheckButton();
      logger.info("Clicked on Duplicate Check button successfully");
      await expect(page.getByText("Photo Identification required")).toHaveText("Photo Identification required");
      await expect(page.getByText("Photo Identification ID required")).toHaveText("Photo Identification ID required");
      await expect(page.getByText("Middle name(s) is required")).toHaveText("Middle name(s) is required");
      
      await patientduplicatecheck.selectUniqueIdentification(); 
      logger.info("Selected Unique Identification successfully");     
      await patientduplicatecheck.selectPhotoIdentification();
      logger.info("Selected Photo Identification successfully");
      await patientduplicatecheck.enterPhotoIdentification(jsonData.patientIdentifier[index].pid_value2.toString());
      logger.info("Photo Identification entered successfully");
      await patientduplicatecheck.selectIssuingCountry(jsonData.patientIdentifier[index].pat_country);
      logger.info("Issuing Country selected successfully");
      await patientduplicatecheck.selectTitle(jsonData.patientIdentifier[index].pat_title);
      logger.info("Title selected successfully");
      await patientduplicatecheck.enterMiddleName(jsonData.patientIdentifier[index].pat_middlename);
      logger.info("Middle Name entered successfully");
      await patientduplicatecheck.enterMaidenName(patientdetailsdata.MaidenName);
      logger.info("Maiden Name entered successfully");

      //Is baby born in hospital
      const dateValue = await page.$eval("#Born", (textbox) => textbox.value);
      const selectedDate = new Date(dateValue);
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const currentDate = new Date();      
      const currentDateOnly = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const differenceInMs = currentDateOnly - selectedDateOnly;
      const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
      console.log(differenceInDays);
     
      // Check if the difference is less than 5 days
      if (differenceInDays < 5) {
        
      } else {
        console.log("Date is not less than 5 days from current date");
      }
      await patientduplicatecheck.enterMobileNumber(jsonData.patientIdentifier[index].pid_value1.toString());   
      logger.info("Mobile Number entered successfully");   
      await patientduplicatecheck.enterEmailId(jsonData.patientIdentifier[index].add_email);
      logger.info("Email ID entered successfully");
      
      await patientduplicatecheck.clickOnDuplicateCheckButton();
      logger.info("Clicked on Duplicate Check button successfully");
      //await expect(page.getByText('Duplicate Patients not found')).toHaveText('Duplicate Patients not found')
      await patientduplicatecheck.clickOnCreatePatientButton();
      logger.info("Clicked on Create Patient button successfully");

      //Patient Wizard- Add Patient
      await addpatient.selectMaritalStatusDropdown(jsonData.addPatient[index].pat_marital_status);
      logger.info("Marital Status selected successfully");
      await addpatient.selectSexualOrientation(jsonData.addPatient[index].pat_sexual_orientation_eli_text);
      logger.info("Sexual Orientation selected successfully");
      await addpatient.selectEthnicity(jsonData.addPatient[index].pat_ethnicity_text);
      logger.info("Ethnicity selected successfully");
      await addpatient.selectOccupation(jsonData.addPatient[index].pat_occupation);
      logger.info("Occupation selected successfully");
      await addpatient.SelectReligion(jsonData.addPatient[index].pat_religion);
      logger.info("Religion selected successfully");
      await addpatient.enterTownOfBirth(jsonData.addPatient[index].pat_town_of_birth);
      logger.info("Town of Birth entered successfully");
      await addpatient.enterCountyOfBirth(jsonData.addPatient[index].pat_county_of_birth);
      logger.info("County of Birth entered successfully");
      await addpatient.selectCountryOfBirth(jsonData.addPatient[index].pat_country_of_birth);
      logger.info("Country of Birth selected successfully");
      
      await addpatient.selectNationality(jsonData.addPatient[index].pat_nationality);
      logger.info("Nationality selected successfully");
      await addpatient.selectRegDisable(jsonData.addPatient[index].pat_registered_disabled_yes);
     logger.info("Registered Disabled selected successfully");
      await addpatient.enterDisablityNotes(jsonData.addPatient[index].pat_disability_note);
      logger.info("Disability Notes entered successfully");
      await addpatient.selectLanguage(jsonData.addPatient[index].pat_language);   
      logger.info("Language selected successfully");   
      
      

      await addpatient.selectPatientType(jsonData.addPatient[index].pat_type);
logger.info("Patient type selected successfully");

await addpatient.selectPrisoner(jsonData.addPatient[index].pat_prisoner_yes);
logger.info("Prisoner option selected successfully");

await addpatient.selectBloodType(jsonData.addPatient[index].pat_blood_group);
logger.info("Blood type selected successfully");

await addpatient.selectRestrictedRegistration();
logger.info("Restricted registration selected successfully");

await addpatient.selectPatientWebRegistration();
logger.info("Patient web registration selected successfully");

await addpatient.enterNotes(jsonData.addPatient[index].pat_notes);
logger.info("Notes entered successfully");

await addpatient.clickOnNextButton();
logger.info("Next button clicked successfully");
      
      //Add Address page
     await addaddress.clickOnSaveButton();
logger.info("Save button clicked successfully");

await addaddress.enterNumberAndRoad(jsonData.permanentAddress[index].add_address1);
logger.info("Number and Road entered successfully");

await addaddress.enterTownInAddress(jsonData.permanentAddress[index].add_address3);
logger.info("Town entered successfully");

await addaddress.enterDestrict(jsonData.permanentAddress[index].add_address2);
logger.info("District entered successfully");

await addaddress.enterCounty(jsonData.permanentAddress[index].add_address4);
logger.info("County entered successfully");

await addaddress.enterPostCode(jsonData.permanentAddress[index].add_address5.toString());
logger.info("Post code entered successfully");

      await page.locator('#mui-component-select-country').click();
      await page.getByRole('option', { name: 'Algeria' }).click();
      await page.getByTestId('Add/View Notes').first().click();
      await addaddress.clickOnSaveButtonOnPopup();
logger.info("Save button on popup clicked successfully");
      //Permanent Address
      await addaddress.enterPermISOCountryCode(jsonData.permanentAddress[index].add_iso_country_code.toString());
logger.info("Permanent ISO country code entered successfully");

await addaddress.enterPermICAOCode(jsonData.permanentAddress[index].add_icao_country_code.toString());
logger.info("Permanent ICAO country code entered successfully");

await addaddress.enterPremPhone(jsonData.permanentAddress[index].add_phone.toString());
logger.info("Permanent phone number entered successfully");

await addaddress.enterPermEmail(jsonData.permanentAddress[index].add_email);
logger.info("Permanent email entered successfully");

await addaddress.enterPerMobileNumber(jsonData.permanentAddress[index].add_mobile.toString());
logger.info("Permanent mobile number entered successfully");

await addaddress.enterPermWorkPhone(jsonData.permanentAddress[index].add_work_phone.toString());
logger.info("Permanent work phone entered successfully");

await addaddress.enterPermFax(jsonData.permanentAddress[index].add_fax.toString());
logger.info("Permanent fax entered successfully");

await addaddress.selectPermHealthRegion();
logger.info("Permanent health region selected successfully");

await addaddress.selectPermLocationZone();
logger.info("Permanent location zone selected successfully");


      await page.getByTestId('Add/View Notes').first().click();
      // await addaddress.clickOnPermAddressAddViewBnt();

      await addaddress.enterPermAddresNotes(jsonData.permanentAddress[index].add_notes);

      //Temporary Address
      await page.waitForTimeout(1000)
      await addaddress.enterTempNumberandRoad(jsonData.tempAddress[index].add_address1);
logger.info("Temporary number and road entered successfully");

await addaddress.enterTempTown(jsonData.tempAddress[index].add_address3);
logger.info("Temporary town entered successfully");

await addaddress.enterTempDistrict(jsonData.tempAddress[index].add_address2);
logger.info("Temporary district entered successfully");

await addaddress.enterTempCounty(jsonData.tempAddress[index].add_address4);
logger.info("Temporary county entered successfully");

await addaddress.enterTempPostcode(jsonData.tempAddress[index].add_address5.toString());
logger.info("Temporary postcode entered successfully");

      //await addaddress.clickOnFindPostCode2();

      await page.getByTestId('Add/View Notes').nth(1).click();


      // await addaddress.enterCountryonPopup(jsonData.permanentAddress[index].add_address6.toString());
      await addaddress.clickOnSaveButtonOnPopup();
logger.info("Save button on popup clicked successfully");

await addaddress.enterTempISOCountryCode(jsonData.tempAddress[index].add_iso_country_code.toString());
logger.info("Temporary ISO country code entered successfully");

await addaddress.enterTempICAOCountryCode(jsonData.tempAddress[index].add_icao_country_code.toString());
logger.info("Temporary ICAO country code entered successfully");

await addaddress.enterTempPhone(jsonData.tempAddress[index].add_phone.toString());
logger.info("Temporary phone entered successfully");

await addaddress.enterTempEmail(jsonData.tempAddress[index].add_email);
logger.info("Temporary email entered successfully");

await addaddress.enterTempMobileNumber(jsonData.tempAddress[index].add_mobile.toString());
logger.info("Temporary mobile number entered successfully");

await addaddress.enterTempWorkPhone(jsonData.tempAddress[index].add_work_phone.toString());
logger.info("Temporary work phone entered successfully");

await addaddress.enterTempFax(jsonData.tempAddress[index].add_fax.toString());
logger.info("Temporary fax entered successfully");

await addaddress.selectTempHealthRegion();
logger.info("Temporary health region selected successfully");

await addaddress.selectTempLocationZone();
logger.info("Temporary location zone selected successfully");

await addaddress.clickOnTempAddressAddViewBnt();
logger.info("Temporary address Add/View button clicked successfully");

await addaddress.enterTempAddresNotes(jsonData.tempAddress[index].add_notes);
logger.info("Temporary address notes entered successfully");

await addaddress.clickOnTempAddressAddViewBnt();
logger.info("Temporary address Add/View button clicked successfully (second time)");

await addaddress.closeTempAddressNotesPopup();
logger.info("Temporary address notes popup closed successfully");


      //Billing Corrospondance
      await addaddress.CheckRadiobtnBilllingCorrespondence();
logger.info("Billing correspondence radio button checked successfully");

await addaddress.SelectStartEndDate();
logger.info("Start and end date selected successfully");

await addaddress.clickOnSaveAddress();
logger.info("Save address button clicked successfully");

      await page.waitForTimeout(1000);
      
      await expect(page.getByText('Patient address added successfully')).toHaveText('Patient address added successfully')
    
    
      //Add PIP

      // await addpip.selectPIPTitle(jsonData.pip[index].pip_title);
      await addpip.enterPIPFamilyName(jsonData.pip[index].pip_surname);
logger.info("PIP family name entered successfully");

await addpip.enterPIPGivenName(jsonData.pip[index].pip_firstname);
logger.info("PIP given name entered successfully");

await addpip.enterPIPMiddleName(jsonData.pip[index].pip_middlename);
logger.info("PIP middle name entered successfully");

await addpip.selectPIPBornDate(jsonData.pip[index].pip_dob);
logger.info("PIP date of birth selected successfully");

await addpip.selecrPIPEthnicity(jsonData.pip[index].pip_ethnicity_text);
logger.info("PIP ethnicity selected successfully");

await addpip.selectPIPOccupation();
logger.info("PIP occupation selected successfully");

        
      await addpip.selectPIPRelation(jsonData.pip[index].pip_relationship);
logger.info("PIP relation selected successfully");

await addpip.selectPIPNextOfKin(jsonData.pip[index].pip_next_of_kin_Yes);
logger.info("PIP next of kin selected successfully");

await addpip.SelectPIPFamilyAwareOfIllness(jsonData.pip[index].pip_family_aware_illness_yes);
logger.info("PIP family aware of illness option selected successfully");

await addpip.selectPIPIdentifierType(jsonData.pip[index].pip_identifier_type);
logger.info("PIP identifier type selected successfully");
   
      
     if (await addpip.dropdownPIPIdentifierType.isVisible()) {
  await addpip.enterPIPIdentifier(jsonData.pip[index].pip_identifier_number.toString());
  logger.info("PIP identifier number entered successfully");
} else if (await addpip.chiNumber.isVisible()) {
  await addpip.enterCHInumber(jsonData.pip[index].pip_chiNumber.toString());
  logger.info("CHI number entered successfully");
} else {
  logger.error("Neither PIP Identifier dropdown nor CHI Number field is visible on the screen.");
  throw new Error("Neither PIP Identifier dropdown nor CHI Number field is visible on the screen.");
}

      

     await addpip.enterProfessionalTitle(jsonData.pip[index].pip_professional_title);
logger.info("PIP professional title entered successfully");

await addpip.selectPIPReceivePatientLetter(jsonData.pip[index].pip_receive_patient_letter_no);
logger.info("PIP receive patient letter option selected successfully");

await addpip.selectPIPReceiveAppointmentLetter(jsonData.pip[index].pip_receive_pat_appt_letter_no);
logger.info("PIP receive appointment letter option selected successfully");

      //await addpip.selectPIPPartnerDetailsOnRegForm();
      await addpip.checkSendPatientTextEmail(jsonData.pip[index].pip_send_txt_email_yes);
logger.info("PIP send patient text/email option selected successfully");

await addpip.checkIsReferrer();
logger.info("PIP referrer checkbox selected successfully");

await addpip.enterPIPNotes(jsonData.pip[index].pip_notes);
logger.info("PIP notes entered successfully");

await addpip.checkcAssistingInPartner();
logger.info("PIP assisting in partner checkbox selected successfully");

await addpip.checkHelpingPatients();
logger.info("PIP helping patients checkbox selected successfully");

await addpip.checkBeingPhotographed();
logger.info("PIP being photographed checkbox selected successfully");

await addpip.checkGeneralPublicity();
logger.info("PIP general publicity checkbox selected successfully");

await addpip.ClickOnSavePIP();
logger.info("PIP save button clicked successfully");

      
      await page.waitForTimeout(500);

      
      await expect(page.getByText('Patient interested parties details added successfully')).toHaveText('Patient interested parties details added successfully')
      //await expect(page.getByText("Patient interested party details added successfully")).toHaveText("Patient interested party details added successfully");

      //View PIP
await viewpip.clickOnViewPIPLink();
logger.info("View PIP link clicked successfully");

await viewpip.clickOnCloseViewPopup();
logger.info("View PIP popup closed successfully");

await viewpip.clickOnNextbntViewPIP();
logger.info("Next button in View PIP clicked successfully");


      //Search GP      
      await addgp.clickOnSearchGPBtn();
logger.info("Search GP button clicked successfully");

      await expect(page.getByText("Local GP found")).toHaveText("Local GP found");
     
      await addgp.enterGpSearch();
logger.info("GP search entered successfully");

await addgp.clickOnAddGPBtn();
logger.info("Add GP button clicked successfully");


      // Add GP       
      await addgp.enterGPTitle(jsonData.addGP[index].egp_title);
logger.info("GP title entered successfully");

await addgp.enterGPInitials(jsonData.addGP[index].egp_initials);
logger.info("GP initials entered successfully");

await addgp.enterGPGivenName(jsonData.addGP[index].egp_first_name);
logger.info("GP given name entered successfully");

await addgp.enterGPFamilyName(jsonData.addGP[index].egp_surname);
logger.info("GP family name entered successfully");

await addgp.enterGPCode(jsonData.addGP[index].egp_gp_code);
logger.info("GP code entered successfully");

await addgp.enterGPPracticeCode(jsonData.addGP[index].egp_practise_code);
logger.info("GP practice code entered successfully");

await addgp.enterGPGMCCode(jsonData.addGP[index].egp_gmc_code);
logger.info("GP GMC code entered successfully");

await addgp.clickOnShowbnt();
logger.info("Show button clicked successfully");

await addgp.selectUnknownPostCode();
logger.info("Unknown postcode selected successfully");



      //Gp Address Details       
      await addgp.enterLocalGPPostcode();
logger.info("Local GP postcode entered successfully");

await page.waitForTimeout(1000);

await addgp.enterGpAddressNumberAndRoad(jsonData.gpAddress[index].add_address1);
logger.info("GP address number and road entered successfully");

await addgp.enterGpAddressDistrict(jsonData.gpAddress[index].add_address3);
logger.info("GP address district entered successfully");

await addgp.enterGpAddressTown(jsonData.gpAddress[index].add_address2);
logger.info("GP address town entered successfully");

await addgp.enterGpAddressCounty(jsonData.gpAddress[index].add_address4);
logger.info("GP address county entered successfully");

await addgp.enterGPAddressPostCode(jsonData.gpAddress[index].add_address5);
logger.info("GP address postcode entered successfully");

await addgp.enterGPPhone(jsonData.gpAddress[index].add_phone.toString());
logger.info("GP phone number entered successfully");

await addgp.enterGPFax(jsonData.gpAddress[index].add_fax.toString());
logger.info("GP fax number entered successfully");

await addgp.enterGPWorkPhone(jsonData.gpAddress[index].add_work_phone.toString());
logger.info("GP work phone entered successfully");

await addgp.enterGPMobile(jsonData.gpAddress[index].add_mobile.toString());
logger.info("GP mobile number entered successfully");

await addgp.enterGPEmail(jsonData.gpAddress[index].add_email);
logger.info("GP email entered successfully");

await addgp.clickOnSaveGPButton();
logger.info("Save GP button clicked successfully");

await page.waitForTimeout(500);

      await expect(page.getByText("GP Added Successfully")).toHaveText("GP Added Successfully");

      await addgp.enterAppGpSearch(jsonData.SPaddGP[index].egp_fullname);
logger.info("App GP search entered successfully");

//Add GP to Patient.
await addgp.clickOnPersonAddButton();
logger.info("Person add button clicked successfully");

await addgp.clickOnNextButtonOnSearchGp();
logger.info("Next button on search GP clicked successfully");

      await page.waitForTimeout(3000);

     

    /////////////////////////////
    /**
 * Recursively searches for a specific file in a directory tree.
 * @param {string} dir - Directory to start searching from.
 * @param {string} targetFile - Name of the file to find.
 * @returns {string|null} - Absolute path to the file, or null if not found.
 */


function findFileRecursive(dir, targetFile) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const result = findFileRecursive(fullPath, targetFile);
      if (result) return result;
    } else if (file === targetFile) {
      return fullPath;
    }
  }
  return null;
}

// Get Jenkins workspace root or current directory
const workspaceRoot = process.env.WORKSPACE || process.cwd();
const targetFilePath = findFileRecursive(workspaceRoot, 'Patient.png');

if (!targetFilePath) {
  throw new Error('❌ Patient.png not found anywhere under the workspace!');
}

console.log('✅ Found Patient.png at:', targetFilePath);

// Upload the file using Playwright
const fileInput = await page.getByTestId('PhotoCameraIcon');
await fileInput.setInputFiles(targetFilePath);

await page.waitForTimeout(200)
  await expect(page.getByText('Patient photo uploaded successfully')).toHaveText('Patient photo uploaded successfully')

      await page.waitForTimeout(2000);
      await printidcard.clickOnSavebtn();
      await page.waitForTimeout(2000);

     // await page.pause()
      await addpatient.enterHospitalRef(jsonData.addPatient[index].pat_hospital_ref);
      await addpatient.clickOnsavebutton()

       await page.getByLabel('profileIcon').click();
         await page.getByText('Logout').click();
      //await menu.clickOnMenubtn();
      // await menu.clickOnLogout();

      //////// Patient Detail comparison/////////
      var sqlQuery = "select * from patients where pat_hospital_ref= '" + data.pat_hospital_ref +
        "' order by pat_id desc limit 1";
      console.log(sqlQuery)

      var sqlFilePath = "SQLResults/PatientDomain/patientData.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      //console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].pat_id;
      const patAddId = results[0].pat_add_id;
      const patEgpId = results[0].pat_egp_Id

      console.log("Patient id is:" + patId);
      console.log("Patient Address id is:" + patAddId);
      console.log("Patient EGP id is:" + patEgpId);

      var match = await compareJsons(sqlFilePath, null, data);
      if (match) {
        console.log("\n Patient Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// Patient UNique Identifier comparison/////////
      sqlQuery = "Select pid_value from patient_identifiers where pid_pat_id=" + patId;

      console.log("Query for Identifier:" + sqlQuery);

      sqlFilePath = "SQLResults/PatientDomain/patientIData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      match = 0;
      if (results[0].pid_value == jsonData.patientIdentifier[index].pid_value1) {
        if (results[1].pid_value == jsonData.patientIdentifier[index].pid_value2)
          match = 1;
      } else if (results[0].pid_value == jsonData.patientIdentifier[index].pid_value2) {
        if (results[1].pid_value == jsonData.patientIdentifier[index].pid_value1)
          match = 1;
      }
      if (match) {
        console.log("\n Patient Identifier Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Identifier Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// Permanent Address Detail comparison/////////
      sqlQuery = "select * from addresses where add_id=" + patAddId;
      sqlFilePath = "SQLResults/PatientDomain/patientAddressData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);

      match = 0;
      match = await compareJsons(sqlFilePath, null, jsonData.permanentAddress[index]);
      if (match) {
        console.log("\n Patient Permanent Address Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Permanent Address Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// Temporary Address Detail comparison/////////
      sqlQuery = "select * from addresses where add_pat_id=" + patId + " and add_temp_permanent='T' order by 1 desc limit 1;";
      sqlFilePath = "SQLResults/PatientDomain/patientTempAddressData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      //console.log("\n Address Details stored into the database: \n", results);
      // Option 1: Provide a second JSON file path
      // Provide both file path to the compareJsons.js file
      //const jsonFilePath3 = 'C:\\Riomed\\Cellma4Automation\\SQLResults\\PatientDomain\\patientAddressData.json'; // Update with the actual file path
      match = 0;
      match = await compareJsons(sqlFilePath, null, jsonData.tempAddress[index]);
      if (match) {
        console.log("\n Patient Temporary Address Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Temporary Address Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// PIP Detail comparison/////////
      sqlQuery = "select * from patient_interested_parties where pip_pat_id=" + patId;
      sqlFilePath = "SQLResults/PatientDomain/patientPIPData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      const pipAddId = results[0].pip_add_id;
      // console.log("\n Address Details stored into the database: \n", results);
      // Option 1: Provide a second JSON file path
      // Provide both file path to the compareJsons.js file
      //const jsonFilePath3 = 'C:\\Riomed\\Cellma4Automation\\SQLResults\\PatientDomain\\patientAddressData.json'; // Update with the actual file path
      match = 0;
      match = await compareJsons(sqlFilePath, null, jsonData.permanentAddress[index]);
      if (match) {
        console.log("\n PIP Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n PIP Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// PIP Address Detail comparison/////////
      sqlQuery = "select * from addresses where add_id=" + pipAddId;
      sqlFilePath = "SQLResults/PatientDomain/patientPIPAddressData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      // console.log("\n Address Details stored into the database: \n", results);
      // Option 1: Provide a second JSON file path
      // Provide both file path to the compareJsons.js file
      //const jsonFilePath3 = 'C:\\Riomed\\Cellma4Automation\\SQLResults\\PatientDomain\\patientAddressData.json'; // Update with the actual file path
      match = 0;
      // match = await compareJsons(sqlFilePath, null, jsonData.pipAddress[index]);

      match = await compareJsons(sqlFilePath, null, jsonData.pipAddress[index]);
      if (match) {
        console.log("\n PIP Permanent Address Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n PIP Permanent Address Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// Added GP Detail comparison/////////
      sqlQuery =
        "select * from establishment_gps where egp_gp_code='" + jsonData.addGP[index].egp_gp_code + "' order by 1 desc limit 1";
      sqlFilePath = "SQLResults/PatientDomain/patientNewGPData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      // console.log("\n Address Details stored into the database: \n", results);
      const egpId = results[0].egp_Id
      const egpAddId = results[0].egp_add_id
      // Option 1: Provide a second JSON file path
      // Provide both file path to the compareJsons.js file
      //const jsonFilePath3 = 'C:\\Riomed\\Cellma4Automation\\SQLResults\\PatientDomain\\patientAddressData.json'; // Update with the actual file path
      match = 0;
      match = await compareJsons(sqlFilePath, null, jsonData.addGP[index]);
      if (match) {
        console.log("\n GP Details Comparision: Parameters from both JSON files match!\n");
      } else {
        console.log("\n GP Details Comparision: Parameters from both JSON files do not match!\n");
      }

      //////// Patient GP Detail comparison/////////
      if (patEgpId == egpId) {
        console.log("\n Newly created GP was linked successfully! \n");
      } else {
        console.log("\n Newly created GP was not linked to the patient!\n");
      }

      ////////  GP Address comparison/////////
      sqlQuery = "select * from addresses where add_id=" + egpAddId + "";
      sqlFilePath = "SQLResults/PatientDomain/patientGPAddressData.json";
      results = await executeQuery(sqlQuery, sqlFilePath);

      //const jsonFilePath3 = 'C:\\Riomed\\Cellma4Automation\\SQLResults\\PatientDomain\\patientAddressData.json'; // Update with the actual file path
      match = 0;
      match = await compareJsons(sqlFilePath, null, jsonData.gpAddress[index]);
      if (match) {
        console.log("\n Patient GP Address comparison: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient GP Address comparison: Parameters from both JSON files do not match!\n");
      }

      //Listen for console events
      // page.on("console", async (msg) => {
      //   const args = await Promise.all(msg.args().map((arg) => arg.jsonValue()));
      //   consoleLogs.push({
      //     type: msg.type(),
      //     text: args.join(" "),
      //   });
      // });

      //  await menu.clickOnMenubtn()
      //  await menu.clickOnLogout()
      // Listen for console events
    //   page.on("console", async (msg) => {
    //     const args = await Promise.all(
    //       msg.args().map((arg) => arg.jsonValue())
    //     );
    //     consoleLogs.push({
    //       type: msg.type(),
    //       text: args.join(" "),
    //     });
    //   });
    //   index++
    }
  })
})
