//Sathyanarayan

const { clickElement, typeText, selectFromDropdown,fillTextBoxByLabel} = require("../../../UtilFiles/StaticUtility.js");
const { selectFromSearchResults,} = require("../../../UtilFiles/DynamicUtility.js");

class ClinicalExtraDetails {
  constructor(page) {
    this.page = page;
    //Search Medication fields
    this.clinicalItemCollapsable = page.locator("xpath=//div[@data-testid='CommonCellmaPopup']//button[@aria-label='cellmaAccordionIcon']");


    //CarePlan
    this.CarePlanNursingDiagnosis=page.locator("xpath=//input[@name='searchNursingDiagnosis']")
    this.SearchGoals=page.locator("xpath=//input[@name='searchGoals']")
    this.Interventions=page.locator("xpath=//input[@name='searchInterventions']")
    this.searchEvaluations=page.locator("xpath=//input[@name='searchEvaluations']")
    this.updateNotes=page.locator("xpath=//textarea[@id='updatedNotesForExtraDetails']")

    this.searchNursingDiagnosis0=page.locator("xpath=//textarea[@name='searchNursingDiagnosis0.notes']")
    this.searchGoals0=page.locator("xpath=//textarea[@name='searchGoals0.notes']")
    this.searchInterventions0=page.locator("xpath=//textarea[@name='searchInterventions0.notes']")
    this.searchEvaluations0=page.locator("xpath=//textarea[@name='searchEvaluations0.notes']")
    this.updatedNotesForExtraDetails=page.locator("xpath=//textarea[@id='updatedNotesForExtraDetails']")





    //Allergy
    //this.clinicalItemSubcategory = page.locator("xpath=//input[@id='Sub Category']");
    this.clinicalItemSubcategory = page.locator("xpath=//input[@id='Sub Category']");
    this.clinicalItemCollapsableAllergy1 = page.getByTestId("allergies").getByLabel("cellmaAccordionIcon");
    this.clinicalItemCollapsableAllergy2 = page.getByTestId("episodes[0].id").getByLabel("cellmaAccordionIcon");
    this.clinicalSubcategoryAllergy = page.locator("xpath=//input[@name='subCategory']");
    this.buttonSpecificAllergyName = page.locator("xpath=//button[@aria-label='Specific Allergy Name']");
    this.allergyStartDate = page.locator("xpath=//input[@id='episodes[0].startDate']");
    this.allergyEndDate = page.locator("xpath=//input[@id='episodes[0].endDate']");
    this.allergyReaction = page.locator("xpath=//input[@id='episodes[0].reaction']");
    this.ReactionSeverity = page.locator("xpath=//input[@id='episodes[0].reactionSeverity']");
    this.allergyTextArea = page.locator("xpath=//textarea[@id='episodes[0].allergyNotes']");

    //condition ED
    this.conditionScore=page.locator("xpath=//input[contains(@id, 'Score')]")
    this.haveYouStoppedAnyMedications=page.locator("xpath=//input[@name='haveYouStoppedAnyMedications']")
    this.dateOfCondition=page.locator("xpath=//input[@name='dateOfDiagnosis']")
    this.previousCondition=page.locator("xpath=//input[@name='previousCondition']")
    this.conditionnotes=page.locator("xpath=//textarea[@name='notes']")
    this.saveButton=page.locator("xpath=//button[@type='submit']")


//Pregnancy Locators
this.pregGravida= page.locator("xpath=//input[@id='gravida']")
        this.pregFetusNo= page.locator("xpath=//input[@name='noOfFetus']")
        this.pregExpandFirstFetus= page.locator("xpath= //div[contains(text(),'1st Fetus Details')]")
        this.pregExpandSecondFetus= page.locator("xpath=//div[contains(text(),'2nd Fetus Details')]")
        this.pregOutcome= page.locator("xpath=//div[@data-testid='outcome']")
        //input[@data-testid='Birth Place']
        this.pregGestWeek= page.locator("xpath=//input[@data-testid='Gestation Weeks']")
        this.pregGestDays= page.locator("xpath=//input[@data-testid='Gestation Plus Days']")
        this.pregDevliveryMethod= page.locator("xpath=//div[@data-testid='deliveryMethod']")
        this.pregDateOfDelivery= page.locator("xpath=//input[@name='dateOfDelivery']")
        //this.pregTimeOfDelivery= page.locator("xpath=//input[@id=':rre:']")
        this.pregTimeOfDelivery= page.getByPlaceholder('hh:mm')
        this.pregWeight= page.locator("xpath=//input[@data-testid='Weight(kg)']")
        this.pregSex= page.locator("xpath=//div[@data-testid='sex']")
        this.pregBabyName= page.locator("xpath=//input[@data-testid='Baby Name']")
        this.pregBirtPlace= page.locator("xpath=//input[@data-testid='Birth Place']")
        this.pregFeedingMethod= page.locator("xpath=//input[@name='feedingMethod']")
           //label[contains(text(),'No of Fetus')]
        this.pregSocialWorkAssigned= page.locator("xpath=//input[@name='socialWorkerAssigned']")
        this.pregComplications= page.locator("xpath=//input[@name='complications']")
        this.pregNotes= page.locator("xpath=//label[contains(text(),'Notes')]")
        this.pregSave= page.locator("xpath=//div[contains(text(),'Save')]")

    //Procedure
    this.dateOfProcedure = page.locator("xpath=//input[@name='dateOfProcedure']");
    this.procedureType = page.locator("xpath=//input[@name='type']");
    this.procedureSite = page.locator("xpath=//input[@name='site']");
    this.performedByHP = page.locator("xpath=//input[@name='performedByHPConsultants']");
    this.procedureLevel = page.locator("xpath=//input[@name='level']");
    this.procedureStatus = page.locator("xpath=//input[@name='status']");
    this.procedureOutcome = page.locator("xpath=//input[@name='outcome']");
    this.linktoClinicLocation = page.locator("xpath=//input[@name='linkToClinicLocation']");
    this.linktoExistingCondition = page.locator("xpath=//input[@name='linkToExistingCondition']");
    this.linktoComplationDate = page.locator("xpath=//input[@name='completionDate']");
    this.procedureCheckboxDeviceRequired = page.locator("xpath=//span[@data-testid='Device Required']");
    this.procedureCheckboxPrivateRecord = page.locator("xpath=//span[@data-testid='Private Record']");
    this.procedureCheckBoxSetAsDefault = page.locator("xpath=//span[@data-testid='Set As Default']");
    this.procedureTextareaNotes = page.locator("xpath=//textarea[@name='notes']");

    //lifestyle

    this.lifeStyleNotes=page.locator("xpath=//textarea[@name='notes']")

    //riskFactor

    this.RfNotes=page.locator("xpath=//textarea[@name='notes']")

    //Social

    this.socialNotes=page.locator("xpath=//textarea[@name='notes']")


    //Diagnosis
    this.onSetDate = page.locator("xpath=//input[@data-testid='Onset Date']");
    this.diagnosedDate = page.locator("xpath=//input[@data-testid='Diagnosed Date']");
    this.diagnosis1stSeenDate = page.locator("xpath=//input[@data-testid='1st Seen Date']");
    this.status = page.locator("xpath=//input[@name='status']");
    this.severity = page.locator("xpath=//input[@name='severity']");
    this.activity = page.locator("xpath=//input[@name='activity']");
    this.countryOfDiagnosis = page.locator("xpath=//input[@name='countryOfDiagnosis']");
    this.underlayingCause = page.locator("xpath=//input[@name='underlyingCause']");
    this.complicationAndDiagnosis = page.locator("xpath=//input[@name='complicationsAndOtherDiagnosis']");
    this.externalCause = page.locator("xpath=//input[@name='externalCause']");
    this.linkToProcedure = page.locator("xpath=//input[@id='Link to Procedure']");

    this.dateOfOutcome = page.locator("xpath=//input[@id='Date of Outcome']");
    this.frequency = page.locator("xpath=//input[@name='frequency']");
    this.diagnosisNotes = page.locator("xpath=//textarea[@name='notes']");
    this.interpretationNotes = page.locator("xpath=//textarea[@name='notes']");
    this.private = page.locator("xpath=//label[@aria-label='Private Record']//input[@class='PrivateSwitchBase-input css-1m9pwf3']");
    this.setAsDefault = page.locator("xpath=//label[@aria-label='Set as Default']//input[@class='PrivateSwitchBase-input css-1m9pwf3']");
    this.addToFavourites = page.locator("xpath=//label[@aria-label='Add to Favourites']//input[@class='PrivateSwitchBase-input css-1m9pwf3']");
    this.addToOrderSets = page.locator("xpath=//label[@aria-label='Add to Order Set']//input[@class='PrivateSwitchBase-input css-1m9pwf3']");
    this.save = page.locator("xpath=//button[@aria-label='Save']");
    this.saveCheckList = page.locator("xpath=//button[@aria-label='saveChecklist']");
    //this.saveExtraDetails = page.locator("xpath=//button[@aria-label='saveCategoryExtraDetails']");
    this.saveAllergyED=page.locator("xpath=//button[@data-testid='Save']")
    
    this.saveEDCarePlan=page.locator("xpath=//button[@aria-label='saveExtraDetailsOfCarePlans']")
    this.saveExtraDetails = page.locator("xpath=//button[@data-testid='extraDetailsSave']");
    this.saveConditionExtraDetails=page.locator("xpath=//button[@data-testid='extraDetailsSave']")
    this.saveandCreateLabRequest=page.locator("xpath=//button[@data-testid='saveAndCreateLabRequest']")
    this.saveCheckListButton=page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-12 MuiGrid2-grid-md-12 mui-kqf8ps']//button[@data-testid='Save']")
    this.saveChecklistPortal = page.locator("xpath=//button[@aria-label='saveChecklist']");
    this.saveFavourites=page.locator("xpath=//div[@role='dialog']//button[normalize-space()='Save']")
    this.delete = page.locator("xpath=//button[@data-testid='Delete']");
    this.deleteCertificate = page.locator("xpath=//button[@aria-label='Delete']");
    this.cancelDelete = page.locator("xpath=//button[@data-testid='Cancel']");
    this.confirmDelete = page.locator("xpath=//button[@data-testid='Ok']");
    this.deleteReason = page.locator("xpath=//textarea[@aria-label='Reason']");
    //this.saveDeleteReason = page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-spacing-xs-2 css-5kwuk3']//button[@data-testid='Save']");
    this.saveDeleteReason = page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 mui-139jkte']//button[@data-testid='Save']");

    //Medication Certificate
    // this.confirm = page.locator("xpath=//button[@aria-label='Confirm']");
    // this.limitation = page.locator("xpath=//input[@id='limitation']");
    // this.limitationAppliedDate = page.locator("xpath=//input[@id='limitationApplied']");
    // this.limitationValid = page.locator("xpath=//input[@id='limitationValidTo']");
    // this.consultedCAA =page.locator("xpath=//label[@aria-label='consultedCAA']//span//input[@type='radio']")
    // this.reasonForLimitation=page.locator("xpath=//textarea[@id='reasonForLimitations']")
    // this.btnAddLimitation=page.locator("xpath=//button[@aria-label='Add']")
    // this.linkShowLimitation=page.locator("xpath=//div[@class='MuiDataGrid-row MuiDataGrid-row--lastVisible MuiDataGrid-row--dynamicHeight']//div/a[text()='Show']")
    // this.linkEditLimitation=page.locator("xpath=//div[@class='MuiDataGrid-row MuiDataGrid-row--lastVisible MuiDataGrid-row--dynamicHeight']//div/a[text()='Edit']")
    // this.closeShowLimitationPopup=page.locator("xpath=//button[@aria-label='remove']//*[name()='svg']")
    // this.deleteLimitationButton=page.locator("//button[@aria-label='remove']//*[name()='svg']")
    
    //Medication Certificate
    this.confirm = page.locator("xpath=//button[@aria-label='confirmMedicalCertificate']");
    this.limitation = page.locator("xpath=//input[@id='limitation']");
    this.limitationAppliedDate = page.locator("xpath=//input[@id='limitationApplied']");
    this.limitationValid = page.locator("xpath=//input[@id='limitationValidTo']");
    this.consultedCAA =page.locator("xpath=//label[@aria-label='consultedCAA']//span//input[@type='radio']")
    this.reasonForLimitation=page.locator("xpath=//textarea[@id='reasonForLimitations']")
    this.btnAddLimitation=page.locator("xpath=//button[@aria-label='addLimitations']")
    this.linkShowLimitation=page.locator("xpath=//a[@aria-label='Show']")
    this.linkEditLimitation=page.locator("xpath=//a[@aria-label='Edit']")
    this.textAreaLimitationReason=page.locator("xpath=//textarea[@id='editLimitationReason']")
    this.removereasonForLimitation=page.locator("xpath=//textarea[@id='removalReason']")
    //this.closeShowLimitationPopup=page.locator("xpath=//button[@aria-label='remove']//*[name()='svg']")
    this.medicalCertificateNotes=page.locator("xpath=//textarea[@data-testid='Notes']")
    
    this.closeShowLimitationPopup=page.getByRole('button', { name: 'cancelIcon' })
    this.deleteLimitationButton=page.locator("//button[@aria-label='remove']//*[name()='svg']")
    this.btnSaveEditedMcCertificate=page.locator("xpath=//button[@aria-label='saveLimitationForm']")
    this.reasonForDeletion=page.locator("xpath=//textarea[@aria-label='Reason for Deletion']")
    this.saveRemovedLimitation=page.locator("xpath=//button[@aria-label='saveRemoveLimitation']")
    this.btnSaveReasonforDeletion=page.locator("xpath=//button[@data-testid='Delete']")
    this.editMCNotes=page.locator("xpath=//textarea[@aria-label='medicalCertificateNotes']")
    this.SaveEditedLimitation=page.locator("xpath=//button[@aria-label='saveLimitation']")
    this.showRemovedReasonlink=page.locator("xpath=//div[@data-field='patmcsnLimitationRemovedReason']//a[@class='MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover css-1uoks6u'][normalize-space()='Show']")
    this.mcClassReason=page.locator("xpath=//textarea[@id='fitnessReasonNote']")

    this.txtareaAMEDeclaration=page.locator("xpath=//textarea[@id='ameDeclaration']")
     this.btnAcknowledgeDeclaration=page.locator("xpath=//button[@aria-label='Acknowledge Declaration']")
    
 //Examination
    this.dropdownOutcome=page.locator("xpath=//input[@name='outcome']")
     this.textareaNotes=page.locator("xpath=//textarea[@name='notes']")


    //Recommendations
    this.reviewDate = page.locator("xpath=//input[@id='Review Date']");

    //Interpretation
    this.interpretationOutcome = page.locator("xpath=//input[@name='interpretationOutcome']");

    //PresentingProblems
    this.estimatedDate = page.locator("xpath=//input[@name='estimatedDate']");
    this.problemStatus = page.locator("xpath=//input[@name='status']")
    this.problemOnset = page.locator("xpath=//input[@name='onset']")
    this.problemSeverity = page.locator("xpath=//input[@name='severity']")
    this.onsetDate = page.locator("xpath=//input[@name='onsetDate']")
    this.problemSeverity = page.locator("xpath=//input[@name='severity']")
    this.problemRating = page.locator("xpath=//input[@name='rating']")
    this.problemNotes=page.locator("xpath=//textarea[@data-testid='Notes']")


         //Ed popup icons
         this.uploadFile= page.locator("xpath=//button[@aria-label='Upload File']")
         this.addedDocument= page.locator("xpath=//button[@aria-label='Added Documents']")
         this.addToTask= page.locator("xpath=//button[@aria-label='Add To Task']")
         this.addToWorklist= page.locator("xpath=//button[@aria-label='Add To Worklist']")
         this.addPathway= page.locator("xpath=//button[@aria-label='Add Pathway']")
         this.link= page.locator("xpath=//button[@aria-label='Link']")
         this.closePopup= page.locator("xpath=//button[@aria-label='cancelIcon']")


        //Patient Scan
        this.scanType = page.locator("xpath=//input[@name='type']")
        this.scanDate = page.locator("xpath=//input[@name='scanDate']")
        this.scanArea = page.locator("xpath=//input[@name='scanArea']")
        this.bmdScore = page.locator("xpath=//input[@name='bMDScore']")
        this.tScore = page.locator("xpath=//input[@name='tScore']")
        this.zScore = page.locator("xpath=//input[@name='zScore']")
        this.machineName = page.locator("xpath=//input[@name='machineName']")
        this.scanNotes=page.locator("xpath=//textarea[@name='notes']")

        //Investigations
        this.invStatus= page.locator("xpath=//input[@name='status']")
        this.invOutstanding= page.locator("xpath=//input[@name='outstandingInvestigations']")
        this.invReason = page.locator("xpath=//input[@name='reason']")
        this.invResult = page.locator("xpath=//input[@name='results']")
        this.invOutcome = page.locator("xpath=//input[@name='outcome']")
        this.invCritical = page.locator("xpath=//input[@name='critical']")
        this.invLinkToDiagnosis = page.locator("xpath=//input[@name='linkToDiagnosis']")
        this.invDateOfUpload = page.locator("xpath=//input[@name='dateOfUpload']")
        this.invPatCurrentLocation = page.locator("xpath=//input[@name='patientCurrentLocation']")
        this.invCompletedDate = page.locator("xpath=//input[@name='completedDate']")
        this.invReviewDate = page.locator("xpath=//input[@name='reviewDate']")
        this.invPriority = page.locator("xpath=//input[@name='priority']")
        this.invRequestedBy = page.locator("xpath=//input[@name='requestedBy']")
        this.invSendTo = page.locator("xpath=//input[@name='sendTo']")
        this.invExtLocation = page.locator("xpath=//input[@name='externalLocation']")
        this.invCheckImagingRequest = page.locator("xpath=//span[@data-testid='For Imaging Request']//input[@value='false']")
        this.invUncheckImagingRequest = page.locator("xpath=//span[@data-testid='For Imaging Request']//input[@value='true']")
        this.invCheckLabRequest = page.locator("xpath=//span[@data-testid='For Lab Request']//input[@value='false']")
        this.invUncheckLabRequest = page.locator("xpath=//span[@data-testid='For Lab Request']//input[@value='true']")
        this.invCheckShareOnPortal = page.locator("xpath=//span[@data-testid='Share on Portal']//input[@value='false']")
        this.invUncheckShareOnPortal = page.locator("xpath=//span[@data-testid='Share on Portal']//input[@value='true']")
        this.invNotes = page.locator("xpath=//textarea[@name='notes']")
        this.invShowSubtest = page.locator("xpath=//div[contains(text(),'Show Sub-Tests')]")
        this.invCratineValue = page.locator("xpath=//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth Mui-focused MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-adornedEnd css-drv5b2']//input[@id='valueundefinedsubTest']")
        this.invCreatineTarget = page.locator("xpath=//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth Mui-focused MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-adornedEnd css-drv5b2']//input[@id='targetnullsubTest']")
        this.invUreaValue = page.locator("xpath=//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-adornedEnd css-drv5b2']//input[@name='ureaicvValue']")
        this.invUreaTarget = page.locator("xpath=//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-adornedEnd css-drv5b2']//input[@id='targetnullsubTest']")
        this.invSave = page.locator("xpath=//div[contains(text(),'Save')]")
        this.invDelete = page.locator("xpath=//div[contains(text(),'Delete')]")
        this.invRequestedBy = page.locator("xpath=//input[@name='requestedBy']")
        this.invLinks= page.locator("xpath=//button[@aria-label='Links']")
        this.invLabRequestLink = page.locator("xpath=//li[@aria-label='Lab Requests']")
        this.invImagingRequestLink = page.locator("xpath=//li[@aria-label='Imaging Requests']")
        this.invAddLabRequestCheckbox= page.locator("xpath=//input[@type='checkbox']")
        this.invAddCreateLabRequest= page.locator("xpath=//button[@aria-label='Create Lab Request']")
        this.invSelectCheckbox= page.locator("xpath=//span[@data-testid='Select All']")
        this.invCollectSample= page.locator("xpath=//div[contains(text(),'Collect Sample')]")
        this.invSendSample= page.locator("xpath=//button[@aria-label='Send Sample']")
        this.createImgRequest  = page.locator("xpath=//div[contains(text(),'Create Imaging Request')]")


        //Overview
       // this.addClinicalItem = page.locator("xpath=//button[@aria-label='Add']")
       this.overviewNotes=page.locator("xpath=//textarea[@id='NotesOverview']")

    //Medication
    this.dose = page.locator("xpath=//input[@name='dose']");
    this.form=page.locator("xpath=//input[@data-testid='Form']")
    this.Route = page.locator("xpath=//input[@name='route']");
    this.days = page.locator("xpath=//input[@name='duration']");
    this.site = page.locator("xpath=//input[@name='site']");
    this.prescribeBy = page.locator("xpath=//input[@name='prescribedBy']");
    this.startDate = page.locator("xpath=//input[@name='startDate']");
    this.reviewDate = page.locator("xpath=//input[@name='reviewDate']");
    this.stopDate = page.locator("xpath=//input[@name='stopDate']");
    this.sideEffect = page.locator("xpath=//input[@name='sideEffect']");
    this.medicationStatus = page.locator("xpath=//input[@name='status']");
    this.indication = page.locator("xpath=//input[@name='indication']");
    this.stopReason = page.locator("xpath=//input[@name='stoppedReason']");
    this.PGDPSD = page.locator("xpath=//input[@name='pGDPSD']");
    this.medicationGradeForAdministrator = page.locator("xpath=//input[@name='userGradesThatCanAdministratorMedication']");
    this.maxReffills = page.locator("xpath=//input[@name='maxRefills']");
    this.quantity = page.locator("xpath=//input[@name='quantity']");
    this.unit = page.locator("xpath=//input[@name='unit']");
    this.units = page.locator("xpath=//input[@name='units']")
    this.currentLocation = page.locator("xpath=//input[@name='currentLocation']");
    this.linkToDiagnosis = page.locator("xpath=//input[@name='linkToDiagnosis']");
    this.adherent = page.locator("xpath=//input[@name='adherent']");
    this.endoserment = page.locator("xpath=//input[@name='endorsement']");
    this.forCondition = page.locator("xpath=//input[@name='forCondition']");
    this.priceCheckQuantity = page.locator("xpath=//input[@name='priceCheckQuantity']");
    this.totalCost = page.locator("xpath=//input[@id='Total Cost']");
    this.medicationNotes = page.locator("xpath=//textarea[@name='notes']");
    
    this.MC1Notes=page.getByTestId('Notes')
    this.MCnotes = page.locator("xpath=//textarea[@data-testid='Notes']")
    this.ClincalNotes= page.locator("xpath=//textarea[@name='notes']")
    //this.notes = page.locator("xpath=//textarea[@aria-label='Notes']");
    this.editDays = page.locator("xpath=//input[@id='Duration']");
    this.editPrescribed = page.locator("xpath=//input[@id='Prescribed By']")
    this.popUpNotes = page.getByTestId('CommonCellmaPopup').getByTestId('Notes')
    this.dispensingSectionNotes = page.locator("xpath=//textarea[@id='dispensingSectionNotes']");
    this.savePortal = page.locator("xpath=//button[@data-testid='Save']");
    this.saveAndCreatePrescription = page.locator("xpath=//button[@aria-label='saveAndCreatePrescription']")

    //Medication Checkboxes
    this.prescribeAndSupply = page.locator("xpath=//span[@data-testid='Prescription and supply']");
    this.supply = page.locator("xpath=//span[@data-testid='Supply']");
    this.suitableForDelivery = page.locator("xpath=//span[@data-testid='Suitable for Home Delivery']");
    this.addToPrescription = page.locator("xpath=//span[@data-testid='Add to Prescription']");
    this.setAsDefault = page.locator("xpath=//span[@data-testid='Set as Default']");
    this.repeatable = page.locator("xpath=//span[@data-testid='Repeatable']");
    this.addToFavourite = page.locator("xpath=//span[@data-testid='Add to favourites']");
    this.privateRecord = page.locator("xpath=//span[@data-testid='Private Record']");
    this.addToOrderSet = page.locator("xpath=//span[@data-testid='Add to order set']");
    this.saveCategoryExtraDetails = page.locator("xpath=//button[@aria-label='saveCategoryExtraDetails']");
    this.saveCustomizableViewbutton=page.locator("xpath=//button[@aria-label='saveExtraDetails']")
 

  //Patient Alerts
  this.dropdownAlertDaysSelected= this.page.locator("xpath=//input[@id='alertsDaysSelected']")
  this.alertsStartDate=this.page.locator("xpath=//input[@id='alertsStartDate']")
  this.alertsEndDate=this.page.locator("xpath=//input[@id='alertsEndDate']") 
  this.dropdownPriority=this.page.locator("xpath=//input[@id='priority']")
  this.dropdownDisplay=this.page.locator("xpath=//input[@id='display']")
  this.dropdownForUser=this.page.locator("xpath=//input[@id='forUser']")

 
        //Pregnancy
        this.pregGravida= page.locator("xpath=//input[@id='gravida']")
        this.pregFetusNo= page.locator("xpath=//input[@name='noOfFetus']")
        this.pregExpandFirstFetus= page.locator("xpath= //div[contains(text(),'1st Fetus Details')]")
        this.pregExpandSecondFetus= page.locator("xpath=//div[contains(text(),'2nd Fetus Details')]")
        this.pregOutcome= page.locator("xpath=//div[@data-testid='outcome']")
        //input[@data-testid='Birth Place']
        this.pregGestWeek= page.locator("xpath=//input[@data-testid='Gestation Weeks']")
        this.pregGestDays= page.locator("xpath=//input[@data-testid='Gestation Plus Days']")
        this.pregDevliveryMethod= page.locator("xpath=//div[@data-testid='deliveryMethod']")
        this.pregDateOfDelivery= page.locator("xpath=//input[@name='dateOfDelivery']")
        //this.pregTimeOfDelivery= page.locator("xpath=//input[@id=':rre:']")
        this.pregTimeOfDelivery= page.getByPlaceholder('hh:mm')
        this.pregWeight= page.locator("xpath=//input[@data-testid='Weight(kg)']")
        this.pregSex= page.locator("xpath=//div[@data-testid='sex']")
        this.pregBabyName= page.locator("xpath=//input[@data-testid='Baby Name']")
        this.pregBirtPlace= page.locator("xpath=//input[@data-testid='Birth Place']")
        this.pregFeedingMethod= page.locator("xpath=//input[@name='feedingMethod']")
           //label[contains(text(),'No of Fetus')]
        this.pregSocialWorkAssigned= page.locator("xpath=//input[@name='socialWorkerAssigned']")
        this.pregComplications= page.locator("xpath=//input[@name='complications']")
        this.pregNotes= page.locator("xpath=//label[contains(text(),'Notes')]")
        this.pregSave= page.locator("xpath=//div[contains(text(),'Save')]")

            //Temp Devices till locator issues sorted.
    this.dropdownDeviceProcedure = page.locator("xpath=//input[@name='procedure']");
    this.dropdownManufacturer = page.locator("xpath=//input[@name='manufacturer']");
    this.dropdownDeviceSubCategory = page.locator("xpath=//input[@name='subCategory']");
    this.txtSearchForDevice = page.locator("xpath=//input[@name='searchForDevice']");
    this.dropdownTypeOfDevice = page.locator("xpath=//input[@name='typeOfDevice']");
    this.dropdownInternalExternal = page.locator("xpath=//input[@name='internalExternal']");
    this.dropdownDeviceStatus = page.locator("xpath=//input[@name='status']");
    this.dropdownLaterality = page.locator("xpath=//input[@name='laterality']");
    this.txtDeviceSerialNumber = page.locator("xpath=//input[@name='serialNumber']");
    this.txtDeviceExpiryDate = page.locator("xpath=//input[@name='expiryDate']");
    this.txtDeviceNotes = page.locator("xpath=//textarea[@name='notes']");
    this.btnSaveDevice = page.locator("xpath=//button[@data-testid='extraDetailsSave']");
    this.extraDetailLevel2 = page.locator("xpath=//button[@data-testid='levelTwo']")
    this.extraDetailLevel = page.locator("xpath=//button[@data-testid='levelThree']")
    this.btnEditDevice = page.locator("xpath=//button[@aria-label='edit']");
    this.btnDeleteDevice = page.locator("xpath=//button[@aria-label='Delete']")
    this.btnOkDevicePopup = page.locator("xpath=//button[@data-testid='Ok']")
    this.txtDeleteDeviceReason = page.locator("xpath=//textarea[@id='Reason']")
    this.btnSaveDeleteReason = page.locator("xpath=//button[@aria-label='saveDeleteReason']")
    this.linkRequestOrderStatus = page.locator("xpath=//a[@aria-label='Not Ordered']")
    this.btnExternalRequest = page.locator("xpath=//button[@aria-label='External Request']")
    this.displayOrderStatus = page.getByRole('heading', { name: 'Awaiting Approval' })

    //Front End Display - Devices
    this.deviceProcedureName = page.getByRole('heading', { name: 'Cochlear Implantation' })
    this.deviceName = page.getByRole('cell', { name: 'Cochlear Osia OSI200' })
    this.deviceLaterality = page.getByRole('cell', { name: 'left' })
    this.deviceStatus = page.getByRole('cell', { name: 'implanted' })
    this.deviceExpiryDate = page.getByRole('heading', { name: '28/02/2025' })
    this.deviceSerialNumber = page.getByRole('heading', { name: '913748362' })
    this.deviceNotes = page.getByRole('heading', { name: 'Device added' })

    //Test Tools Locators
    this.sensoryPerception = page.locator("xpath=//input[@id='question-0']")
    this.moisture = page.locator("xpath=//input[@id='question-1']")
    this.activityTest = page.locator("xpath=//input[@id='question-2']")
    this.mobility = page.locator("xpath=//input[@id='question-3']")
    this.nutrition = page.locator("xpath=//input[@id='question-4']")
    this.frictionAndShear = page.locator("xpath=//input[@id='question-5']")
    this.calculateButton = page.locator("xpath=//button[@data-testid='Calculate']")
    this.saveTestButton = page.locator("xpath=//button[@data-testid='Save']")
    this.saveDASToolButton = page.locator("xpath=//button[@aria-label='Save DAS']")
    this.saveDASCRPToolButton = page.locator("xpath=//button[@aria-label='Save DAS-CRP']")
    this.deleteTestToolButton = page.locator("xpath=//button[@data-testid='Delete']")
    this.lastReviewedDate = page.locator("xpath=//input[@id='Last Reviewed']");
    this.lastReviewedTool = page.locator("xpath=//input[@id='lastReviewed']");
    this.editIcon = page.locator("xpath=//button[@aria-label='editIconButton']");
    this.notes = page.locator("xpath=//textarea[@id='notes']");
    // 2nd Test
    this.bmiScore = page.locator("xpath=//input[@id='question-0']")
    this.unplannedWeightLoss = page.locator("xpath=//input[@id='question-1']")
    this.noNutritialIntake = page.locator("xpath=//input[@id='question-2']")
    // 3rd Test
    this.recentFalls = page.locator("xpath=//input[@id='question-0']")
    this.medications = page.locator("xpath=//input[@id='question-1']")
    this.psychological = page.locator("xpath=//input[@id='question-2']")
    this.cognitiveStatus = page.locator("xpath=//input[@id='question-3']")
    // 4th Test
    this.interestOrPleasure = page.locator("xpath=//input[@id='question-0']")
    this.downOrDepressed = page.locator("xpath=//input[@id='question-1']")
    this.troubleSleeping = page.locator("xpath=//input[@id='question-2']")
    this.tiredLittleEnergy = page.locator("xpath=//input[@id='question-3']")
    this.poorAppetite = page.locator("xpath=//input[@id='question-4']")
    this.feelingBadAboutYourself = page.locator("xpath=//input[@id='question-5']")
    this.troubleConcentrating = page.locator("xpath=//input[@id='question-6']")
    //this.movingSlowly = page.locator("xpath=//input[@name='question-7']")
    //this.thoughtsOfDeath = page.locator("xpath=//input[@name='question-8']")

    //Tools
    // 1st Tool
    this.testDate = page.locator("xpath=//input[@id='testDate']")
    this.airConductionBtn = page.getByTestId('airConduction')
    //page.locator("xpath=//button[@data-testid='airConduction']")
    this.boneConductionBtn = page.locator("xpath=//button[@data-testid='boneConduction']")
    this.unaidedSoundFieldBtn = page.locator("xpath=//button[@data-testid='unaidedSoundField']")
    this.aidedSoundFieldBtn = page.locator("xpath=//button[@data-testid='aidedSoundField']")

    this.dropdownACTestingMethods = page.locator("xpath=//input[@id='airConduction.testingMethods']")
    this.dropdownACTransducerUsed = page.locator("xpath=//input[@id='airConduction.trasducerUser']")
    this.dropdownACStimulusSignalType = page.locator("xpath=//input[@id='airConduction.stimulusSignalType']")
    this.txtACReliability = page.locator("xpath=//input[@id='airConduction.reliability']")
    this.txtACNotes = page.locator("xpath=//input[@id='airConduction.notes']")

    this.dropdownBCTestingMethods = page.locator("xpath=//input[@id='boneConduction.testingMethods']")
    //this.dropdownBCTransducerUsed = page.locator("xpath=//input[@id='boneConduction.trasducerUser']")
    this.dropdownBCStimulusSignalType = page.locator("xpath=//input[@id='boneConduction.stimulusSignalType']")
    this.txtBCReliability = page.locator("xpath=//input[@id='boneConduction.reliability']")
    this.txtBCNotes = page.locator("xpath=//input[@id='boneConduction.notes']")

    this.dropdownUSFTestingMethods = page.locator("xpath=//input[@id='unaidedSoundField.testingMethods']")
    //this.dropdownUSFTransducerUsed = page.locator("xpath=//input[@id='unaidedSoundField.trasducerUser']")
    this.dropdownUSFStimulusSignalType = page.locator("xpath=//input[@id='unaidedSoundField.stimulusSignalType']")
    this.txtUSFReliability = page.locator("xpath=//input[@id='unaidedSoundField.reliability']")
    this.txtUSFNotes = page.locator("xpath=//input[@id='unaidedSoundField.notes']")

    this.dropdownASFTestingMethods = page.locator("xpath=//input[@id='aidedSoundField.testingMethods']")
    //this.dropdownASFTransducerUsed = page.locator("xpath=//input[@id='aidedSoundField.trasducerUser']")
    this.dropdownASFStimulusSignalType = page.locator("xpath=//input[@id='aidedSoundField.stimulusSignalType']")
    this.txtASFReliability = page.locator("xpath=//input[@id='aidedSoundField.reliability']")
    this.txtASFNotes = page.locator("xpath=//input[@id='aidedSoundField.notes']")

    this.saveTestAndToolExtraDetailsBtn = page.locator("xpath=//button[@aria-label='saveTestAndToolExtraDetails']")

    // 2nd Tool
    this.markerBtn = page.locator("xpath=//button[@data-testid='Add Marker']")
    this.markerOne = page.locator("xpath=//div[@data-testid='marker']")
    //this.markerNotes = page.locator("xpath=//textarea[@aria-label='Notes']")
    this.markerNotes = page.getByRole('textbox', { name: 'Notes' })
    this.saveNotes = page.locator("xpath=//button[@aria-label='saveNotes']");
    this.saveDasBtn = page.locator("xpath=//button[@data-testid='Save DAS']")
    this.saveDasCrpBtn = page.locator("xpath=//button[@data-testid='Save DAS-CRP']")

    this.divS1 = page.locator("xpath=//input[@id='divS1']")
    this.divS2 = page.locator("xpath=//input[@id='divS2']")
    this.divS3 = page.locator("xpath=//input[@id='divS3']")
    this.divS4 = page.locator("xpath=//input[@id='divS4']")
    this.divS5 = page.locator("xpath=//input[@id='divS5']")
    this.divS6 = page.locator("xpath=//input[@id='divS6']")
    this.divS7 = page.locator("xpath=//input[@id='divS7']")
    this.divS8 = page.locator("xpath=//input[@id='divS8']")
    this.divS9 = page.locator("xpath=//input[@id='divS9']")
    this.divS10 = page.locator("xpath=//input[@id='divS10']")
    this.divS11 = page.locator("xpath=//input[@id='divS11']")
    this.divS12 = page.locator("xpath=//input[@id='divS12']")
    this.divS13 = page.locator("xpath=//input[@id='divS13']")
    this.divS14 = page.locator("xpath=//input[@id='divS14']")
    this.divS15 = page.locator("xpath=//input[@id='divS15']")
    this.divS16 = page.locator("xpath=//input[@id='divS16']")
    this.divS17 = page.locator("xpath=//input[@id='divS17']")
    this.divS18 = page.locator("xpath=//input[@id='divS18']")
    this.divS19 = page.locator("xpath=//input[@id='divS19']")
    this.divS20 = page.locator("xpath=//input[@id='divS20']")
    this.divS21 = page.locator("xpath=//input[@id='divS21']")
    this.divS22 = page.locator("xpath=//input[@id='divS22']")
    this.divS23 = page.locator("xpath=//input[@id='divS23']")
    this.divS24 = page.locator("xpath=//input[@id='divS24']")
    this.divS25 = page.locator("xpath=//input[@id='divS25']")
    this.divS26 = page.locator("xpath=//input[@id='divS26']")
    this.divS27 = page.locator("xpath=//input[@id='divS27']")
    this.divS28 = page.locator("xpath=//input[@id='divS28']")

    this.divT1 = page.locator("xpath=//input[@id='divT1']")
    this.divT2 = page.locator("xpath=//input[@id='divT2']")
    this.divT3 = page.locator("xpath=//input[@id='divT3']")
    this.divT4 = page.locator("xpath=//input[@id='divT4']")
    this.divT5 = page.locator("xpath=//input[@id='divT5']")
    this.divT6 = page.locator("xpath=//input[@id='divT6']")
    this.divT7 = page.locator("xpath=//input[@id='divT7']")
    this.divT8 = page.locator("xpath=//input[@id='divT8']")
    this.divT9 = page.locator("xpath=//input[@id='divT9']")
    this.divT10 = page.locator("xpath=//input[@id='divT10']")
    this.divT11 = page.locator("xpath=//input[@id='divT11']")
    this.divT12 = page.locator("xpath=//input[@id='divT12']")
    this.divT13 = page.locator("xpath=//input[@id='divT13']")
    this.divT14 = page.locator("xpath=//input[@id='divT14']")
    this.divT15 = page.locator("xpath=//input[@id='divT15']")
    this.divT16 = page.locator("xpath=//input[@id='divT16']")
    this.divT17 = page.locator("xpath=//input[@id='divT17']")
    this.divT18 = page.locator("xpath=//input[@id='divT18']")
    this.divT19 = page.locator("xpath=//input[@id='divT19']")
    this.divT20 = page.locator("xpath=//input[@id='divT20']")
    this.divT21 = page.locator("xpath=//input[@id='divT21']")
    this.divT22 = page.locator("xpath=//input[@id='divT22']")
    this.divT23 = page.locator("xpath=//input[@id='divT23']")
    this.divT24 = page.locator("xpath=//input[@id='divT24']")
    this.divT25 = page.locator("xpath=//input[@id='divT25']")
    this.divT26 = page.locator("xpath=//input[@id='divT26']")
    this.divT27 = page.locator("xpath=//input[@id='divT27']")
    this.divT28 = page.locator("xpath=//input[@id='divT28']")

    this.healthState = page.locator("xpath=//input[@id='healthState']")
    this.esr = page.locator("xpath=//input[@id='esr']")
    this.crp = page.locator("xpath=//input[@id='crp']")
    this.tenderJointCount = page.locator("xpath=//input[@id='tenderJointCount']")
    this.swollenJointCount = page.locator("xpath=//input[@id='swollenJointCount']")

    // 3rd Tool
        this.circle8 = page.locator('svg:nth-child(8)')
    this.circle80 = page.locator('svg:nth-child(80)')
    this.circle87 = page.locator('svg:nth-child(87)')
    this.circle3 = page.locator('svg:nth-child(3)')
    this.tenderJointCount78 = page.locator("xpath=//input[@id='tenderJointCount78']")
    this.swollenJointCount78 = page.locator("xpath=//input[@id='swollenJointCount78']")

    //Patient View
    this.patientView = page.locator("xpath=//button[@data-testid='patientView']")
    this.allergyHistory = page.locator('div').filter({ hasText: /^Allergies1$/ }).getByLabel('patientHistoryIconButton');
    this.diagnosisHistory = page.locator('div').filter({ hasText: /^Diagnosis1$/ }).getByLabel('patientHistoryIconButton');
    this.procedureHistory = page.locator('div').filter({ hasText: /^Procedures2$/ }).getByLabel('patientHistoryIconButton');
    this.problemsHistory = page.locator('div').filter({ hasText: /^Current Problems and Symptoms1$/ }).getByLabel('patientHistoryIconButton');
    this.conditionHistory = page.locator('div').filter({ hasText: /^Conditions1$/ }).getByLabel('patientHistoryIconButton');
    this.medicationHistory = page.locator('div').filter({ hasText: /^Medications1$/ }).getByLabel('patientHistoryIconButton');
    this.deviceHistory = page.locator('div').filter({ hasText: /^Devices1$/ }).getByLabel('patientHistoryIconButton');
    this.investigationHistory = page.locator('div').filter({ hasText: /^Investigations1$/ }).getByLabel('patientHistoryIconButton');
    this.examinationHistory = page.locator('div').filter({ hasText: /^Examinations1$/ }).getByLabel('patientHistoryIconButton');
    this.lifestyleHistory = page.locator('div').filter({ hasText: /^Lifestyle1$/ }).getByLabel('patientHistoryIconButton');
    this.socialHistory = page.locator('div').filter({ hasText: /^Social Circumstances1$/ }).getByLabel('patientHistoryIconButton');
    this.riskHistory = page.locator('div').filter({ hasText: /^Risk Factors1$/ }).getByLabel('patientHistoryIconButton');
    this.testToolHistory = page.locator('div').filter({ hasText: /^Test\/Tools1$/ }).getByLabel('patientHistoryIconButton');
    this.interpretationHistory  = page.locator('div').filter({ hasText: /^Interpretations1$/ }).getByLabel('patientHistoryIconButton');
    this.recommendationHistory = page.locator('div').filter({ hasText: /^Recommendations1$/ }).getByLabel('patientHistoryIconButton');
    this.pregnancyHistory = page.locator('div').filter({ hasText: /^Pregnancies1$/ }).getByLabel('patientHistoryIconButton');

    this.allergyHistoryPopUp = page.getByRole('heading', { name: 'Allergies History', exact: true })
    this.diagnosisHistoryPopUp = page.getByRole('heading', { name: 'Diagnosis History', exact: true })
    this.procedureHistoryPopUp = page.getByRole('heading', { name: 'Procedures History', exact: true })
    this.problemsHistoryPopUp = page.getByRole('heading', { name: 'Current Problems and Symptoms' })
    this.conditionHistoryPopUp = page.getByRole('heading', { name: 'Conditions History', exact: true })
    this.medicationHistoryPopUp = page.getByRole('heading', { name: 'Medications History', exact: true })
    this.deviceHistoryPopUp = page.getByRole('heading', { name: 'Devices History', exact: true })
    this.investigationHistoryPopUp = page.getByRole('heading', { name: 'Investigations History', exact: true })
    this.examinationHistoryPopUp = page.getByRole('heading', { name: 'Examinations History', exact: true })
    this.lifestyleHistoryPopUp = page.getByRole('heading', { name: 'Lifestyle History', exact: true })
    this.socialHistoryPopUp = page.getByRole('heading', { name: 'Social Circumstances History', exact: true })
    this.riskHistoryPopUp = page.getByRole('heading', { name: 'Risk Factors History', exact: true })
    this.testToolHistoryPopUp = page.getByRole('heading', { name: 'Test/Tools History' })
    this.interpretationHistoryPopUp = page.getByRole('heading', { name: 'Interpretations History', exact: true })
    this.recommedationHistoryPopUp = page.getByRole('heading', { name: 'Recommendations History', exact: true })
    this.pregnancyHistoryPopUp = page.getByRole('heading', { name: 'Pregnancies History', exact: true })
}

//Riskfactor
async enterRiskFactorNotes(risk_notes)
{
  await this.RfNotes.clear();
  await this.RfNotes.type(risk_notes);
}
//Lifestyle
async enterLifestyleNotes(life_notes)
{
  await this.lifeStyleNotes.fill('')
  await this.lifeStyleNotes.type(life_notes);
}

//Social
async enterSocialNotes(soci_notes)
{
  await this.socialNotes.clear()
  await this.socialNotes.type(soci_notes);
}


  //////////////////////////////////TEXTBOX FILLERS//////////////////////////////////////////

  //Patient Alerts
  // async selectAlertsDaysDropdown(eli_text) {
  //   await selectFromDropdown(this.page, this.dropdownAlertDaysSelected, eli_text);
  // }

  async selectAlertsDaysDropdown()
    {
        await this.dropdownAlertDaysSelected.click()
        await this.page.locator("xpath=//li[@id='alertsDaysSelected-option-9']").click()
    }

    //Alert Priority
    async selectAnyPriorityDropdown(Priority_Any_Priority)
    {       
        await selectFromDropdown(this.page, this.dropdownPriority, Priority_Any_Priority);
    }

    async selectAnyHighDropdown(Priority_Very_High)
    {       
        await selectFromDropdown(this.page, this.dropdownPriority, Priority_Very_High);
    }

    //Alerts Display
    async selectAllDisplayDropdown(Display_All)
    {       
        await selectFromDropdown(this.page, this.dropdownDisplay, Display_All);
    }
    async selectMyAlertsDisplayDropdown(Display_My_Alerts)
    {       
        await selectFromDropdown(this.page, this.dropdownDisplay, Display_My_Alerts);
    }
    

  async enterAlertsStartdate(Alert_Start_Date)
  {
    await typeText(this.page, this.alertsStartDate, Alert_Start_Date);
  } 

  async enterAlertsEnddate(Alert_End_Date)
  {
    await typeText(this.page, this.alertsEndDate, Alert_End_Date);
  } 

  async selectForUser(For_User)
  {    
    await selectFromDropdown(this.page, this.dropdownForUser, For_User);
  }


  //Fill Outcome Date
  async enterDateOfOutcome(outc_date) {
    await typeText(this.page, this.dateOfOutcome, outc_date);
  }

  //Fill Ouutome Notes
  // async enterClinicalItemNotes(diag_notes) {
  //   //await typeText(this.page, this.diagnosisNotes, diag_notes);
  //   await this.diagnosisNotes.type(diag_notes)
  // }
  async enterMedicalCertificateNotes(patmce_notes)
  {
    //await this.medicalCertificateNotes.type(patmce_notes)
    await typeText(this.page, this.medicalCertificateNotes, patmce_notes);
  }

  async enterDiagnosisNotes(diag_notes) {
   // await this.diagnosisNotes.type(diag_notes)
    await this.diagnosisNotes.clear()
    await this.diagnosisNotes.type(diag_notes)
  }

  async enterInterpretationNotes(inte_notes) {
    // await this.diagnosisNotes.type(diag_notes)
     await this.interpretationNotes.type(inte_notes)
   }

  async enterDeleteReason(reason) {
    await typeText(this.page, this.deleteReason, reason);
  }

  /////////////////////////////////BUTTON CLICKS///////////////////////////////////////////////

  //Click on Collapsable button on Extra Details popup
  async clickOnClincialItemCollapsable() {
    await clickElement(this.page, this.clinicalItemCollapsable);
  }

  async clickOnClincialItemCollapsableAllergy1() {
    await clickElement(this.page, this.clinicalItemCollapsableAllergy1);
  }

  async clickOnClincialItemCollapsableAllergy2() {
    await clickElement(this.page, this.clinicalItemCollapsableAllergy2);
  }

  async clickOnclinicalSubcategoryAllergy() {
    await this.clinicalSubcategoryAllergy.click();
    await this.page.getByRole("option", { name: "Allergy Subsection" }).click();
  }

  async clickOnSpecificAllergyName() {
    await clickElement(this.page, this.buttonSpecificAllergyName);
  }

  async enterAllergyStartDate(date) {
    await typeText(this.page, this.allergyStartDate, date);
  }

  async enterAllergyEndDate(date) {
    await typeText(this.page, this.allergyEndDate, date);
  }
  async selectReaction(eli_text) {
    await selectFromDropdown(this.page, this.allergyReaction, eli_text);
  }
  async selectReactionSevirity(alrg_reaction_severity) {
    await selectFromDropdown(this.page,this.ReactionSeverity,alrg_reaction_severity);
  }
  async enterallergyTextArea(alrg_notes) {
    await typeText(this.page, this.allergyTextArea, alrg_notes);
  }

  //Pregnancy Methods


   async enterPregGravida(gravida)
  {
    await typeText(this.page, this.pregGravida, gravida);
  }

  async selectNoOfFetus(fetus_no)
  {
    await selectFromDropdown(this.page,this.pregFetusNo.nth(0), fetus_no)
  }
  async expandFetusDrawer()
  {
    await clickElement(this.page, this.pregExpandFirstFetus.nth(0))
  }
  async expandFetusDrawerSecond()
  {
    await clickElement(this.page, this.pregExpandSecondFetus)
  }
  async selectPregOutcome(outcome)
  {
    await selectFromDropdown(this.page,this.pregOutcome.nth(0), outcome)
  }
  async enterPregWeek(preg_week)
  {
    await typeText(this.page,this.pregGestWeek.nth(0), preg_week)
  }

  async enterGestationDays(gestation_days)
  {
      await typeText(this.page, this.pregGestDays.nth(0), gestation_days)
  }
  async selectDeliveryMethod(delivery_method)
  {
    await selectFromDropdown(this.page,this.pregDevliveryMethod.nth(0), delivery_method)
  }

  async enterDateOfDelivery(date)
  {
      await typeText(this.page, this.pregDateOfDelivery.nth(0), date)
  }
  async enterTimeOfDelivery(time)
  {
      await typeText(this.page, this.pregTimeOfDelivery.nth(0), time)
  }
  async enterweightOfBaby(weight)
  {
      await typeText(this.page, this.pregWeight.nth(0), weight)
  }
  async selectSexOfBaby(sex)
  {
    await selectFromDropdown(this.page,this.pregSex.nth(0), sex)
  }
  async enterBabyName(name)
  {
    await typeText(this.page, this.pregBabyName.nth(0), name)
  }
  async enterBirthPlace(birthplace)
  {
    await typeText(this.page, this.pregBirtPlace.nth(0), birthplace)
  }
  async selectFeedingMethod(feeding_method)
  {
    await selectFromDropdown(this.page,this.pregFeedingMethod.nth(0), feeding_method)
  }

  async selectSocialWorkerAssigned(worker_assigned)
  {
    await selectFromDropdown(this.page,this.pregSocialWorkAssigned.nth(0),worker_assigned )
  }
  async selectComplications(complications)
  {
    await selectFromDropdown(this.page,this.pregComplications.nth(0),complications )
  }
  async enterPregnancyNotes(notes)
  {
    await typeText(this.page, this.pregNotes.nth(0), notes)
  }
  async savePregnancy()
  {
    await clickElement(this.page, this.pregSave.nth(0))
  }

  async selectPregOutcome1(outcome1)
  {
    await selectFromDropdown(this.page,this.pregOutcome.nth(1), outcome1)
  }
  async enterPregWeek1(preg_week1)
  {
    await typeText(this.page,this.pregGestWeek.nth(1), preg_week1)
  }

  async enterGestationDays1(gestation_days1)
  {
      await typeText(this.page, this.pregGestDays.nth(1), gestation_days1)
  }
  async selectDeliveryMethod1(delivery_method1)
  {
    await selectFromDropdown(this.page,this.pregDevliveryMethod.nth(1), delivery_method1)
  }

  async enterDateOfDelivery1(date1)
  {
      await typeText(this.page, this.pregDateOfDelivery.nth(1), date1)
  }
  async enterTimeOfDelivery1(time1)
  {
      await typeText(this.page, this.pregTimeOfDelivery.nth(1), time1)
  }
  async enterweightOfBaby1(weight1)
  {
      await typeText(this.page, this.pregWeight.nth(1), weight1)
  }
  async selectSexOfBaby1(sex1)
  {
    await selectFromDropdown(this.page,this.pregSex.nth(1), sex1)
  }
  async enterBabyName1(name1)
  {
    await typeText(this.page, this.pregBabyName.nth(1), name1)
  }
  async enterBirthPlace1(birthplace1)
  {
    await typeText(this.page, this.pregBirtPlace.nth(1), birthplace1)
  }
  async selectFeedingMethod1(feeding_method1)
  {
    await selectFromDropdown(this.page,this.pregFeedingMethod.nth(1), feeding_method1)
  }

  async selectSocialWorkerAssigned1(worker_assigned1)
  {
    await selectFromDropdown(this.page,this.pregSocialWorkAssigned.nth(1),worker_assigned1 )
  }
  async selectComplications1(complications1)
  {
    await selectFromDropdown(this.page,this.pregComplications.nth(1),complications1 )
  }
  
  ///////////Procedure Functions////////////////////

  async enterDateOfProcedure(date) {
    await typeText(this.page, this.dateOfProcedure, date);
  }

  async selectProcedureType(proc_type) {
    await selectFromDropdown(this.page, this.procedureType, proc_type);
  }

  async selectProcedureSite(proc_site) {
    await selectFromDropdown(this.page, this.procedureSite, proc_site);
  }

  async selectProcedureLevel(proc_procedure_level) {
    await selectFromDropdown(this.page,this.procedureLevel,proc_procedure_level);
  }

  async selectProcedureStatus(pacr_status) 
  {
    await selectFromDropdown(this.page, this.procedureStatus, pacr_status);
  }

  async selectProcedureOutcome(proc_outcome) {
    await selectFromDropdown(this.page, this.procedureOutcome, proc_outcome);
  }

  async selectandAddPerformedByGP(HPName) {
    this.itemName = clinicalItemName;
    await selectFromSearchResults(this.page,this.performedByHP,HPName,this.addClinicalItem);
  }

  async selectLinkToClinicLocation(HPName) {
    this.itemName = clinicalItemName;
    await selectFromSearchResults(this.page,this.performedByHP,HPName,this.addClinicalItem);
  }

  async selectProcedureCheckboxSetAsDefault() {
    await this.procedureCheckBoxSetAsDefault.click();
  }

  async selectProcedureCheckboxPrivateRecord() {
    await this.procedureCheckboxPrivateRecord.click();
  }
  async enterProcedureNotes(proc_notes)
  {
    await this.procedureTextareaNotes.clear()
    await this.procedureTextareaNotes.type(proc_notes)
  }

  //Click on Save Medication button on Extra Details popup
  async clickOnSave() {
    await clickElement(this.page, this.save);
  }

  async clickOnSaveCheckList() {
    await clickElement(this.page, this.saveCheckList);
  }

  async clickOnSaveChecklistButton()
  {
    await this.saveCheckListButton.click()
  }

  async clickOnSavePortalChecklistButton()
  {
    await this.saveChecklistPortal.click()
  }

  async clickOnPortalSaveBtn() {
    await clickElement(this.page, this.savePortal)
  }

  async clickOnSaveExtraDetails() {
    await clickElement(this.page, this.saveExtraDetails);
  }

  async clickOnSaveEdCarePlan()
  {
    await this.saveEDCarePlan.click()
  }
  async clickonSaveAllergyED()
  {
    await this.saveAllergyED.click()
  }
  async clickOnsSaveandCreateLabRequest()
  {
    await clickElement(this.page, this.saveandCreateLabRequest)
  }

  async clickOnConditionExtraDetails()
  {
    await clickElement(this.page, this.saveConditionExtraDetails)
  }
  async clickOnSaveFavourites()
  {
    await this.saveFavourites.click()
  }

  async clickOnSaveExamFavourites()
  {
    await this.saveFavourites.click()
  }

  async clickOnSaveMediFavourites()
  {
    await this.saveFavourites.click()
  }



  async clickOnDelete() {
    await clickElement(this.page, this.delete);
  }

  async clickOnDeleteCertificate() {
    await clickElement(this.page, this.deleteCertificate);
  }

  async clickOnCancelDelete() {
    await clickElement(this.page, this.cancelDelete);
  }

  async clickOnConfirmDelete() {
    await clickElement(this.page, this.confirmDelete);
  }

  async clickOnSaveDeleteReason() {
    await clickElement(this.page, this.saveDeleteReason);
  }

   //Care Plan


   async searchAndSelectNursingDiagnosis(carpd_que_name) {
    await selectFromSearchResults(this.page,this.CarePlanNursingDiagnosis,carpd_que_name);
  }

  async EntersearchNursingDiagnosis0(carpd_notes_nursingDiagnosis)
  {
    await typeText(this.page, this.searchNursingDiagnosis0,carpd_notes_nursingDiagnosis)
  }

  async searchAndSelectSearchGoals(carpd_eli_text_goals) {
    await selectFromSearchResults(this.page,this.SearchGoals,carpd_eli_text_goals);
  }
  

  async EntersearchGoals0(carpd_notes_goals) {
    await typeText(this.page, this.searchGoals0,carpd_notes_goals)
    //await selectFromSearchResults(this.page,this.searchGoals0,carpd_notes_goals);
  }

  async EntersearchNursingDiagnosis0(carpd_notes_nursingDiagnosis)
  {
    await typeText(this.page, this.searchNursingDiagnosis0,carpd_notes_nursingDiagnosis)
  }

  async searchAndSelectInterventions(carpd_eli_text_interventions) {
    await selectFromSearchResults(this.page,this.Interventions,carpd_eli_text_interventions);
  }

  async EnterInterventions(carpd_notes_interventions) {
    //await selectFromSearchResults(this.page,this.searchInterventions0,carpd_notes_interventions);
    await typeText(this.page, this.searchInterventions0,carpd_notes_interventions)
  }


//searchEvaluations
async searchAndSelectsearchEvaluations(carpd_eli_text_evaluations) {
  await selectFromSearchResults(this.page,this.searchEvaluations,carpd_eli_text_evaluations);
}

async EnterEvaluations(carpd_notes_evaluations) {
 // await selectFromSearchResults(this.page,this.searchEvaluations0,carpd_notes_evaluations);
 await typeText(this.page, this.searchEvaluations0,carpd_notes_evaluations)
}

async EnterUpdateNotes(carpd_type_notes) {
 // await selectFromSearchResults(this.page,this.updatedNotesForExtraDetails,carpd_type_notes);
 await typeText(this.page, this.updatedNotesForExtraDetails,carpd_type_notes)
}


  ///////////////////////////////CHOOSE STATIC DROPDOWN ITEM//////////////////////////////////

  async selectClinicalItemSubcategory(subcategory) {
    await selectFromDropdown(this.page,this.clinicalItemSubcategory,subcategory);
  }

  async selectFrequency(outc_frequency) {
    await selectFromDropdown(this.page, this.frequency, outc_frequency);
  }

  async enterOnSetDate(date) {
    await typeText(this.page, this.onSetDate, date);
  }

  //Presenting Problems

  async clickOnestimatedDate() {
    await clickElement(this.page, this.estimatedDate);
  }
  async clickOnactualDate(){
    await clickElement(this.page, this.actualDate)
  }

  async selectProblemStatus(prp_status) {
    await selectFromDropdown(this.page, this.problemStatus, prp_status);
  }
  async selectProblemOnset(prp_onset) {
    await selectFromDropdown(this.page, this.problemOnset, prp_onset);
  }
  async selectProblemSeverity(prp_severity) {
    await selectFromDropdown(this.page, this.problemSeverity, prp_severity);
  }

  async enterOnsetDate(prp_date_of_onset)
    {
        await typeText(this.page, this.onsetDate, prp_date_of_onset);
    }
    async enterRating(prp_rating)
    {
        await typeText(this.page, this.problemRating,prp_rating );
    }
    async enterProblemNotes(prp_notes)
    {
      await this.problemNotes.type(prp_notes)
    }

    async clickPopup()
    {
      await this.closePopup.click()
    }

    async clickOnEdPopup(){
      await this.uploadFile.click()
      await this.closePopup.click()
      await this.addedDocument.click()
      await this.closePopup.click()
      await this.addToTask.click()
      await this.closePopup.click()
      await this.addToWorklist.click()
      await this.closePopup.click()
      await this.addPathway.click()
      await this.closePopup.click()
      await this.link.click()
      await this.closePopup.click()

  }
  
  //Overview

  async enterOverviewNotes(over_notes)
  {
    await this.overviewNotes.clear()
    await this.overviewNotes.type(over_notes)
  }
  async selectandAddOverview() {
    //this.itemName=clinicalItemName;
    await clickElement(this.page, this.addClinicalItem)
   // await this.addClinicalItem.click() 
}
 

    //Patient Scans

    async selectScanType(type)
    {
        await selectFromDropdown(this.page, this.scanType, type);
    }

    async selectScanArea(area)
    {
        await selectFromDropdown(this.page, this.scanArea, area );
    }

    async enterScanDate(date) {
      await typeText(this.page, this.scanDate, date);
  }
  async enterBmdScore(BMD) {
    await typeText(this.page, this.bmdScore,BMD );
}

async enterTScore(T) {
    await typeText(this.page, this.tScore,T );
}
async enterZScore(Z) {
    await typeText(this.page, this.zScore, Z);
}
async selectMachineName(mname)
{
    await selectFromDropdown(this.page, this.machineName, mname );
}
async enterPatientScanNotes(pascn_notes)
{
  await this.scanNotes.clear()
  await this.scanNotes.type(pascn_notes);
}
  //Medical Certificate
  // async clickOnConfirm() {
  //   await clickElement(this.page, this.confirm);
  // }

  // async selectLimitations(Limitation) {
  //   await selectFromDropdown(this.page, this.limitation, Limitation);
  // }

  // async enterLimitationAppliedDate(Date) {
  //   await typeText(this.page, this.limitationAppliedDate, Date);
  // }

  // async enterLimitationValidToDate(Date) {
  //   await typeText(this.page, this.limitationValid, Date);
  // }

  // async clickOnConsultedCAA()
  // {
  //   await clickElement(this.page, this.consultedCAA)
  // }
  // async enterReasonForLimitation(reasonForLimitation)
  // {
  //   await typeText(this.page, this.reasonForLimitation,reasonForLimitation)
  // }
  // async clickOnAddLimitationButton()
  // {
  //   await clickElement(this.page, this.btnAddLimitation)
  // }
  // async clickOnShowLimitationLink()
  // {
  //   await clickElement(this.page,this.linkShowLimitation)
  // }
  // async closeOnClosePopupButton()
  // {
  //   await clickElement(this.page,this.closeShowLimitationPopup)
  // }
  // async clickOnEditLimitationLink()
  // {
  //   await clickElement(this.page,this.linkEditLimitation)
  // }
  //Medical Certificate
  async enterReasonForDeletion(deletionReason)
  {
    await typeText(this.page, this.reasonForDeletion, deletionReason)
  }

  async clickOnConfirm() {
    await clickElement(this.page, this.confirm);
  }

  async selectLimitations(Limitation) {
    await selectFromDropdown(this.page, this.limitation, Limitation);
  }

  async enterLimitationAppliedDate(Date) {
    await typeText(this.page, this.limitationAppliedDate, Date);
  }

  async enterLimitationValidToDate(Date) {
    await typeText(this.page, this.limitationValid, Date);
  }

  async clickOnConsultedCAA()
  {
    await clickElement(this.page, this.consultedCAA)
  }
  async enterReasonForLimitation(reasonForLimitation)
  {
    await typeText(this.page, this.reasonForLimitation,reasonForLimitation)
  }
  async enterMedicalCertificateNotes(notes)
  {
    await typeText(this.page, this.notes, notes )
  }
  async enterMedicalCertificateNotes1(notes)
  {
    await typeText(this.page, this.MC1Notes, notes )
  }
  async clickOnAddLimitationButton()
  {
    await clickElement(this.page, this.btnAddLimitation)
  }
  async clickOnShowLimitationLink()
  {
    await clickElement(this.page,this.linkShowLimitation)
  }
  async closeOnClosePopupButton()
  {
    await clickElement(this.page,this.closeShowLimitationPopup)
  }
  async clickOnEditLimitationLink()
  {
    await clickElement(this.page,this.linkEditLimitation)
  }
  async enterLimitationReason(EditReason)
  {
    await typeText(this.page, this.textAreaLimitationReason,EditReason)
  }
  async enterLimicationRemoveReason(removalReason)
  {
    await typeText(this.page, this.removereasonForLimitation, removalReason)
  }
  async clickOnSaveDeleteForReason()
  {
    await clickElement(this.page, this.btnSaveReasonforDeletion)
  }
  async clickOnSaveEditedLimitation()
  {
    await clickElement(this.page, this.SaveEditedLimitation)
  }
  async deleteLimitation()
  {
    await clickElement(this.page, this.deleteLimitationButton)
  }
  async clickOnSaveMedicalCertificate()
  {
    await clickElement(this.page, this.btnSaveEditedMcCertificate)
  }
  async clickOnSaveRemovedLimitation()
  {
    await clickElement(this.page, this.saveRemovedLimitation)
  }
  async clickOnshowRemovedReasonlink()
  {
    await clickElement(this.page, this.showRemovedReasonlink)
  }
 
  async enterMedicalCertificateReason(reason)
  {
    await typeText(this.page, this.mcClassReason,reason)
  }

  async enterAMEDeclaration(declaration)
  {
    await typeText(this.page, this.txtareaAMEDeclaration, declaration)
  }

  async clickOnbtnAcknowledgeDeclaration()
  {
    await clickElement(this.page, this.btnAcknowledgeDeclaration)
  }

  async enterEditedMCNotes(editNotes)
  {
    await typeText(this.page, this.editMCNotes, editNotes)
  }

  async clickOnSaveEditedMedicalCertificate()
  {
    await clickElement(this.page, this.btnSaveEditedMcCertificate)
  }




  //Medication Extra Details
  async enterOnDose(dose) {
    await this.dose.clear();
   // await this.page.getByTestId('Ok').click()
    //await this.page.getByTestId('Ok').click()
    await typeText(this.page, this.dose, dose);
  }

  async enterOnDosewithOk(dose) {
    await this.dose.clear();
   // await this.page.getByTestId('Ok').click()
    await this.page.getByTestId('Ok').click()
    await typeText(this.page, this.dose, dose);
  }

  async selectRoute(Route) {
    await selectFromDropdown(this.page, this.Route, Route);
  }
  async enterForm(form)
  {
   await typeText(this.page, this.form, form);
  }

  async enterDays(days) {
    await typeText(this.page, this.days, days);
  }

  async selectSite(site) {
    await selectFromDropdown(this.page, this.site, site);
  }

  async selectPrescribeBy(prescribeBy) {
    await selectFromDropdown(this.page, this.prescribeBy, prescribeBy);
  }

  async enterStartDate(startDate) {
    await typeText(this.page, this.startDate, startDate);
  }
  async enterReviewDate(reviewDate) {
    await typeText(this.page, this.reviewDate, reviewDate);
  }

  async enterStopDate(medi_stop_date) {
    await typeText(this.page, this.stopDate, medi_stop_date);
  }

  async selectSideEffects(mse_text) {
    await selectFromDropdown(this.page, this.sideEffect, mse_text);
  }
  async selectStatus(pacr_status) {
    await selectFromDropdown(this.page, this.medicationStatus, pacr_status);
  }
  async selectIndication(meded_value) {
    await selectFromDropdown(this.page, this.indication, meded_value);
  }
  async selectStoppedReason(medi_stopped_reason_eli_text) {
    await selectFromDropdown(
      this.page,
      this.stopReason,
      medi_stopped_reason_eli_text
    );
  }
  async selectPGDPSD(meded_value_PGD) {
    await selectFromDropdown(this.page, this.PGDPSD, meded_value_PGD);
  }
  async enterMedicationGradeForAdministrator(medicationGradeForAdministrator) {
    await typeText(
      this.page,
      this.medicationGradeForAdministrator,
      medicationGradeForAdministrator
    );
  }
  async selectMaxReffills(maxReffills) {
    await selectFromDropdown(this.page, this.maxReffills, maxReffills);
  }
  async selectQuantity(meded_value_Quantity) {
    await this.quantity.clear();
    await typeText(this.page, this.quantity, meded_value_Quantity);
  }
  async enterUnit(unit) {
     await selectFromDropdown(this.page, this.units,'Days');
  }
  //  async enterUnit(unit) {
  //    await typeText(this.page, this.unit,'Days');
  // }

  async selectCurrentLocation(currentLocation) {
    await selectFromDropdown(this.page, this.currentLocation, currentLocation);
  }
  async enterLinkTiDiagnosis(pacr_que_name_Diagnosis) {
    await selectFromDropdown(this.page,this.linkToDiagnosis,pacr_que_name_Diagnosis);
  }
  async selectAdherent(meded_value_Adherent) {
    await selectFromDropdown(this.page, this.adherent, meded_value_Adherent);
  }
  async selectEndoserment(paprd_endorsement) {
    await selectFromDropdown(this.page, this.endoserment, paprd_endorsement);
  }

  async enterMedicationNotes(medi_notes)
  {
    await this.medicationNotes.type(medi_notes)
  }
  
  async selectForCondition(que_display_text) {
    // await this.forCondition.click()
    // await this.forCondition.type(que_display_text)
    // await this.page.getByRole('option', { name: que_display_text }).click()
    await selectFromDropdown(this.page, this.forCondition, que_display_text);

    //await selectFromDropdown(this.page, this.forCondition, que_display_text)
  }
  async enterPriceCheckQuantity(meded_value_Price_check_quantity) {
    await typeText(
      this.page,
      this.priceCheckQuantity,
      meded_value_Price_check_quantity
    );
  }
  async enterNotes(medi_notes) {
    await typeText(this.page, this.notes, medi_notes);
  }

  async enterEditDays(days) {
    await typeText(this.page, this.editDays, days);
  }

  async selectEditPrescribeBy(prescribeBy) {
    await selectFromDropdown(this.page, this.editPrescribed, prescribeBy);
  }

  async enterEditMedicationNotes(medi_notes){
    await typeText(this.page, this.popUpNotes, medi_notes);
  }

  //Methods for Medication Checkboxes
  async clickOnPrescribeAndSupply() {
    await this.prescribeAndSupply.click();
  }
  async clickOnSupply() {
    await this.supply.click();
  }
  async clickOnSuitableForDelivery() {
    await this.suitableForDelivery.click();
  }
  async clickOnAddToPrescribe() {
    await this.addToPrescription.click();
  }
  async clickOnSetAsDefault() {
    await this.setAsDefault.click();
  }
  async clickOnRepeatable() {
    await this.repeatable.click();
  }
  async clickOPrivateRecord() {
    await this.privateRecord.click();
  }

  async enterDiagnosedDate(date) {
    await typeText(this.page, this.diagnosedDate, date);
  }
  async enterDiagnosis1stSeenDate(date) {
    await typeText(this.page, this.diagnosis1stSeenDate, date);
  }
  async selectStatus(statusName) {
    await selectFromDropdown(this.page, this.status, statusName);
  }

  async selectSeverity(severityName) {
    await selectFromDropdown(this.page, this.severity, severityName);
  }
  async selectActivity(activityName) {
    await selectFromDropdown(this.page, this.activity, activityName);
  }
  async selectCountryOfDiagnosis(countryName) {
    await selectFromDropdown(this.page, this.countryOfDiagnosis, countryName);
  }

  async searchAndSelectUnderlayingCause(UnderlyingName) {
    await selectFromSearchResults(this.page,this.underlayingCause,UnderlyingName);
  }

  async searchAndSelectComplicationsAndDiagnosis(complicationsAndDagnosisName) {
    await selectFromSearchResults(
      this.page,
      this.complicationAndDiagnosis,
      complicationsAndDagnosisName
    );
  }
  async searchAndSelectExternalCause(externalCauseName) {
    await selectFromSearchResults(
      this.page,
      this.externalCause,
      externalCauseName
    );
  }
  async searchAndSelectLinktoProcedure(linkToProcedureName) {
    await selectFromSearchResults(
      this.page,
      this.linkToProcedure,
      linkToProcedureName
    );
  }

  //Recommendations
  async enterReviewDate(date) {
    await typeText(this.page, this.reviewDate, date);
  }

  //Interpretation
  async enterInterpretationOutcome(inte_outcome_eli_text) {
    await selectFromDropdown(
      this.page,
      this.interpretationOutcome,
      inte_outcome_eli_text
    );
  }

  //Physical Sign

  async addPhysicalSignButton()
  {
    await this.page.locator("xpath=//button[@data-testid='addPhysicalSignAccordion']").click()
  }

  async enterAirorOxygen(PSName, PSValue)
  {    
     await fillTextBoxByLabel(this.page, PSName, PSValue);   
  }

  

  //Investigation
  async selectInvStatus(status) {
    await selectFromDropdown(this.page,this.invStatus,status);
  }

  async selectInvOutstanding(outstanding)
  {
    await selectFromDropdown(this.page,this.invOutstanding,outstanding);
  }

  async selectInvReason(reason)
  {
    await selectFromDropdown(this.page,this.invReason,reason)
  }

  async enterInvResult(result)
  {
    await typeText(this.page, this.invResult, result);
  }

  async selectInvOutcome(outcome)
  {
    await selectFromDropdown(this.page,this.invOutcome,outcome)
  }

  async selectInvCritical(critical)
  {
    await selectFromDropdown(this.page,this.invCritical, critical)
  }
 
  async selectInvDiagnosisLink(diagnosis)
  {
    await selectFromDropdown(this.page,this.invLinkToDiagnosis, diagnosis)
  }

  async enterInvDateOfUpload(date)
  {
    await typeText(this.page,this.invDateOfUpload, date)
  }

  async enterInvCompletedDate(dateCompleted)
  {
    await typeText(this.page,this.invCompletedDate, dateCompleted)
  }

  async enterInvReviewDate(dateReview)
  {
    await typeText(this.page,this.invReviewDate, dateReview)
  }

  async selectInvPatLocation(location)
  {
    await selectFromDropdown(this.page,this.invPatCurrentLocation, location)
  }

  async selectInvPriority(priority)
  {
    await selectFromDropdown(this.page,this.invPriority, priority)
  }
  async selectRequestedBy(requested_by)
  {
  
  await selectFromSearchResults(this.page,this.invRequestedBy,requested_by);
  }

  async selectInvSendTo(sendTo)
  {
    await selectFromDropdown(this.page,this.invSendTo, sendTo)
  }

  async selectInvExtLocation(extLocation)
  {
    await selectFromDropdown(this.page,this.invExtLocation, extLocation)
  }

  async enterInvNotes(notes)
  {
    await typeText(this.page, this.invNotes, notes);
  }

  async clickShowSubtest()
  {
    await clickElement(this.page, this.invShowSubtest);
  }
  async enterCreatineValue(value1)
  {
    await typeText(this.page, this.invCratineValue, value1);
  }
  async enterUreaValue(value2)
  {
    await typeText(this.page, this.invUreaValue, value2);
  }

  async enterCreatineTarget(target1)
  {
    await typeText(this.page, this.invCreatineTarget, target1);
  }

  async enterUreaTarget(target2)
  {
    await typeText(this.page, this.invUreaTarget, target2);
  }

  async saveInvestigation()
  {
     await clickElement(this.page, this.invSave)
  }

  async selectForLabRequest()
  {
    await clickElement(this.page, this.invCheckLabRequest)
  }

  async deselectForLabRequest()
  {
    await clickElement(this.page, this.invUncheckLabRequest)
  }

  async selectForImagingRequest()
  {
    await clickElement(this.page, this.invCheckImagingRequest)
  }

  async deselectForImagingRequest()
  {
    await clickElement(this.page, this.invUncheckImagingRequest)
  }

  async selectShareOnPortal()
  {
    await clickElement(this.page, this.invUncheckShareOnPortal)
  }

  async deselectShareOnPortal()
  {
    await clickElement(this.page, this.invUncheckShareOnPortal)
  }
  async clickOnSaveCustomizableButton()
  {
    await clickElement(this.page,this.saveCategoryExtraDetails)
     // this.saveCustomizableViewbutton)
  }

  async selectlinks()
  {
    await clickElement(this.page, this.invLinks)
  }
  
  async ImagingRequestLink()
  {
    await clickElement(this.page,this.invImagingRequestLink)
  }
      
  async LabRequestLink()
  {
    await clickElement(this.page, this.invLabRequestLink)
  }
       async selectLabRequestCheckbox()
  {
    await clickElement(this.page, this.invAddLabRequestCheckbox)
  }
       async selectAddCreateLabRequest()
  {
    await clickElement(this.page, this.invAddCreateLabRequest)
  }
  
     async select()
      {
//div[contains(text(),'Create Imaging Request')]
      }
  async collectSampleCheckbox()
  {
    await clickElement(this.page, this.invSelectCheckbox)
  }
  async selectCollectSample()
  {
    await clickElement(this.page, this.invCollectSample)
  }
  async selectSendSample()
  {
    await clickElement(this.page, this.invSendSample)
  }
  async createImagingRequest()
  {
    await clickElement(this.page, this.createImgRequest)
  }
  async selectRequestedBy(requested_by)
  {
  
  await selectFromSearchResults(this.page,this.invRequestedBy,requested_by);
  }


  //Condition Methods.

  async enterConditionScore(score) {
    await this.conditionScore.fill(score);
}

async selectHaveYouStoppedAnyMedications(option) {
    // option should be either 'Yes' or 'No'
    await this.haveYouStoppedAnyMedications.click()
    await this.page.getByRole('option', { name: 'No' }).click()
}

async enterDateOfCondition(date) {
    await this.dateOfCondition.fill(date);
}

async enterPreviousCondition(condition) {
    await this.previousCondition.click()
    await this.page.getByRole('option', { name: 'No' }).click()

}

async enterCoditionNotes(cond_notes) {
    await this.conditionnotes.fill(cond_notes);
}

async clickSaveButton() {
    await this.saveButton.click();
}



  //Examination
  async SelectOutcome(exam_outcome)
    {
        await this.dropdownOutcome.click()
        await this.page.getByRole('option', { name: exam_outcome, exact: true }).click()
    }

 async EnterNotes(exam_notes)
    {
        await this.textareaNotes.fill(exam_notes)
    }

      //Devices
  async selectDeviceProcedure(procedure) {
      await selectFromDropdown(this.page, this.dropdownDeviceProcedure, procedure)
  }

  async selectManufacturer(manufacturer) {
    await selectFromDropdown(this.page, this.dropdownManufacturer, manufacturer)
  }

  async selectDeviceSubCategory(category) {
    await selectFromDropdown(this.page, this.dropdownDeviceSubCategory, category)
  }

  async enterDevice(device) {
    await this.txtSearchForDevice.click()
    await this.page.getByRole('option', { name: device }).first().click()
  }
  
  async selectTypeOfDevice(typeOfDevice) {
    await selectFromDropdown(this.page, this.dropdownTypeOfDevice, typeOfDevice)
  }

  async selectInternalOrExternal(internalExternal) {
    await selectFromDropdown(this.page, this.dropdownInternalExternal, internalExternal)
  }

  async selectDeviceStatus(status) {
    await selectFromDropdown(this.page, this.dropdownDeviceStatus, status)
  }

  async selectLaterality(laterality) {
    await selectFromDropdown(this.page, this.dropdownLaterality, laterality)
  }

  async selectSerialNumber(serialNo) {
    await typeText(this.page, this.txtDeviceSerialNumber, serialNo)
  }

  async enterDeviceExpiryDate(dateExpiry) {
    await typeText(this.page, this.txtDeviceExpiryDate, dateExpiry)
  }

  async enterDeviceNotes(notes) {
    await typeText(this.page, this.txtDeviceNotes, notes)
  }

  async clickOnSaveDevice() {
    await clickElement(this.page, this.btnSaveDevice);
  }

  async clickOnExtraDetailsView2() {
    await clickElement(this.page, this.extraDetailLevel2)
  }

  async clickOnExtraDetailsView3() {
    await clickElement(this.page, this.extraDetailLevel)
  }

  async clickOnEditDevice() {
    await clickElement(this.page, this.btnEditDevice)
  }

  async clickOnDeleteDevice() {
    await clickElement(this.page, this.btnDeleteDevice)
  }

  async clickOnOkPopup() {
    await clickElement(this.page, this.btnOkDevicePopup)
  }

  async enterDeleteDeviceReason(reason) {
    await typeText(this.page, this.txtDeleteDeviceReason, reason)
  }

  async clickOnSaveDeleteReason() {
    await clickElement(this.page, this.btnSaveDeleteReason)
  }

  async clickOnRequestLink() {
    await clickElement(this.page, this.linkRequestOrderStatus)
  }

  async clickOnRequestButton() {
    await clickElement(this.page, this.btnExternalRequest)
  }

  // Test Tool
  async enterTestDate(val){
    typeText(this.page, this.testDate, val)
  }
  async clickOnAirConduction(){
    clickElement(this.page, this.airConductionBtn)
  }

  async clickOnBoneConduction(){
    clickElement(this.page, this.boneConductionBtn)
  }

  async clickOnUnaidedSoundField(){
    clickElement(this.page, this.unaidedSoundFieldBtn)
  }

  async clickOnAidedSoundField(){
    clickElement(this.page, this.aidedSoundFieldBtn)
  }

  async selectAirConductionTestingMethods(val){
    await this.page.getByTestId('airConduction.testingMethods').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async selectAirConductionTransducerUsed(val){
    await this.page.getByTestId('airConduction.transducerUsed').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async selectAirConductionStimulusSignalType(val){
    await this.page.getByTestId('airConduction.stimulusSignalType').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async enterAirConductionReliability(val){
    await this.page.getByRole('textbox', { name: 'airConduction.reliability' }).fill(val);
  }

  async enterAirConductionNotes(val){
    await this.page.getByRole('textbox', { name: 'airConduction.notes' }).fill(val);
  }

  async selectBoneConductionTestingMethods(val){
    await this.page.getByTestId('boneConduction.testingMethods').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async selectBoneConductionStimulusSignalType(val){
    await this.page.getByTestId('boneConduction.stimulusSignalType').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async enterBoneConductionReliability(val){
    await this.page.getByRole('textbox', { name: 'boneConduction.reliability' }).fill(val);
  }

  async enterBoneConductionNotes(val){
    await this.page.getByRole('textbox', { name: 'boneConduction.notes' }).fill(val);
  }

  async selectUnaidedSoundFieldTestingMethods(val){
    await this.page.getByTestId('unaidedSoundField.testingMethods').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async selectUnaidedSoundFieldStimulusSignalType(val){
    await this.page.getByTestId('unaidedSoundField.stimulusSignalType').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async enterUnaidedSoundFieldReliability(val){
    await this.page.getByRole('textbox', { name: 'unaidedSoundField.reliability' }).fill(val);
  }

  async enterUnaidedSoundFieldNotes(val){
    await this.page.getByRole('textbox', { name: 'unaidedSoundField.notes' }).fill(val);
  }

  async selectAidedSoundFieldTestingMethods(val){
    await this.page.getByTestId('aidedSoundField.testingMethods').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async selectAidedSoundFieldStimulusSignalType(val){
    await this.page.getByTestId('aidedSoundField.stimulusSignalType').getByPlaceholder('Please Select').click();
    await this.page.getByRole('option', { name: val }).click();
  }

  async enterAidedSoundFieldReliability(val){
    await this.page.getByRole('textbox', { name: 'aidedSoundField.reliability', exact: true }).fill(val);
  }

  async enterAidedSoundFieldNotes(val){
    await this.page.getByRole('textbox', { name: 'aidedSoundField.notes', exact: true }).fill(val);
  }

  async clickOnSaveBtn(){
    clickElement(this.page, this.saveTestAndToolExtraDetailsBtn)
  }

  async selectSensoryPerception(ans){
    await selectFromDropdown(this.page, this.sensoryPerception, ans)
  }

  async selectMoisture(ans){
    await selectFromDropdown(this.page, this.moisture, ans)
  }

  async selectActivityTest(ans){
    await selectFromDropdown(this.page, this.activityTest, ans)
  }

  async selectMobility(ans){
    await selectFromDropdown(this.page, this.mobility, ans)
  }

  async selectNutrition(ans){
    await selectFromDropdown(this.page, this.nutrition, ans)
  }

  async selectFrictionAndShear(ans){
    await selectFromDropdown(this.page, this.frictionAndShear, ans)
  }

  async clickOnCalculateButton(){
    await clickElement(this.page, this.calculateButton)
  }

  async clickOnSaveTest(){
    await clickElement(this.page, this.saveTestButton)
  }

  async clickOnSaveTool(){
    await clickElement(this.page, this.saveDASToolButton)
  }

  async clickOnSaveDASCRPTool(){
    await clickElement(this.page, this.saveDASCRPToolButton)
  }

  async clickOnDeleteTestTool(){
    await clickElement(this.page, this.deleteTestToolButton)
  }

  async enterLastReviewedDate(lastReviewedDate) {
    await typeText(this.page, this.lastReviewedDate, lastReviewedDate);
  }

  async enterLastReviewed(lastReviewedDate) {
    await typeText(this.page, this.lastReviewedTool, lastReviewedDate);
  }

  async clickOnEditIcon(){
    await clickElement(this.page, this.editIcon)
  }

  async selectBmiScore(ans){
    await selectFromDropdown(this.page, this.bmiScore, ans)
  }

  async selectUnplannedWeightLoss(ans){
    await selectFromDropdown(this.page, this.unplannedWeightLoss, ans)
  }

  async selectNoNutritonalIntake(ans){
    await selectFromDropdown(this.page, this.noNutritialIntake, ans)
  }

  async selectRecentFalls(ans){
    await selectFromDropdown(this.page, this.recentFalls, ans)
  }

  async selectMedications(ans){
    await selectFromDropdown(this.page, this.medications, ans)
  }

  async selectPsycological(ans){
    await selectFromDropdown(this.page, this.psychological, ans)
  }

  async selectCognitiveStatus(ans){
    await selectFromDropdown(this.page, this.cognitiveStatus, ans)
  }

  async selectInterestOrPleasure(ans){
    await selectFromDropdown(this.page, this.interestOrPleasure, ans)
  }

  async selectDownOrDepressed(ans){
    await selectFromDropdown(this.page, this.downOrDepressed, ans)
  }

  async selectTroubleSleeping(ans){
    await selectFromDropdown(this.page, this.troubleSleeping, ans)
  }

  async selectTiredLittleEnergy(ans){
    await selectFromDropdown(this.page, this.tiredLittleEnergy, ans)
  }

  async selectPoorAppetite(ans){
    await selectFromDropdown(this.page, this.poorAppetite, ans)
  }

  async selectFeelingBadAboutYourself(ans){
    await selectFromDropdown(this.page, this.feelingBadAboutYourself, ans)
  }

  async selectTroubleConcentrating(ans){
    await selectFromDropdown(this.page, this.troubleConcentrating, ans)
  }
  
  async selectMovingSlowly(ans) {
    await this.page.getByRole('radio', { name: ans }).first().click();
  }

  async selectThoughtsOfDeath(ans) {
    await this.page.getByRole('radio', { name: ans }).nth(1).click();
  }

  //Tools
  async clickOnMarkerButton(){
    await clickElement(this.page, this.markerBtn)
  }

  async clickOnFirstMarker(){
    await this.page.getByRole('img', { name: 'markerWithBrown' }).click();
  }

  async enterMarkerNotes(notes){
    await typeText(this.page, this.markerNotes, notes)
  }

  async clickOnSaveNotes(){
    await clickElement(this.page, this.saveNotes)
  }
  
  async clickOnSwollen1(){
    await clickElement(this.page, this.divS1)
  }

  async clickOnSwollen2(){
    await clickElement(this.page, this.divS2)
  }

  async clickOnSwollen3(){
    await clickElement(this.page, this.divS3)
  }

  async clickOnSwollen4(){
    await clickElement(this.page, this.divS4)
  }

  async clickOnSwollen5(){
    await clickElement(this.page, this.divS5)
  }

  async clickOnTender1(){
    await clickElement(this.page, this.divT1)
  }

  async clickOnTender2(){
    await clickElement(this.page, this.divT2)
  }

  async clickOnTender3(){
    await clickElement(this.page, this.divT3)
  }

  async clickOnTender4(){
    await clickElement(this.page, this.divT4)
  }

  async clickOnTender5(){
    await clickElement(this.page, this.divT5)
  }

  async enterHealthState(val){
    await typeText(this.page, this.healthState, val)
  }

  async enterEsr(val){
    await typeText(this.page, this.esr, val)
  }

  async enterCrp(val){
    await typeText(this.page, this.crp, val)
  }

  async enterTender(val){
    await typeText(this.page, this.tenderJointCount, val)
  }

  async enterSwollen(val){
    await typeText(this.page, this.swollenJointCount, val)
  }

  async clickOnCircle1(){
    await clickElement(this.page, this.circle3)
  }

  async clickOnCircle2(){
    await clickElement(this.page, this.circle8)
  }

  async clickOnCircle3(){
    await clickElement(this.page, this.circle80)
  }

  async clickOnCircle4(){
    await clickElement(this.page, this.circle87)
  }

  async enterTender78(val){
    await typeText(this.page, this.tenderJointCount78, val)
  }

  async enterSwollen78(val){
    await typeText(this.page, this.swollenJointCount78, val)
  }

  //Patient View
  async togglePatientView(){
    await clickElement(this.page, this.patientView)
  }

  async clickOnAllergyHistoryBtn(){
    await clickElement(this.page, this.allergyHistory)
  }

  async clickOnDiagnosisHistoryBtn(){
    await clickElement(this.page, this.diagnosisHistory)
  }

  async clickOnProcedureHistoryBtn(){
    await clickElement(this.page, this.procedureHistory)
  }

  async clickOnProblemsHistoryBtn(){
    await clickElement(this.page, this.problemsHistory)
  }

  async clickOnConditionHistoryBtn(){
    await clickElement(this.page, this.conditionHistory)
  }

  async clickOnMedicationHistoryBtn(){
    await clickElement(this.page, this.medicationHistory)
  }

  async clickOnDeviceHistoryBtn(){
    await clickElement(this.page, this.deviceHistory)
  }

  async clickOnInvestigationHistoryBtn(){
    await clickElement(this.page, this.investigationHistory)
  }

  async clickOnExaminationHistoryBtn(){
    await clickElement(this.page, this.examinationHistory)
  }

  async clickOnLifestyleHistoryBtn(){
    await clickElement(this.page, this.lifestyleHistory)
  }

  async clickOnSocialHistoryBtn(){
    await clickElement(this.page, this.socialHistory)
  }

  async clickOnRiskHistoryBtn(){
    await clickElement(this.page, this.riskHistory)
  }

  async clickOnTestToolHistoryBtn(){
    await clickElement(this.page, this.testToolHistory)
  }

  async clickOnInterpretationHistoryBtn(){
    await clickElement(this.page, this.interpretationHistory)
  }

  async clickOnRecommendationHistoryBtn(){
    await clickElement(this.page, this.recommendationHistory)
  }

  async clickOnPregnancyHistoryBtn(){
    await clickElement(this.page, this.pregnancyHistory)
  }

  async checkPatientView(selectorName, selectorName2, popUpName) {

    const popUp = this.page.getByRole('heading', { name: popUpName, exact: true });
    const selector = this.page.getByTestId(selectorName);

    if(popUpName === 'Allergies History') {
      await this.clickOnAllergyHistoryBtn();
    } else if (popUpName === 'Diagnosis History'){
      await this.clickOnDiagnosisHistoryBtn();
    } else if (popUpName === 'Procedures History'){
      await this.clickOnProcedureHistoryBtn();
    } else if (popUpName === 'Current Problems and Symptoms History'){
      await this.clickOnProblemsHistoryBtn()
    } else if (popUpName === 'Conditions History'){
      await this.clickOnConditionHistoryBtn();
    } else if (popUpName === 'Medications History'){
      await this.clickOnMedicationHistoryBtn();
    } else if (popUpName === 'Devices History'){
      await this.clickOnDeviceHistoryBtn();
    } else if (popUpName === 'Investigations History'){
      await this.clickOnInvestigationHistoryBtn();
    } else if (popUpName === 'Examinations History'){
      await this.clickOnExaminationHistoryBtn();
    } else if (popUpName === 'Lifestyle History'){
      await this.clickOnLifestyleHistoryBtn();
    } else if (popUpName === 'Social Circumstances History'){
      await this.clickOnSocialHistoryBtn();
    } else if (popUpName === 'Risk Factors History'){
      await this.clickOnRiskHistoryBtn();
    } else if (popUpName === 'Test/Tools History'){
      await this.clickOnTestToolHistoryBtn();
    } else if (popUpName === 'Interpretations History'){
      await this.clickOnInterpretationHistoryBtn();
    } else if (popUpName === 'Recommendations History'){
      await this.clickOnRecommendationHistoryBtn();
    } else if (popUpName === 'Pregnancies History'){
      await this.clickOnPregnancyHistoryBtn();
    } else {
      console.log("Incorrect information entered")
    }

    await popUp.waitFor();

    const isPopupVisible = popUp.isVisible();
    const isSelectorVisible = selector.isVisible();
    console.log("\n");

    if(isPopupVisible) {
      console.log(popUpName + " Pop up is displayed")
      
      if(isSelectorVisible) {
        console.log("Entered information " + selectorName + " is displayed on Pop up")
      }

      if(selectorName2 != 'none') {
        const selector2 = this.page.getByTestId(selectorName);
        const isSelector2Visible = selector2.isVisible();

        if(isSelector2Visible) {
          console.log("Entered information " + selectorName2 + " is displayed on Pop up")
        }
      }
    }
    await this.page.waitForTimeout(1500)
    await this.closePopup.click();
  }
}

module.exports = ClinicalExtraDetails;
