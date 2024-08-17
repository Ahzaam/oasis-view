import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/Home/landingPage";
import ReviewQuestions from "./components/Questions/reviewQuestion";
import PreviousReview from "./pages/Home/PreviousReviews";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/answers" element={<Home />} />
        <Route path="/reviews" element={<PreviousReview />} />
        <Route path="/old-answers" element={<ReviewQuestions />} />
      </Routes>
    </Router>
  );
};

export default App;
