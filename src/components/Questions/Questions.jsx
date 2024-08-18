import React, { useEffect, useState } from "react";
import app from "../../firebase/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
const Questions = ({ questionData, docId }) => {
  const [conversation, setConversation] = useState("");
  const [narrative, setNarrative] = useState("");
  console.log(questionData);

  const [userChoices, setUserChoices] = useState({});
  const [questions, setQuestions] = useState(questionData);
  const [filtered, setFiltered] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  let [currentFilteredQuestions, setCurrentFilteredQuestions] = useState([]);
  // get all the unique sections
  const sections = [
    ...new Set(
      questionData.ClinicalAssessmentDynamicQuestions.map(
        (question) =>{
          console.log(question)
          question.section}
      )
    ),
  ];

  const oasisOpenAiCodes = [
    "A1110",
    "A1250",
    "B0200",
    "B1000",
    "B1300",
    "C0100",
    "C0200",
    "C0300",
    "C0400",
    "D0150",
    "D0700",
    "J0510",
    "J0520",
    "J0530",
    "J1800",
    "M1033",
    "M1046",
    "M1060",
    "M1100",
    "M1100",
    "M1400",
    "M2010",
    "M2020",
    "M2030",
    "M2301",
  ];

  const handleUserChoiceChange = (index, value) => {
    // set answer to question array
    let questionsCopy = { ...questions };
    questionsCopy.ClinicalAssessmentDynamicQuestions[index].newAnswer = value;
    setQuestions(questionsCopy);
  };

  const handleCommentChange = (index, value) => {
    // set comment to question array
    let questionsCopy = { ...questions };
    questionsCopy.ClinicalAssessmentDynamicQuestions[index].comments = value;
    setQuestions(questionsCopy);
  };

  const filterQuestions = (questions) => {
    setFiltered(true);
    setCurrentFilteredQuestions(questions);

    return questions.filter((question) => {
      // Check if the answer property is truthy (non-empty string, non-zero number, non-null value, etc.)
      return question.answer.length > 0;
    });
  };

  const showAllQuestions = () => {
    console.log(currentFilteredQuestions);
    setQuestions(currentFilteredQuestions);
    setFiltered(false);
  };
  const [selectedSections, setSelectedSections] = useState([]);

  const handleFilterChange = (section) => {
    if (section === "all-sections") {
      setSelectedSections(["all-sections"]);
      setQuestions(questionData);
      return;
    }

    const newSelectedSections = selectedSections.includes(section)
      ? selectedSections.filter((sec) => sec !== section)
      : [...selectedSections.filter((sec) => sec !== "all-sections"), section];

    setSelectedSections(newSelectedSections);

    if (newSelectedSections.length === 0) {
      setQuestions(questionData);
      setCurrentFilteredQuestions(questionData);
    } else {
      const newQuestions = questionData.ClinicalAssessmentDynamicQuestions.filter((question) =>
        newSelectedSections.includes(question.sectionDescription)
      );
      setQuestions({ ...questionData, ClinicalAssessmentDynamicQuestions: newQuestions });
      setCurrentFilteredQuestions({ ...questionData, ClinicalAssessmentDynamicQuestions: newQuestions });
    }
  };

  const saveAnswers = async () => {
    const answeredQuestions = questions;
    // log all that have newAnswer
    const db = getFirestore(app);
    const answersCol = collection(db, "reviewed-answers");
    const docRef = await addDoc(answersCol, {
      createdAt: new Date().toISOString(),
      questions: JSON.stringify(questions),
      narrative,
      docId,
    });
    console.log("Document written with ID: ", docRef.id);
    alert("Answers saved successfully");
  };
  const [totalAnswerCount, setTotalAnswerCount] = useState({
    model1: 0,
    model1_answer: 0,
    model2: 0,
    model2_answer: 0,
  });
  const getCounts = () => {
    const answerCount = {
      model1: 0,
      model1_answer: 0,
      model2: 0,
      model2_answer: 0,
    };

    setTotalAnswerCount(answerCount);
  };

  const getPercentage = (questions, filterFn) => {
    return (questions.filter(filterFn).length / questions.length) * 100;
  };

  const getColorClass = (percentage, inverse = false) => {
    if (inverse) percentage = 100 - percentage;
    if (percentage < 50) return "bg-red-500 text-white";
    if (percentage < 70) return "bg-yellow-400 text-gray-800";
    return "bg-green-500 text-white";
  };
  useEffect(() => {
    getCounts();
  }, []);

  return (
    <>
      <div
        className="container grid grid-cols-5 m-auto mt-10"
        onClick={() => setDropdown(false)}
      >
        <div className=" overflow-x-clip  col-span-3">
          {questions.ClinicalAssessmentDynamicQuestions.length === 0 && (
            <div className="text-2xl text-center text-red-900">
              No questions found, Try changing the filters
            </div>
          )}
          <div className="bg-[#f5f5f7] min-h-screen py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Patient Assessment Overview
              </h1>

              {/* Patient Information Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {questions.PatientDetails.FirstName}{" "}
                    {questions.PatientDetails.LastName}
                  </h2>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {questions.PatientDetails.Gender}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <p>
                    DOB:{" "}
                    {new Date(
                      questions.PatientDetails.Dob
                    ).toLocaleDateString()}
                  </p>
                  <p>Email: {questions.PatientDetails.EmailAddress}</p>
                  <p>SSN: {questions.PatientDetails.SSN}</p>
                  <p>
                    Diagnosis: {questions.PatientDetails.HistoricalDiagnosis}
                  </p>
                  <p>ICD Code: {questions.PatientDetails.HistoricalICDCodes}</p>
                  <p>Race: {questions.PatientDetails.Race}</p>
                  <p>Ethnicity: {questions.PatientDetails.Ethnicity}</p>
                  <p>Care Center ID: {questions.PatientDetails.CareCenterId}</p>
                  <p>
                    Service Type ID: {questions.PatientDetails.ServiceTypeId}
                  </p>
                </div>
              </div>

              {/* Question Statistics */}
              <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Assessment Questions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-100 rounded-lg shadow relative">
                    <h3 className="text-lg font-semibold mb-2">
                      Total Questions
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {questions.ClinicalAssessmentDynamicQuestions.length}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow relative">
                    <h3 className="text-lg font-semibold mb-2">
                      Answered Questions
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {
                        questions.ClinicalAssessmentDynamicQuestions.filter(
                          (question) =>
                            question.ClinicalAssessmentDynamicResults.length > 0
                        ).length
                      }
                    </p>
                    <div
                      className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${getColorClass(
                        getPercentage(
                          questions.ClinicalAssessmentDynamicQuestions,
                          (q) => q.ClinicalAssessmentDynamicResults.length > 0
                        )
                      )}`}
                    >
                      {getPercentage(
                        questions.ClinicalAssessmentDynamicQuestions,
                        (q) => q.ClinicalAssessmentDynamicResults.length > 0
                      ).toFixed(0)}
                      %
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow relative">
                    <h3 className="text-lg font-semibold mb-2">
                      Unanswered Questions
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {
                        questions.ClinicalAssessmentDynamicQuestions.filter(
                          (question) =>
                            question.ClinicalAssessmentDynamicResults.length ===
                            0
                        ).length
                      }
                    </p>
                    <div
                      className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${getColorClass(
                        getPercentage(
                          questions.ClinicalAssessmentDynamicQuestions,
                          (q) => q.ClinicalAssessmentDynamicResults.length === 0
                        ),
                        true
                      )}`}
                    >
                      {getPercentage(
                        questions.ClinicalAssessmentDynamicQuestions,
                        (q) => q.ClinicalAssessmentDynamicResults.length === 0
                      ).toFixed(0)}
                      %
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow relative">
                    <h3 className="text-lg font-semibold mb-2 text-green-600">
                      Human Reviewed
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {
                        questions.ClinicalAssessmentDynamicQuestions.filter(
                          (question) => question.newAnswer
                        ).length
                      }
                      /{questions.ClinicalAssessmentDynamicQuestions.length}
                    </p>
                    <div
                      className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${getColorClass(
                        getPercentage(
                          questions.ClinicalAssessmentDynamicQuestions,
                          (q) => q.newAnswer && q.newAnswer.length > 0
                        )
                      )}`}
                    >
                      {getPercentage(
                        questions.ClinicalAssessmentDynamicQuestions,
                        (q) => q.newAnswer && q.newAnswer.length > 0
                      ).toFixed(0)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {questions.ClinicalAssessmentDynamicQuestions.map(
            (question, index) => (
              <div
                key={index}
                className={
                  " collapse-1 bg-base-200 mb-4 my-3 rounded-lg shadow-md p-4"
                }
              >
                {/* <input type="checkbox" id={`toggle-${question.code}`} /> */}
                <div className="collapse-title-1 text-xl font-medium text-black">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="px-4 py-2 text-left font-semibold">
                            Model
                          </th>
                          <th className="px-4 py-2 text-left font-semibold">
                            Code
                          </th>
                          <th className="px-4 py-2 text-left font-semibold">
                            Section Description
                          </th>
                          <th className="px-4 py-2 text-left font-semibold">
                            Answer Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-300">
                          <td className=" py-2">
                            {
                              <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-lg">
                                LLM
                              </span>
                            }
                          </td>
                          <td className="px-4 py-2">{question.questionCode}</td>
                          <td className="px-4 py-2">{question.section}</td>
                          <td className="px-4 py-2">
                            {question.ClinicalAssessmentDynamicResults.length >
                            0 ? (
                              <span className="text-green-600 font-semibold">
                                Chosen Answer:
                                {
                                  question.ClinicalAssessmentDynamicResults[
                                    question.ClinicalAssessmentDynamicResults
                                      .length - 1
                                  ].response
                                }
                              </span>
                            ) : (
                              <span className="text-red-600 font-semibold">
                                No Answer Yet
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-2 text-black">
                  <div className="p-6 bg-white rounded-lg mx-3">
                    <p className="text-lg font-semibold text-gray-800">
                      {question.questionText}
                    </p>
                    <p>
                      <span className="font-semibold">Reason:</span>{" "}
                      {(question.reasons && question.reasons[index]) ||
                        "No reason found"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {question.answerType === "Array" &&
                      question.ClinicalAssessmentDynamicOptions && (
                        <div className="p-4">
                          {question.ClinicalAssessmentDynamicOptions.map(
                            (option, optionIndex) => (
                              <div
                                onClick={() => {
                                  const currentAnswers =
                                    question.newAnswer &&
                                    !Array.isArray(question.newAnswer)
                                      ? question.newAnswer.split(",")
                                      : question.newAnswer || [];
                                  console.log(index);
                                  if (
                                    currentAnswers.includes(
                                      optionIndex.toString()
                                    )
                                  ) {
                                    const newAnswers = currentAnswers.filter(
                                      (ans) => ans !== optionIndex.toString()
                                    );

                                    handleUserChoiceChange(index, newAnswers);

                                    return;
                                  } else {
                                    handleUserChoiceChange(
                                      index,
                                      currentAnswers.concat(
                                        optionIndex.toString()
                                      )
                                    );
                                  }

                                  // if (
                                  //   !question.ClinicalAssessmentDynamicResults
                                  // ) {
                                  //   const answerArray =
                                  //     question.newAnswer ||
                                  //     question.options.map(
                                  //       (option) => option.value
                                  //     );
                                  //   answerArray[optionIndex] =
                                  //     !answerArray[optionIndex];
                                  //   handleUserChoiceChange(index, answerArray);
                                  // } else {
                                  //   const answerArray = question.newAnswer || [
                                  //     ...question.options.map(
                                  //       (option) => option.value
                                  //     ),
                                  //   ];
                                  //   answerArray[optionIndex] =
                                  //     !answerArray[optionIndex];
                                  //   handleUserChoiceChange(index, answerArray);
                                  // }
                                }}
                                className={`flex items-center p-4 rounded-lg shadow-md mb-2 cursor-pointer transition-colors duration-300 ${
                                  question.newAnswer &&
                                  question.newAnswer.includes(
                                    optionIndex.toString()
                                  )
                                    ? "bg-green-300"
                                    : question.answer &&
                                      question.answer.split(",")[
                                        optionIndex
                                      ] === true
                                    ? "bg-yellow-100"
                                    : "bg-white"
                                }`}
                                key={`${index}-${optionIndex}`}
                              >
                                <div className="flex items-center h-5">
                                  <input
                                    readOnly
                                    type="checkbox"
                                    checked={question.ClinicalAssessmentDynamicResults[
                                      question.ClinicalAssessmentDynamicResults
                                        .length - 1
                                    ].response
                                      .split(",")
                                      .includes(optionIndex.toString())}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                </div>
                                <div className="ml-3 text-sm leading-5">
                                  {option.label}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    {question.answerType === "Option" &&
                      question.ClinicalAssessmentDynamicOptions && (
                        <div className="m-3">
                          {question.ClinicalAssessmentDynamicOptions.map(
                            (option, optionIndex) => (
                              <div
                                className=" bg-white rounded-lg shadow-md mb-4 cursor-pointer"
                                key={`${index}-${optionIndex}`}
                              >
                                <div
                                  onClick={() => {
                                    handleUserChoiceChange(index, optionIndex);
                                  }}
                                  className={
                                    (question.newAnswer ==
                                    optionIndex.toString()
                                      ? "bg-green-300"
                                      : question
                                          .ClinicalAssessmentDynamicResults[
                                          question
                                            .ClinicalAssessmentDynamicResults
                                            .length - 1
                                        ].response == optionIndex.toString()
                                      ? "bg-yellow-200"
                                      : "") +
                                    " p-4 rounded-lg transition-colors duration-300"
                                  }
                                >
                                  {option.label}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    {question.answerType === "String" && (
                      <div className="my-auto w-full ">
                        <textarea
                          placeholder="Comments"
                          className="w-full p-3 mt-2 border-gray-200 rounded-md"
                          rows={7}
                          value={
                            question.ClinicalAssessmentDynamicResults[
                              question.ClinicalAssessmentDynamicResults.length -
                                1
                            ].response || ""
                          }
                        ></textarea>
                      </div>
                    )}
                    {/* ... other question types */}
                    <div className="p-4">
                      {/* input for answer */}
                      <input
                        type="text"
                        className="w-full p-3 border-gray-200 rounded-md"
                        placeholder="Enter your answer"
                        value={question.newAnswer}
                        onChange={(e) =>
                          handleUserChoiceChange(index, e.target.value)
                        }
                      />
                      {/* text area */}
                      <div className="my-auto w-full ">
                        <textarea
                          placeholder="Comments"
                          className="w-full p-3 mt-2 border-gray-200 rounded-md"
                          rows={5}
                          value={question.comments || ""}
                          onChange={(e) =>
                            handleCommentChange(index, e.target.value)
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="p-4 w-2/5 fixed top-0 right-0 mt-24 bg-white border-l rounded-lg shadow-lg flex justify-center items-center">
        <div>
          <div className="mb-5 flex">
            <div className="relative mr-2">
              {/* Filter Dropdown */}
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>Filter</span>
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`${
                  dropdown ? "block" : "hidden"
                } absolute z-10 w-64 mt-2 bg-white rounded-md shadow-lg`}
              >
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <div
                      onClick={() => handleFilterChange("all-sections")}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <input
                        readOnly
                        checked={selectedSections.includes("all-sections")}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900">
                        All Sections
                      </label>
                    </div>
                  </li>
                  {sections.map((section, index) => (
                    <li key={index}>
                      <div
                        onClick={() => handleFilterChange(section)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        <input
                          readOnly
                          checked={selectedSections.includes(section)}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-900">
                          {section}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() =>
                filtered
                  ? showAllQuestions()
                  : setQuestions(filterQuestions(questions))
              }
            >
              {filtered ? "Show All" : "Skip Blank"}
            </button>

            {/* Save Answers Button */}
            <button
              onClick={() => saveAnswers()}
              className="px-4 py-2 ml-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save Answers
            </button>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto " style={{ height: "70vh" }}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Conversation:</h3>
              <p>
                {questions.visitTranscriptions.Narrative ||
                  "No conversation found"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Narrative:</h3>
              <p>
                {questions.visitTranscriptions.Narrative ||
                  "No narrative found"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questions;

// <div className="mb-5 flex">
// <div className="relative mr-2">
//   {/* Filter Dropdown */}
//   <button
//     onClick={() => setDropdown(!dropdown)}
//     className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <span>Filter</span>
//     <svg
//       className="w-4 h-4 ml-2"
//       aria-hidden="true"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M19 9l-7 7-7-7"
//       />
//     </svg>
//   </button>

//   <div
//     className={`${
//       dropdown ? "block" : "hidden"
//     } absolute z-10 w-64 mt-2 bg-white rounded-md shadow-lg`}
//   >
//     <ul className="py-1 text-sm text-gray-700">
//       <li>
//         <div
//           onClick={() => handleFilterChange("all-sections")}
//           className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
//         >
//           <input
//             readOnly
//             checked={selectedSections.includes("all-sections")}
//             type="checkbox"
//             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label className="ml-2 text-sm font-medium text-gray-900">
//             All Sections
//           </label>
//         </div>
//       </li>
//       {sections.map((section, index) => (
//         <li key={index}>
//           <div
//             onClick={() => handleFilterChange(section)}
//             className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
//           >
//             <input
//               readOnly
//               checked={selectedSections.includes(section)}
//               type="checkbox"
//               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label className="ml-2 text-sm font-medium text-gray-900">
//               {section}
//             </label>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// </div>

// {/* Toggle Button */}
// <button
//   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//   onClick={() =>
//     filtered
//       ? showAllQuestions()
//       : setQuestions(filterQuestions(questions))
//   }
// >
//   {filtered ? "Show All" : "Skip Blank"}
// </button>

// {/* Save Answers Button */}
// <button
//   onClick={() => saveAnswers()}
//   className="px-4 py-2 ml-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
// >
//   Save Answers
// </button>
// </div>
