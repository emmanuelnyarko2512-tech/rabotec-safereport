/**
 * Rabotec SafeReport — Google Apps Script Backend
 * ─────────────────────────────────────────────────
 * Deployment settings:
 *   Execute as : Me
 *   Who has access : Anyone
 *
 * Sheet name must be exactly: Reports
 */

var SHEET_NAME = 'Reports';

var HEADERS = [
  'id', 'timestamp', 'department', 'workArea',
  'incidentDate', 'incidentTime', 'shift',
  'severity', 'hazardTypes', 'description',
  'conditions', 'actionsTaken',
  'observerName', 'badgeNo', 'contact',
  'supervisorNotified', 'status'
];

// ─────────────────────────────────────────────────
//  doPost — handles all write operations
// ─────────────────────────────────────────────────
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  // Ensure headers row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ status: 'error', message: 'Invalid JSON' });
  }

  // ── UPDATE STATUS ──────────────────────────────
  if (body.action === 'updateStatus') {
    var data      = sheet.getDataRange().getValues();
    var headers   = data[0];
    var idCol     = headers.indexOf('id');
    var statusCol = headers.indexOf('status');

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === String(body.id)) {
        sheet.getRange(i + 1, statusCol + 1).setValue(body.status);
        return respond({ status: 'ok' });
      }
    }
    return respond({ status: 'error', message: 'Row not found' });
  }

  // ── DELETE ROW ─────────────────────────────────
  if (body.action === 'deleteRow') {
    var data2    = sheet.getDataRange().getValues();
    var headers2 = data2[0];
    var idCol2   = headers2.indexOf('id');

    for (var j = 1; j < data2.length; j++) {
      if (String(data2[j][idCol2]) === String(body.id)) {
        sheet.deleteRow(j + 1);
        return respond({ status: 'ok' });
      }
    }
    return respond({ status: 'error', message: 'Row not found' });
  }

  // ── NEW REPORT SUBMISSION ──────────────────────
  // Deduplicate: skip if this report ID already exists
  if (sheet.getLastRow() > 1) {
    var idColIdx   = HEADERS.indexOf('id');
    var existingIds = sheet
      .getRange(2, idColIdx + 1, sheet.getLastRow() - 1, 1)
      .getValues()
      .map(function(r) { return String(r[0]); });

    if (existingIds.indexOf(String(body.id)) !== -1) {
      // Duplicate — silently acknowledge without writing
      return respond({ status: 'ok', note: 'duplicate ignored' });
    }
  }

  // Append new row
  var row = HEADERS.map(function(h) { return body[h] || ''; });
  sheet.appendRow(row);
  return respond({ status: 'ok' });
}

// ─────────────────────────────────────────────────
//  doGet — returns all reports as JSON
// ─────────────────────────────────────────────────
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data  = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return respond([]);
  }

  var headers = data[0];
  var records = data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });

  return respond(records);
}

// ─────────────────────────────────────────────────
//  Helper
// ─────────────────────────────────────────────────
function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
