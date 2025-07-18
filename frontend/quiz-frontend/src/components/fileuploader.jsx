import React, { useState } from 'react';
import Quiz from './quiz';
import './fileuploader.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [MCQstatus, setMCQStatus] = useState('');
  const [filestatus, setFileStatus] = useState('');
  const [mcqs, setMcqs] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [showQuiz, setShowQuiz] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

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
          console.log(data.extracted_content);
          setFileStatus('');
          setFileUploaded(true);
          setMCQStatus('Generating Questions for you...');
          try {
            const trial_data = await fetch('http://localhost:5000/api/test-json-response', {
              method: 'POST',
              body: quizData,
            });
            if (trial_data.ok) {
              const trial_mcqs = await trial_data.json();
              setMcqs(trial_mcqs.mcqs);
              setMCQStatus('File was successfully uploaded, here are the generated questions for you!');
              setFileStatus('');
              setShowQuiz(true);
            }
          } catch (error) {
            setMCQStatus(`Error retrieving JSON response: ${error.message}`);
          }
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
  };

  const handleHideQuiz = () => {
    setFileStatus('');
    setMCQStatus('');
    setMcqs(null);
    setFile(null);
    setShowQuiz(false);
    setFileUploaded(false);
  };

  return (
    <div className="fileupload-container">

      {!showQuiz &&
        <form onSubmit={handleUpload} className="fileupload-form">
          <label className="fileupload-label">
            Upload File
            <input type="file" onChange={handleFileChange} className="fileupload-input" />
          </label>
          <label className="fileupload-label">
            Number of Questions
            <input type="number" min="1" max="30" value={numQuestions} onChange={handleNumQuestionsChange}
              placeholder="Number of questions"
              className="fileupload-input"
            />
          </label>
          <button type="submit" className="fileupload-button">Upload</button>
        </form>
      }

      {filestatus !== '' && <p className="fileupload-status">{filestatus}</p>}
      {MCQstatus !== '' && <p className="quesupload-status">{MCQstatus}</p>}

      {mcqs && showQuiz &&
        <Quiz questions={mcqs}/>
      }

      {showQuiz &&
        <button onClick={handleHideQuiz} className="fileupload-hide-btn">Hide Quiz</button>
      }
      
    </div>
  );
};

export default FileUpload; 