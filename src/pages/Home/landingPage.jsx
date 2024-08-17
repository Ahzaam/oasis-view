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
    // jsonData.forEach((question) => {dew
    //   question.answer = cityList.answers[question.code];
    // });

    answerList.map((answer) => {
      answer.visitTranscriptions = answer.visitTranscriptions
        ? JSON.parse(answer.visitTranscriptions)
        : null;

      answer.ClinicalAssessmentDynamicQuestions =
        answer.ClinicalAssessmentDynamicQuestions
          ? JSON.parse(answer.ClinicalAssessmentDynamicQuestions)
          : null;
    });

    setAnswers(answerList);
    return;
  }

  const navigateWithState = (answer) => {
    navigate("/answers", { state: { ...answer } });
  };

  useEffect(() => {
    getCities();
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onDoubleClick={() => navigateWithState(answer)}
          >
            <div className="p-4">
              <div className="text-gray-500 text-xs mb-2">{answer.docId}</div>
              <p className="text-gray-800 text-lg line-clamp-3">
                {answer.visitTranscriptions
                  ? answer.visitTranscriptions.Transcription
                  : "No Transcription"}
              </p>
            </div>
            <div className="bg-gray-200 py-2 px-4 text-gray-600 text-sm">
              DOUBLE CLICK TO REVIEW
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
