import React, { useState, useEffect } from 'react';
import Quiz from './quiz';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [MCQstatus, setMCQStatus] = useState('');
  const [filestatus, setFileStatus] = useState('');
  const [mcqs, setMcqs] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [showQuiz, setShowQuiz] = useState(false);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setFileStatus('Please select a file first.');
      return;
    }
    const fileData = new FormData();
    const quizData = new FormData();

    fileData.append('file', file);
    quizData.append('num_questions', numQuestions);

    setFileStatus('Uploading File...');
    setMcqs(null);
    setNumQuestions(5);
    try {
      const response = await fetch('http://localhost:5000/api/file-upload-test', {
        method: 'POST',
        body: fileData,
      });
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          quizData.append('extracted_content', data.extracted_content);
          setFileStatus('File successfully uploaded!');
          setMCQStatus('Generating  Questions for you...');
        }
        else {
          setFileStatus(data.message);
        }
      }
      else {
        setFileStatus('Error uploading file.');
      }
    } 
    catch (error) {
      setFileStatus(`Error uploading file: ${error.message}`);
    }

    try {
      const trial_data = await fetch('http://localhost:5000/api/test-json-response', {
        method: 'POST',
        body: quizData,
      });

      if (trial_data.ok) {
        const trial_mcqs = await trial_data.json();
        setMcqs(trial_mcqs.mcqs);
        setMCQStatus('Quiz generated!');
        setFileStatus('');
      }
    }
    catch (error) {
      setMCQStatus(`Error retrieving JSON response: ${error.message}`);
    }

    setShowQuiz(true);
  };

  const handleHideQuiz = () => {
    setFileStatus('');
    setMCQStatus('');
    setMcqs(null);
    setNumQuestions(5);
    setFile(null);
    setShowQuiz(false);
  };

  return (
    <div>

      {!showQuiz &&<form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <input type="number" min="1" max="30" value={numQuestions} onChange={handleNumQuestionsChange} 
        placeholder="Number of questions"/>
        <button type="submit">Upload</button>
      </form> 
      }

      {filestatus && <p>{filestatus}</p>}
      {MCQstatus && <p>{MCQstatus}</p>}

      {mcqs && showQuiz &&
        <Quiz questions={mcqs}/>
      }

      {showQuiz &&
        <button onClick={handleHideQuiz}>Hide Quiz</button>
      }
      
    </div>
  );
};

export default FileUpload; 