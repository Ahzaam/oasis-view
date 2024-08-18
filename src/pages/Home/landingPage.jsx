import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [answers, setAnswers] = useState([]);
  const [selectedClinician, setSelectedClinician] = useState("");
  const navigate = useNavigate();

  // Get a list of cities from your database
  async function getCities() {
    const db = getFirestore(app);
    const answersCol = collection(db, "OasisResults");
    const answerSnapshot = await getDocs(answersCol);
    const answerList = answerSnapshot.docs.map((doc) => {
      return { ...doc.data(), docId: doc.id };
    });
    answerList.map((answer) => {
      answer.showReview = false;
      answer.oldReviews = [];
    });

    // sort by docId number
    answerList.sort((a, b) => {
      return a.docId - b.docId;
    });

    answerList.map((answer) => {
      answer.visitTranscriptions = answer.visitTranscriptions
        ? JSON.parse(answer.visitTranscriptions)
        : null;

      answer.ClinicalAssessmentDynamicQuestions =
        answer.ClinicalAssessmentDynamicQuestions
          ? JSON.parse(answer.ClinicalAssessmentDynamicQuestions)
          : null;

      answer.PatientDetails = answer.PatientDetails
        ? JSON.parse(answer.PatientDetails)
        : null;

      answer.PractitionerDetails = answer.PractitionerDetails
        ? JSON.parse(answer.PractitionerDetails)
        : null;
    });

    // take only questions that have ClinicalAssessmentDynamicQuestions

    setAnswers(
      answerList.filter((answer) => answer.ClinicalAssessmentDynamicQuestions)
    );
    return;
  }

  const navigateWithState = (answer) => {
    navigate("/answers", { state: { ...answer } });
  };

  useEffect(() => {
    getCities();
  }, []);

  // Get a list of unique clinicians
  const uniqueClinicians = Array.from(
    new Set(
      answers.map(
        (answer) =>
          `${answer.PractitionerDetails.FirstName} ${answer.PractitionerDetails.LastName}`
      )
    )
  );

  const filteredAnswers = selectedClinician
    ? answers.filter(
        (answer) =>
          `${answer.PractitionerDetails.FirstName} ${answer.PractitionerDetails.LastName}` === selectedClinician
      )
    : answers;

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Completed Schedules
        </h1>
        <div className="mb-4">
          <label htmlFor="clinicianFilter" className="block text-sm font-medium text-gray-700">
            Filter by Clinician:
          </label>
          <select
            id="clinicianFilter"
            name="clinicianFilter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedClinician}
            onChange={(e) => setSelectedClinician(e.target.value)}
          >
            <option value="">All</option>
            {uniqueClinicians.map((clinician, index) => (
              <option key={index} value={clinician}>
                {clinician}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnswers.map((answer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onDoubleClick={() => navigateWithState(answer)}
            >
              <div className="bg-gray-100 p-4 flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  #{answer.docId}
                </span>
                <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                  {answer.PatientDetails.Gender}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    {answer.PatientDetails.FirstName}{" "}
                    {answer.PatientDetails.LastName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    DOB:{" "}
                    {new Date(answer.PatientDetails.Dob).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Patient Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>Email: {answer.PatientDetails.EmailAddress}</p>
                    <p>
                      Diagnosis: {answer.PatientDetails.HistoricalDiagnosis}
                    </p>
                    <p>ICD Code: {answer.PatientDetails.HistoricalICDCodes}</p>
                    <p>Race: {answer.PatientDetails.Race}</p>
                    <p>Ethnicity: {answer.PatientDetails.Ethnicity}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Practitioner
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-lg font-medium text-blue-800 mb-1">
                      Dr. {answer.PractitionerDetails.FirstName}{" "}
                      {answer.PractitionerDetails.LastName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                      <p>ID: {answer.PractitionerDetails.PractitionerId}</p>
                      <p>
                        Role: {answer.PractitionerDetails.PractitionerRoleId}
                      </p>
                      <p>Email: {answer.PractitionerDetails.Email}</p>
                      <p>
                        Care Center: {answer.PractitionerDetails.CareCenterId}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Transcription
                  </h3>
                  <p className="text-gray-700 line-clamp-3">
                    {answer.visitTranscriptions
                      ? answer.visitTranscriptions.Transcription
                      : "No Transcription Available"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 py-3 px-6 text-center">
                <span className="text-sm font-medium text-gray-600">
                  Double click to review
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
