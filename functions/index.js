/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// const functions = require("firebase-functions");

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const process = require("./process/process");
const cors = require("cors")({ origin: true });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.oasisReviewUpdate = onRequest(async (request, response) => {
  cors(request, response, async () => {
    logger.info("Hello logs!", { structuredData: true });
    const data = await process();
    response.send(data);
  });
});
