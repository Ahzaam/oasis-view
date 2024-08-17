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
import PreviousMap from "postcss/lib/previous-map";

const PreviousReview = () => {
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const getOldReviewsFireStore = async () => {
    const db = getFirestore(app);
    const oldReviewsCol = collection(db, "reviewed-answers");
    const oldReviewsSnapshot = await getDocs(oldReviewsCol);
    const oldReviewsList = oldReviewsSnapshot.docs.map((doc) => {
      return { ...doc.data(), docId: doc.id };
    });
    return oldReviewsList;
  };

  const getOldReviews = () => {
    getOldReviewsFireStore().then((oldReviews) => {
      // sort by createdAt
      oldReviews.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAnswers(oldReviews);
    });
  };

  const navigateToOldReview = (answer) => {
    navigate("/old-answers", { state: { ...answer } });
  };

  useEffect(() => {
    getOldReviews();
  }, []);
  return (
    <div className="bg-stone-200 p-4 h-screen">
      <h1 className="text-2xl text-center mb-4">Previous Reviews</h1>
      <div className="container mx-auto">
        {answers.map((answer, index) => (
          <div key={index} className="my-4">
            <div
              onDoubleClick={() => {
                navigateToOldReview(answer);
              }}
              className="bg-white m-3 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500 text-sm">{answer.createdAt}</p>
                <p className="text-sm text-gray-500">DOUBLE CLICK TO REVIEW</p>
              </div>
              <p className="text-lg">{answer.narrative.substring(0, 250)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousReview;
