// start processing in db

const { get } = require("firebase/database");
const { createDoc, checkScheduleExists } = require("../db/firestore");
const {
  getAllSchedules,
  getVisitByScheduleId,
  getTranscription,
  getPatientDetails
} = require("./oasis.helper");

async function processDB() {
  try {
    const schedules = await getAllSchedules();
    const writed = [];
    for (let i = 0; i < schedules[0].length; i++) {
      console.log(schedules[0][i].ScheduledId);
      // HEKBI
      if (await checkScheduleExists(schedules[0][i].ScheduledId)) {
        continue;
      }

      const visitTemplate = await getVisitByScheduleId(
        schedules[0][i].ScheduledId,
        32
      );

      visitTemplate.ClinicalAssessmentDynamicQuestions = JSON.stringify(
        visitTemplate.ClinicalAssessmentDynamicQuestions
      );
      visitTemplate.visitTranscriptions = JSON.stringify(
        await getTranscription(schedules[0][i].ScheduledId)
      );

      visitTemplate.patientDetails = JSON.stringify(
        await getPatientDetails(visitTemplate.PatientId)
      );

      if (visitTemplate.processType === null) {
        const writeFirestores = await createDoc(
          { data: null },
          schedules[0][i].ScheduledId
        );
        continue;
      }

      const writeFirestore = await createDoc(
        visitTemplate,
        schedules[0][i].ScheduledId
      );

      writed.push(visitTemplate);
    }

    return writed;
  } catch (e) {
    console.log(e);
  }
}

module.exports = processDB;
