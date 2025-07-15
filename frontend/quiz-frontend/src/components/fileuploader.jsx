import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [mcqs, setMcqs] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [text, setText] = useState('');

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
    setText('');
    setNumQuestions(5);
    try {
      const response = await fetch('http://localhost:5000/api/file-upload-test', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setStatus('File uploaded and MCQs generated!');
        setText(data.extracted_content);
      } 
    } 
    catch (error) {
      setStatus(`Error uploading file: ${error.message}`);
    }

    try {
      const trial_data = await fetch('http://localhost:5000/api/test-json-response', {
        method: 'POST',
      });

      if (trial_data.ok) {
        console.log('trial_data is ok.')
        const trial_mcqs = await trial_data.json();
        setMcqs(trial_mcqs.mcqs);
        setStatus('File succesfully uploaded. JSON response retrieved.');
      }
    }
    catch (error) {
      setStatus(`File succesfully uploaded. Error retrieving JSON response: ${error.message}`);
    }
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
      {text && <p>{text}</p>}
      {mcqs &&
      <div>
        <h3>Generated MCQs:</h3>
        <ol>
          {Object.entries(mcqs).map(([key, q]) => (
            <li key={key}>
              {q.question}
              <ul>
                {Object.entries(q.options).map(([qnum, content]) => (
                  <li key={qnum}>
                    <b>{qnum}:</b> {content}
                  </li>
                ))}
              </ul>
              <em>Answer: {q.answer}</em>
              </li>
          ))}
        </ol>
      </div>
      }
      
    </div>
  );
};

export default FileUpload; 