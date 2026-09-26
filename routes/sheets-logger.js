const { google } = require("googleapis");

// ---------------------------------------------------------------
// Logs every order as a new row in a Google Sheet. This survives
// server restarts/redeploys because it lives on Google's servers,
// unlike data/orders.json which lives on the host's disk.
//
// Required environment variables (see README for setup steps):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL   e.g. blankloom-orders@your-project.iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY             the service account's private key
//   GOOGLE_SHEET_ID                the long id from the sheet's URL
//
// If these aren't set, order logging to Sheets is silently skipped —
// email + the local orders.json file continue to work as before.
// ---------------------------------------------------------------

const SHEET_TAB_NAME = "Orders";
const HEADER_ROW = ["Order ID", "Date", "Name", "Mobile", "Email", "Address", "City", "State", "Pincode", "Items", "Total", "Notes"];

function isConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

function getAuthClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

  // Strip accidental surrounding quotes (common when pasting into some
  // dashboards or .env files).
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  // Render (and most hosts) store multi-line env vars with literal "\n" —
  // convert those back into real newlines. Also normalize any Windows-style
  // \r\n that may have crept in from copy/pasting on Windows, since Node's
  // crypto decoder rejects keys with CRLF line endings.
  privateKey = privateKey.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
}

async function ensureHeaderRow(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB_NAME}!A1:L1`
  });

  const hasHeader = res.data.values && res.data.values.length > 0;
  if (!hasHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER_ROW] }
    });
  }
}

async function appendOrderToSheet(order) {
  if (!isConfigured()) {
    console.warn("Google Sheets logging skipped — GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_SHEET_ID not set.");
    return;
  }

  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  await ensureHeaderRow(sheets, spreadsheetId);

  const itemsSummary = order.items
    .map(i => `${i.name} (${i.code}) x${i.qty} @₹${i.price}`)
    .join("; ");

  const row = [
    order.orderId,
    order.createdAt,
    order.name,
    order.mobile,
    order.email || "",
    order.address,
    order.city,
    order.state,
    order.pincode,
    itemsSummary,
    order.total,
    order.notes || ""
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_TAB_NAME}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] }
  });
}

module.exports = { appendOrderToSheet, isConfigured };
