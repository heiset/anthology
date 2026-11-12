// Google Apps Script Web App — receives flashcard usage logs via POST and
// appends rows to two sheets, "Sessions" and "Cards", in a Google Sheet you
// control. See README.md in this folder for the one-time deployment steps.

var SHEET_ID = "1cyKKqMQkms_YAN8H3pv3EHTvElAHWO9a-Ox-l2KJswM";

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.openById(SHEET_ID);

  var sessions = ss.getSheetByName("Sessions") || ss.insertSheet("Sessions");
  if (sessions.getLastRow() === 0) {
    sessions.appendRow(["loggedAt", "sessionId", "uid", "startedAt", "durationSeconds", "cardsViewed"]);
  }
  sessions.appendRow([
    new Date(),
    data.sessionId,
    data.uid,
    data.startedAt,
    data.durationSeconds,
    (data.cards || []).length
  ]);

  var cards = ss.getSheetByName("Cards") || ss.insertSheet("Cards");
  if (cards.getLastRow() === 0) {
    cards.appendRow(["loggedAt", "sessionId", "uid", "section", "type", "question", "secondsSpent", "flipped"]);
  }
  (data.cards || []).forEach(function (c) {
    cards.appendRow([
      new Date(),
      data.sessionId,
      data.uid,
      c.section,
      c.type,
      c.q,
      c.seconds,
      c.flipped
    ]);
  });

  return ContentService.createTextOutput("ok");
}
