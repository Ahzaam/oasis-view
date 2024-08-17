const admin = require("firebase-admin");

admin.initializeApp();

const firestore = admin.firestore();

async function createDoc(data, scheduledId) {
  console.log("Data", data);
  try {
    const docRef = firestore
      .collection("OasisResults")
      .doc(scheduledId.toString());
    await docRef.set(data);
    console.log("Document created successfully!");
  } catch (error) {
    console.error("Error creating document: Schedule", scheduledId, error);
  }
}

async function checkScheduleExists(scheduledId) {
  const docRef = firestore
    .collection("OasisResults")
    .doc(scheduledId.toString());
  const doc = await docRef.get();
  console.log("Document exists: ", doc.exists);
  return doc.exists;
}

module.exports = { createDoc, checkScheduleExists };
