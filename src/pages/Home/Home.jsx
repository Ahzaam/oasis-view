import React, { useEffect, useState } from "react";
import Question from "../../components/Questions/Questions";

import { useLocation, useSearchParams } from "react-router-dom";

const Home = () => {
  let { state } = useLocation();
  return (
    <>
      <div className="container m-auto">
        <Question questionData={state} docId={state.docId} />
      </div>
    </>
  );
};

export default Home;
