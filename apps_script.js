/**
 * Grambytes Nexus — Data Analytics Mentor / Trainer Application Backend
 * Paste this code into Extensions -> Apps Script inside the Google Sheet connected to your form.
 */

// CONFIGURATION
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Leave blank if script is bound to the sheet itself
var SHEET_NAME = "Form Responses 1"; // Make sure this matches your sheet's tab name
var UPLOAD_FOLDER_NAME = "Nexus_Applicant_Resumes"; // Folder in Google Drive to store uploaded resumes

/**
 * Handle incoming HTTP POST requests from the website form.
 */
function doPost(e) {
  try {
    // Parse incoming data
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Bad Request: Payload is missing or malformed.");
    }
    
    var payload = JSON.parse(e.postData.contents);
    
    // Server-side validation
    if (!payload.email || !payload.fullName || !payload.consentConfirm) {
      throw new Error("Validation Failed: Required fields are missing.");
    }

    // Open target sheet
    var sheet = getTargetSheet();
    
    // Fetch existing column headers (first row)
    var headersRange = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn()));
    var sheetHeaders = headersRange.getValues()[0];
    
    // If sheet is completely empty, initialize headers based on incoming payload keys
    if (sheetHeaders.length === 1 && sheetHeaders[0] === "") {
      sheetHeaders = initializeSheetHeaders(sheet);
    }

    // Handle File Uploads (Resume / CV) if present
    var resumeUrl = "";
    if (payload.resume && payload.resume.base64) {
      resumeUrl = saveFileToDrive(payload.resume);
    } else if (typeof payload.resume === "string") {
      resumeUrl = payload.resume; // fallback if already a URL
    }

    // Map payload attributes to Sheet headers
    var rowData = new Array(sheetHeaders.length);
    var timestamp = new Date();

    // Map fields dynamically based on column header matching
    for (var i = 0; i < sheetHeaders.length; i++) {
      var header = sheetHeaders[i].toString().trim();
      
      if (header.toLowerCase() === "timestamp") {
        rowData[i] = timestamp;
      } else if (header === "Email") {
        rowData[i] = sanitizeInput(payload.email);
      } else if (header === "Full Name") {
        rowData[i] = sanitizeInput(payload.fullName);
      } else if (header === "Mobile Number") {
        rowData[i] = sanitizeInput(payload.mobileNumber);
      } else if (header === "Email Address") {
        rowData[i] = sanitizeInput(payload.emailAddress || payload.email);
      } else if (header === "Current Location / City") {
        rowData[i] = sanitizeInput(payload.location);
      } else if (header === "Total Experience in Data Analytics") {
        rowData[i] = sanitizeInput(payload.totalExperience);
      } else if (header === "Preferred Work Mode") {
        rowData[i] = sanitizeInput(payload.workMode);
      } else if (header === "Preferred Engagement Type") {
        rowData[i] = sanitizeInput(payload.engagementType);
      } else if (header === "Current / Previous Job Role") {
        rowData[i] = sanitizeInput(payload.currentJobRole);
      } else if (header === "Current / Previous Company") {
        rowData[i] = sanitizeInput(payload.currentCompany);
      } else if (header === "Previous Work Experience") {
        rowData[i] = sanitizeInput(payload.previousExperience);
      } else if (header === "Current Employment Status") {
        rowData[i] = sanitizeInput(payload.employmentStatus);
      } else if (header === "Which tools/technologies are you comfortable teaching?") {
        rowData[i] = sanitizeInput(Array.isArray(payload.teachingTools) ? payload.teachingTools.join(", ") : payload.teachingTools);
      } else if (header === "Rate your overall Data Analytics expertise") {
        rowData[i] = sanitizeInput(payload.analyticsExpertise);
      } else if (header === "Have you worked on real-world Data Analytics projects?") {
        rowData[i] = sanitizeInput(payload.realWorldProjects);
      } else if (header === "Portfolio / LinkedIn / GitHub") {
        rowData[i] = sanitizeInput(payload.portfolioUrl);
      } else if (header === "Have you previously taught, trained, or mentored students?") {
        rowData[i] = sanitizeInput(payload.priorTeaching);
      } else if (header === "If Yes, briefly describe your teaching/training experience.") {
        rowData[i] = sanitizeInput(payload.teachingDescription);
      } else if (header === "Upload your latest Resume / CV") {
        rowData[i] = resumeUrl;
      } else if (header === "When can you start?") {
        rowData[i] = sanitizeInput(payload.startDate);
      } else if (header === "Preferred Traning Availability") {
        rowData[i] = sanitizeInput(Array.isArray(payload.trainingAvailability) ? payload.trainingAvailability.join(", ") : payload.trainingAvailability);
      } else if (header === "Why do you want to join Grambytes Nexus as a Data Analytics Mentor/Trainer?") {
        rowData[i] = sanitizeInput(payload.reasonToJoin);
      } else if (header === "Consent") {
        rowData[i] = sanitizeInput(payload.consentConfirm ? "Confirmed" : "Not Confirmed");
      } else {
        rowData[i] = ""; // Keep other unmapped columns blank
      }
    }

    // Append data row to sheet
    sheet.appendRow(rowData);

    // Return success JSON (CORS is handled automatically by Google webapps)
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Application submitted successfully."
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Submission Error: " + error.toString());
    // Return error JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle HTTP OPTIONS request if needed
 */
function doOptions(e) {
  return ContentService.createTextOutput("");
}

/**
 * Securely retrieve the spreadsheet. If SPREADSHEET_ID configuration is omitted, 
 * binds automatically to the active spreadsheet containing the Apps Script.
 */
function getTargetSheet() {
  var ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID_HERE") {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error("Unable to locate Google Spreadsheet. Please configure SPREADSHEET_ID.");
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0]; // Fallback to first tab
  }
  
  if (!sheet) {
    throw new Error("Unable to locate Sheet tab name: " + SHEET_NAME);
  }

  return sheet;
}

/**
 * Initialize headers in a fresh blank spreadsheet to match incoming columns.
 */
function initializeSheetHeaders(sheet) {
  var defaultHeaders = [
    "Timestamp",
    "Email",
    "Full Name",
    "Mobile Number",
    "Email Address",
    "Current Location / City",
    "Total Experience in Data Analytics",
    "Preferred Work Mode",
    "Preferred Engagement Type",
    "Current / Previous Job Role",
    "Current / Previous Company",
    "Previous Work Experience",
    "Current Employment Status",
    "Which tools/technologies are you comfortable teaching?",
    "Rate your overall Data Analytics expertise",
    "Have you worked on real-world Data Analytics projects?",
    "Portfolio / LinkedIn / GitHub",
    "Have you previously taught, trained, or mentored students?",
    "If Yes, briefly describe your teaching/training experience.",
    "Upload your latest Resume / CV",
    "When can you start?",
    "Preferred Traning Availability",
    "Why do you want to join Grambytes Nexus as a Data Analytics Mentor/Trainer?",
    "Consent"
  ];
  sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
  return defaultHeaders;
}

/**
 * Helper to upload a base64 file to Google Drive and return its public URL.
 */
function saveFileToDrive(fileObj) {
  try {
    var folder = getOrCreateFolder(UPLOAD_FOLDER_NAME);
    
    // Parse the Base64 raw data
    var fileData = Utilities.base64Decode(fileObj.base64);
    var blob = Utilities.newBlob(fileData, fileObj.mimeType, fileObj.filename);
    
    // Save to Google Drive
    var file = folder.createFile(blob);
    
    // Set permission so recruiting managers can view the document via link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (err) {
    throw new Error("File Upload Failed: " + err.toString());
  }
}

/**
 * Find or create a specific folder in Google Drive.
 */
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Input sanitization to prevent Spreadsheet Formula Injection.
 * Prepends a single quote to strings starting with '=', '+', '-', or '@'.
 */
function sanitizeInput(value) {
  if (value === null || value === undefined) {
    return "";
  }
  
  var strVal = value.toString();
  if (strVal.length > 0) {
    var firstChar = strVal.charAt(0);
    // Formula characters
    if (firstChar === '=' || firstChar === '+' || firstChar === '-' || firstChar === '@') {
      return "'" + strVal;
    }
  }
  return strVal;
}
