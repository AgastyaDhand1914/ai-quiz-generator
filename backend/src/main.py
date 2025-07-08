from flask import Flask, request, jsonify
from file_extractor import FileExtractor
from text_processing import TextProcessor
from mcq_generator import MCQGenerator
import requests

app = Flask(__name__)

#dummy
PROMPT_TEMPLATE = (
    "Generate {number} multiple choice questions from the following context. "
    "Return the result in the following JSON format: {JSON_FORMAT}\nContext: {context}"
)

JSON_FORMAT = '{"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "answer": "..."}]}'

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "mistral:7b"

@app.route('/generate', methods=['POST'])
def generate():
    #check for file upload
    file = request.files.get('file')
    text = request.form.get('text')
    number = request.form.get('number', 5)  #default is 5 ques
    try:
        #extracting text
        if file:
            extractor = FileExtractor(file)
            raw_text = extractor.extract_from_file()
        elif text:
            raw_text = text
        else:
            return jsonify({"error": "No file or text provided."}), 400

        #cleaning text
        processor = TextProcessor(raw_text)
        cleaned_text = processor.clean_text()

        
        prompt = PROMPT_TEMPLATE.format(number=number, context=cleaned_text, JSON_FORMAT=JSON_FORMAT)

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt
            }
        )
        
        if response.status_code != 200:
            return jsonify({"error": "LLM API error", "details": response.text}), 500
        llm_output = response.json().get('response', '')

        return jsonify({"mcqs": llm_output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
