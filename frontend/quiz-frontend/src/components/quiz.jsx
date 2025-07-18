import React, { useState } from 'react';
import Question from './question';
import axios from 'axios';

const Quiz = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (questionKey, selectedOption) => {
    setSelectedAnswers(prev => ({ ...prev, [questionKey] : selectedOption }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    Object.entries(questions).forEach(([key, q]) => {
      if (selectedAnswers[key] && selectedAnswers[key] === q.answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/csv-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Create a link to download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'quiz.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download CSV');
    }
  };

  return (
    <>
        {
            questions && Object.entries(questions).map(([key, q]) => (
                <Question 
                  question={q} 
                  id={`Q${key}`} 
                  key={key}
                  qKey={key}
                  selected={selectedAnswers[key]}
                  correctAnswer={q.answer}
                  onSelect={handleOptionSelect}
                  disabled={submitted}
                  submitted={submitted}
                />
            ))
        }
        {!submitted && (
          <button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== Object.keys(questions).length}>
            Submit
          </button>
        )}
        {submitted && (
          <div>
            <h3>Your Score: {score} / {Object.keys(questions).length}</h3>
          </div>
        )}
        {submitted && (
          <button onClick={handleDownloadCSV}>Download as CSV</button>
        )}
    </>
  )
}

export default Quiz