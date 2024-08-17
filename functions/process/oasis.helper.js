const sequelizeConnection = require("../db/sequelize");
async function getAllSchedules() {
  try {
    const schedules = await sequelizeConnection.query(
      "SELECT * FROM Schedule  WHERE AutomyndTemplate = 'OASIS-E' AND ScheduledStatusId IN (1, 6);"
    );

    return schedules;
  } catch (e) {
    console.error("Error executing getAllSchedules:", e.message);
    console.error("Stack Trace:", e.stack);
    throw e; // Optionally rethrow the error if needed elsewhere
  }
}
async function getVisitByScheduleId(scheduleId, templateId) {
  try {
    const query = `
      SELECT 
          T.id AS TemplateId,
          T.[type] AS TemplateType,
          T.processType AS TemplateProcessType,
          Q.id AS QuestionId,
          Q.[section] AS QuestionSection,
          Q.questionText AS QuestionText,
          Q.questionType AS QuestionType,
          Q.answerType AS AnswerType,
          Q.code AS QuestionCode,
          Q.Hint AS QuestionHint,
          O.id AS OptionId,
          O.label AS OptionLabel,
          R.AssessmentResultId,
          R.ScheduledId,
          R.VisitId,
          R.Response AS AnswerResponse,
          R.CreatedDatetime AS ResultCreatedDatetime,
          R.ModifiedDatetime AS ResultModifiedDatetime,
          R.Reason AS ResultReason
      FROM 
          [sqldb-vst-dev-eastus-001].dbo.ClinicalAssessmentDynamicTemplate T
          INNER JOIN [sqldb-vst-dev-eastus-001].dbo.ClinicalAssessmentDynamicQuestions Q ON T.id = Q.clinicalAssessmentDynamicId
          LEFT JOIN [sqldb-vst-dev-eastus-001].dbo.ClinicalAssessmentDynamicOptions O ON Q.id = O.questionId
          INNER JOIN [sqldb-vst-dev-eastus-001].dbo.ClinicalAssessmentDynamicResults R ON Q.id = R.QuestionId
      WHERE 
          R.ScheduledId = :scheduleId
          AND R.TemplateId = :templateId
          AND R.Active = 1
      ORDER BY 
          Q.[section], Q.id, O.id;
    `;

    const results = await sequelizeConnection.query(query, {
      replacements: { scheduleId, templateId },
      type: sequelizeConnection.QueryTypes.SELECT,
    });

    // Transform results into the desired structure
    const formattedResult = {
      id: results[0]?.TemplateId || null,
      type: results[0]?.TemplateType || null,
      processType: results[0]?.TemplateProcessType || null,
      ClinicalAssessmentDynamicQuestions: [],
    };

    const questionMap = {};

    results.forEach((row) => {
      if (!questionMap[row.QuestionId]) {
        questionMap[row.QuestionId] = {
          id: row.QuestionId,
          clinicalAssessmentDynamicId: row.TemplateId,
          section: row.QuestionSection,
          questionText: row.QuestionText,
          questionType: row.QuestionType,
          questionCode: row.QuestionCode,
          answerType: row.AnswerType,
          code: row.code,
          ClinicalAssessmentDynamicOptions: [],
          ClinicalAssessmentDynamicResults: [],
        };

        formattedResult.ClinicalAssessmentDynamicQuestions.push(
          questionMap[row.QuestionId]
        );
      }

      if (row.OptionId) {
        questionMap[row.QuestionId].ClinicalAssessmentDynamicOptions.push({
          id: row.OptionId,
          label: row.OptionLabel,
        });
      }

      if (row.AssessmentResultId) {
        questionMap[row.QuestionId].ClinicalAssessmentDynamicResults.push({
          assessmentResultId: row.AssessmentResultId,
          scheduledId: row.ScheduledId,
          templateId: row.TemplateId,
          visitId: row.VisitId,
          questionId: row.QuestionId,
          response: row.AnswerResponse,
          reason: row.Reason,
          active: true,
          createdDatetime: row.ResultCreatedDatetime,
          createdBy: row.CreatedBy,
          modifiedDatetime: row.ResultModifiedDatetime,
          modifiedBy: row.ModifiedBy,
        });
      }
    });

    return formattedResult;
  } catch (e) {
    console.log(e);
    throw e; // Re-throw the error for further handling if needed
  }
}

async function getTranscription(scheduleId) {
  try {
    const visit = await sequelizeConnection.query(
      `SELECT * FROM Visit WHERE ScheduledId = ${scheduleId}`
    );
    if (!visit[0]?.length) {
      return;
    }
    const transcription = await sequelizeConnection.query(
      `SELECT * FROM VisitTranscriptions WHERE VisitId = ${visit[0][0].VisitId}`
    );
    // hello
    console.log(transcription[0][0]);
    return transcription[0][0];
  } catch (e) {
    console.log(e);
  }
}


async function getPatientDetails(patientId) {

  try {
    const patient = await sequelizeConnection.query(
      `SELECT * FROM Patients WHERE PatientId = ${patientId}`
    );
    return patient[0][0];
  }
  catch (e) {
    console.log(e);
  } 
}




async function getOasisQuestions(scheduleId) {
  try {
    const questions = await sequelizeConnection.query(
      `SELECT * FROM oasis_e WHERE visit_id = ${scheduleId}`
    );

    return questions;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getAllSchedules, getVisitByScheduleId, getTranscription , getPatientDetails};
