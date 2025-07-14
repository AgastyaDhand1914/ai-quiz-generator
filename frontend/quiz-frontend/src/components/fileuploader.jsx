import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [mcqs, setMcqs] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_questions', numQuestions);
    setStatus('Uploading...');
    setMcqs(null);
    // try {
      // const response = await fetch('http://localhost:5000/api/generate-mcq', {
      //   method: 'POST',
      //   body: formData,
      // });
      // if (response.ok) {
        // const data = await response.json();
        setStatus('File uploaded and MCQs generated!');

        const trial_mcqs = {
          "1": {
              "question": "Which planet is known as the Red Planet?",
              "options": {
                  "A": "Mars",
                  "B": "Jupiter",
                  "C": "Venus",
                  "D": "Saturn"
              },
              "answer": "A"
          },
          "2": {
              "question": "What is the chemical symbol for water?",
              "options": {
                  "A": "O2",
                  "B": "H2O",
                  "C": "CO2",
                  "D": "NaCl"
              },
              "answer": "B"
          },
          "3": {
              "question": "Who was the first President of the United States?",
              "options": {
                  "A": "Abraham Lincoln",
                  "B": "George Washington",
                  "C": "Thomas Jefferson",
                  "D": "John Adams"
              },
              "answer": "B"
          },
          "4": {
              "question": "Which gas do plants absorb from the atmosphere?",
              "options": {
                  "A": "Oxygen",
                  "B": "Nitrogen",
                  "C": "Carbon Dioxide",
                  "D": "Hydrogen"
              },
              "answer": "C"
          },
          "5": {
              "question": "What is the largest mammal in the world?",
              "options": {
                  "A": "Elephant",
                  "B": "Giraffe",
                  "C": "Blue Whale",
                  "D": "Hippopotamus"
              },
              "answer": "C"
          }
      }

        
        setMcqs(trial_mcqs);
      // } else {
      //   const errorData = await response.json();
      //   setStatus(errorData.message || 'Upload failed.');
      // }
    // } catch (error) {
    //   setStatus('Error uploading file.');
    // }
  
};

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="number"
          min="1"
          max="30"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          placeholder="Number of questions"
        />
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
      {mcqs && (
        <div>
          <h3>Generated MCQs:</h3>
          <ol>
            {Object.entries(mcqs).map(([key, q]) => (
              <li key={key}>
                <strong>{q.question}</strong>
                <ul>
                  {Object.entries(q.options).map(([opt, text]) => (
                    <li key={opt}><b>{opt}:</b> {text}</li>
                  ))}
                </ul>
                <em>Answer: {q.answer}</em>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 