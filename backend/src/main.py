from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import re
import tempfile
from file_extractor import FileExtractor
from text_processing import TextProcessor
from mcq_generator import MCQGenerator
from csv_downloader import CSVDownloader
import io


app = Flask(__name__)
CORS(app)    #enable CORS for all routes

#configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024    #10MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()    #use system temp directory


ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'MCQ Generator API is running'
    })

@app.route('/api/supported-formats', methods=['GET'])
def get_supported_formats():
    return jsonify({
        'formats': list(ALLOWED_EXTENSIONS),
        'max_file_size': '10MB'
    })


#endpoint to test file upload functionality
@app.route('/api/file-upload-test', methods=['POST'])
def file_upload_test():
    try:
        if 'file' not in request.files:
            return jsonify({
                'success' : False,
                'error': 'No file provided',
                'message': 'Please upload a file'
            }), 400
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({
                'success' : False,
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success' : False,
                'error': 'Invalid file type',
                'message': f'Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        filename = secure_filename(file.filename) if file.filename else 'uploaded_file'
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path) 
        
        try:
            file_extractor = FileExtractor(file_path)   
            raw_text = file_extractor.extract_from_file()
            
            if not raw_text or raw_text.strip() == '':
                return jsonify({
                    'success' : False,
                    'error': 'Empty file',
                    'message': 'The uploaded file appears to be empty or could not be processed'
                }), 400
            
            text_processor = TextProcessor(raw_text)  
            cleaned_text = text_processor.clean_text()
            
            if not cleaned_text or cleaned_text.strip() == '':
                return jsonify({
                    'success' : False,
                    'error': 'No valid content',
                    'message': 'The file contains no processable text content'
                }), 400
            else:
                return jsonify({
                    'success' : True,
                    'filename': filename,
                    'extracted_content': cleaned_text.strip()
                })
        except Exception as e:
            return jsonify({
                'success' : False,
                'error': 'File processing error',
                'message': f'Error processing file: {str(e)}'
            }), 500
        finally:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path) 
            except:
                pass 
    except Exception as e:
        return jsonify({
            'success' : False,
            'error': 'Server error',
            'message': f'An unexpected error occurred: {str(e)}'
        }), 500


#endpoint for verifying posting the JSON response
@app.route('/api/test-json-response', methods=['POST'])
def test_json_response():
    try:
        num_questions = request.form.get('num_questions', 5)
        
        try:
            num_questions = int(num_questions)
            if num_questions < 1 or num_questions > 30:
                return jsonify({
                    'success' : False,
                    'error': 'Invalid number of questions',
                    'message': 'Number of questions must be between 1 and 30'
                }), 400
        except ValueError:
            return jsonify({
                'success' : False,
                'error': 'Invalid number of questions',
                'message': 'Number of questions must be a valid integer'
            }), 400

        cleaned_text = request.form.get('extracted_content', '')

        mcq_generator = MCQGenerator()
        mcq_response = mcq_generator.generate_mcq(num_questions, cleaned_text)     #generating mcqs
        json_match = re.search(r"\{.*\}", mcq_response, re.DOTALL) if mcq_response else None
        mcq_json_string = json_match.group(0) if json_match else None
        mcqs = {}

            
        try:
            if mcq_json_string:
                mcq_data = json.loads(mcq_json_string)     #parsing json response
                mcqs = mcq_data.get('questions', {})
            else:
                return jsonify({
                    'error': 'MCQ generation failed',
                    'message': 'No valid response from thegenerator'
                }), 500
        except json.JSONDecodeError:
            return jsonify({
                'error': 'Quiz Generator failed',
                'message': 'Failed to generate valid format of questions',
                'response': mcq_json_string
            }), 500
        
        return jsonify({
            'success': True,
            'mcqs': mcqs,
            'total_questions': len(mcqs)
        })

    except Exception as e:
        return jsonify({
            'error': 'Error occured in retriveing JSON response',
            'message': f'Error: {str(e)}'
        }), 500


@app.route('/api/csv-download', methods=['POST'])
def download_quiz_csv():
    try:
        # Parse the JSON body sent from the frontend
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No questions provided',
                'message': 'Please provide questions in the request body'
            }), 400

        # Generate the CSV string using your CSVDownloader class
        csv_string = CSVDownloader.questions_to_csv(data)

        if not csv_string:
            return jsonify({
                'error': 'CSV generation failed',
                'message': 'No CSV data to download'
            }), 500

        # Return the CSV as a downloadable file
        return send_file(
            io.BytesIO(csv_string.encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='quiz.csv'
        )
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'An unexpected error occurred: {str(e)}'
        }), 500


@app.errorhandler(413)
def too_large(error):
    return jsonify({
        'error': 'File too large',
        'message': 'File size exceeds the maximum limit of 10MB'
    }), 413

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred on the server'
    }), 500

if __name__ == '__main__':
    print("Commenced. Available endpoints:")
    print("- GET  /api/health")
    print("- GET  /api/supported-formats")
    print("- POST /api/generate-mcq")
    app.run(debug=True, host='0.0.0.0', port=5000)
