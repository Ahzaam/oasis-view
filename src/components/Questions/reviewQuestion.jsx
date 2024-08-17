import React, { useEffect, useState } from "react";
import app from "../../firebase/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
const ReviewQuestions = () => {
  let { state } = useLocation();
  const questionData = JSON.parse(state.answers);
  console.log(state);
  const [questions, setQuestions] = useState(questionData);
  const [filtered, setFiltered] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [currentFilteredQuestions, setCurrentFilteredQuestions] = useState([]);
  const [answerCount, setAnswerCount] = useState({
    model1: 0,
    model1_answer: 0,
    model2: 0,
    model2_answer: 0,
  });

  // get all the unique sections
  const sections = [
    ...new Set(questionData.map((question) => question.sectionDescription)),
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
  function checkCode(code) {
    return oasisOpenAiCodes.some((prefix) => code.startsWith(prefix));
  }

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
      const newQuestions = questionData.filter((question) =>
        newSelectedSections.includes(question.sectionDescription)
      );
      setQuestions(newQuestions);
      setCurrentFilteredQuestions(newQuestions);
    }
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

    questionData.forEach((question) => {
      if (checkCode(question.code)) {
        answerCount.model2++;
        if (question.answer.length > 0) {
          console.log(answerCount.model2_answer);
          answerCount.model2_answer++;
        }
      } else {
        answerCount.model1++;
        if (question.answer.length > 0) {
          answerCount.model1_answer++;
        }
      }
    });

    setTotalAnswerCount(answerCount);
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
          {questions.length === 0 && (
            <div className="text-2xl text-center text-red-900">
              No questions found, Try changing the filters
            </div>
          )}
          <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
            {/* Model Questions */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow relative">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Total Questions
                  </h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {questions.length}
                  </p>
                </div>
              </div>
              {totalAnswerCount.model1 > 0 && (
                <div className="p-4 bg-white rounded-lg shadow relative">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Model 1 Questions
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {totalAnswerCount.model1_answer}/{totalAnswerCount.model1}
                    </p>
                  </div>
                  <div
                    className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${
                      (totalAnswerCount.model1_answer /
                        totalAnswerCount.model1) *
                        100 <
                      50
                        ? "bg-red-500 text-white"
                        : (totalAnswerCount.model1_answer /
                            totalAnswerCount.model1) *
                            100 <
                          70
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {(
                      (totalAnswerCount.model1_answer /
                        totalAnswerCount.model1) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              )}

              {totalAnswerCount.model2 > 0 && (
                <div className="p-4 bg-white rounded-lg shadow relative">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Model 2 Questions
                    </h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {totalAnswerCount.model2_answer}/{totalAnswerCount.model2}
                    </p>
                  </div>
                  <div
                    className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${
                      (totalAnswerCount.model2_answer /
                        totalAnswerCount.model2) *
                        100 <
                      50
                        ? "bg-red-500 text-white"
                        : (totalAnswerCount.model2_answer /
                            totalAnswerCount.model2) *
                            100 <
                          70
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {(
                      (totalAnswerCount.model2_answer /
                        totalAnswerCount.model2) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              )}
            </div>

            {/* Question Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow relative">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Answered Questions
                  </h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {
                      questions.filter((question) => question.answer.length > 0)
                        .length
                    }
                  </p>
                </div>
                <div
                  className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${
                    (questions.filter((question) => question.answer.length > 0)
                      .length /
                      questions.length) *
                      100 <
                    50
                      ? "bg-red-500 text-white"
                      : (questions.filter(
                          (question) => question.answer.length > 0
                        ).length /
                          questions.length) *
                          100 <
                        70
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {(
                    (questions.filter((question) => question.answer.length > 0)
                      .length /
                      questions.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow relative">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Unanswered Questions
                  </h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {
                      questions.filter(
                        (question) => question.answer.length === 0
                      ).length
                    }
                  </p>
                </div>
                <div
                  className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${
                    (questions.filter(
                      (question) => question.answer.length === 0
                    ).length /
                      questions.length) *
                      100 <
                    50
                      ? "bg-green-500 text-white"
                      : (questions.filter(
                          (question) => question.answer.length === 0
                        ).length /
                          questions.length) *
                          100 <
                        70
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {(
                    (questions.filter(
                      (question) => question.answer.length === 0
                    ).length /
                      questions.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow relative">
                <div>
                  <h3 className="text-green-500  text-lg font-semibold mb-2">
                    Human Reviewed
                  </h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {
                      questions.filter(
                        (question) =>
                          question.newAnswer && question.newAnswer.length > 0
                      ).length
                    }
                    /{questions.length}
                  </p>
                </div>
                <div
                  className={`absolute bottom-2 right-2 text-lg font-bold rounded-full px-3 py-1 ${
                    (questions.filter((question) => question.answer.length > 0)
                      .length /
                      questions.length) *
                      100 <
                    50
                      ? "bg-red-500 text-white"
                      : (questions.filter(
                          (question) =>
                            !question.newAnswer && question.newAnswer.length > 0
                        ).length /
                          questions.length) *
                          100 <
                        70
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {(
                    (questions.filter(
                      (question) =>
                        question.newAnswer && question.newAnswer.length > 0
                    ).length /
                      questions.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
            </div>
          </div>
          {questions.map((question, index) => (
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
                          {checkCode(question.code) ? (
                            <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-lg">
                              MODEL 2
                            </span>
                          ) : (
                            <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-lg">
                              MODEL 1
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">{question.code}</td>
                        <td className="px-4 py-2">
                          {question.sectionDescription}
                        </td>
                        <td className="px-4 py-2">
                          {question.answer.length > 0 ? (
                            <span className="text-green-600 font-semibold">
                              Chosen Answer: {question.answer}
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {question.type === "checkboxgroup" && question.options && (
                    <div className="p-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          className={`flex items-center p-4 rounded-lg shadow-md mb-2 cursor-pointer transition-colors duration-300 ${
                            question.newAnswer &&
                            question.newAnswer[optionIndex] === true
                              ? "bg-green-100"
                              : question.answer &&
                                question.answer[optionIndex] === true
                              ? "bg-yellow-100"
                              : "bg-white"
                          }`}
                          key={`${index}-${optionIndex}`}
                        >
                          <div className="flex items-center h-5">
                            <input
                              readOnly
                              type="checkbox"
                              checked={
                                question.answer
                                  ? question.answer[optionIndex]
                                  : false
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-5">
                            {option.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {question.type === "codeinput" && question.options && (
                    <div className="m-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          className=" bg-white rounded-lg shadow-md mb-4 cursor-pointer"
                          key={`${index}-${optionIndex}`}
                        >
                          <div
                            className={
                              (question.newAnswer == option.value
                                ? "bg-green-300"
                                : option.value == question.answer
                                ? "bg-yellow-200"
                                : "") +
                              " p-4 rounded-lg transition-colors duration-300"
                            }
                          >
                            {option.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {question.type === "input" && (
                    <div className="form-control">
                      {question.scoringKey ? (
                        <div className="m-3 cursor-pointer">
                          {question.scoringKey.options.map(
                            (option, optionIndex) => (
                              <div
                                className={
                                  (option.startsWith(question.newAnswer) &&
                                  question.newAnswer
                                    ? "bg-green-400 "
                                    : option.startsWith(question.answer)
                                    ? "bg-yellow-300"
                                    : " bg-white ") + " p-3 m-1 rounded-md"
                                }
                              >
                                {option}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="m-4">
                          <input
                            type="text"
                            placeholder="Model Answer"
                            className="input input-bordered w-full"
                            value={question.answer || "No Answer Yet"}
                          />

                          <div
                            role="status"
                            className="max-w-md p-4 mt-2 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse md:p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
                              </div>
                              <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                              <div>
                                <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
                              </div>
                              <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
                            </div>

                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
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
                    />
                    {/* text area */}
                    <div className="my-auto w-full ">
                      <textarea
                        placeholder="Comments"
                        className="w-full p-3 mt-2 border-gray-200 rounded-md"
                        rows={5}
                        value={question.comments || ""}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <p>{state.conversation || "No conversation found"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Narrative:</h3>
              <p>{state.narrative || "No narrative found"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewQuestions;
