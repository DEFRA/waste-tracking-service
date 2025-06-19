function sendMovementData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var row = cell.getRow();

  // Adjust these indices if your columns are in a different order (A=1, B=2, ...)
  var values = sheet.getRange(row, 2, 1, 24).getValues()[0];

  // Map the values to your JSON structure
  var movement = {
    receivingSiteId: values[0],
    receiverReference: values[1],
    specialHandlingRequirements: values[2],
    waste: [
      {
        ewcCode: values[3],
        description: values[4],
        form: values[5],
        containers: values[6],
        quantity: {
          value: parseFloat(values[7]),
          unit: values[8],
          isEstimate: values[9].toString().toLowerCase() === "true"
        }
      }
    ],
    carrier: {
      registrationNumber: values[10],
      organisationName: values[11],
      address: values[12],
      emailAddress: values[13],
      companiesHouseNumber: values[14],
      phoneNumber: values[15],
      vehicleRegistration: values[16],
      meansOfTransport: values[17]
    },
    acceptance: {
      acceptingAll: values[18].toString().toLowerCase() === "true"
      // Add quantityNotAccepted and rejectionReason if needed
    },
    receiver: {
      authorisationType: values[21],
      authorisationNumber: values[22],
      regulatoryPositionStatement: values[23]
    },
    receipt: {
      estimateOrActual: values[24],
      dateTimeReceived: values[25]
      // Add disposalOrRecoveryCode if you have more columns
    }
  };

  // Convert to JSON
  var jsonData = JSON.stringify({ movement: movement }, null, 2);

  // Show the JSON in a dialog (for testing)
  // SpreadsheetApp.getUi().alert(jsonData);

  // To send to an API, use UrlFetchApp.fetch() here
  // Example:
  var response = UrlFetchApp.fetch('https://f90d9240-ff3e-49b9-a342-41f83456db97.mock.pstmn.io/movements/receive', {
    method: 'post',
    contentType: 'application/json',
    payload: jsonData
  });

 var responseText = response.getContentText();

// If the response is JSON, you can parse it:
var responseJson = JSON.parse(responseText);

// Example: show the response in a dialog
SpreadsheetApp.getUi().alert(responseText);

}

function showCurrentRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var row = cell.getRow();
  var lastCol = sheet.getLastColumn();
  var values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

  // Get headers from row 1
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  // Build a message with header: value pairs
  var message = '';
  for (var i = 0; i < headers.length; i++) {
    message += headers[i] + ': ' + values[i] + '\n';
  }

  // Show the message in a modal dialog
  SpreadsheetApp.getUi().alert('Movement Data', message, SpreadsheetApp.getUi().ButtonSet.OK);
}



function onEdit(e) {
  var sheet = e.range.getSheet();
  var editedRow = e.range.getRow();
  if (editedRow < 2) {
  
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();

  // Remove previous highlights (from all rows, columns A to last)
  sheet.getRange(2, 1, lastRow-1, lastCol).setBackground(null);

  // Highlight the edited row (columns A to last)
  sheet.getRange(editedRow, 1, 1, lastCol).setBackground('#FFF2CC'); // light yellow
  }
}

