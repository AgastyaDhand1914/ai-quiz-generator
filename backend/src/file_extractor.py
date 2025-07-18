#extracting text from uploaded docs from user

import PyPDF2, docx
import os
import io

class FileExtractor:
    def __init__(self, file_input):
        self.file_input = file_input    #input
        self.text = ""    #extracted text from file
        self.acceptable = True    #to check if the file is acceptable for processing

    def extract_from_file(self):
        try:
            if isinstance(self.file_input, str):    #input is a file path
                return self.extract_from_path(self.file_input)
            elif hasattr(self.file_input, 'filename') and hasattr(self.file_input, 'read'):    #input is an UploadFile object
                return self.extract_from_upload_file(self.file_input)
            else:
                self.acceptable = False
                raise ValueError("Unsupported input type.")   
        except Exception as e:
            self.acceptable = False
            self.text = ""
            raise ValueError(f"Error extracting text from file: {e}")

    def extract_from_path(self, file_path: str):
        if not os.path.exists(file_path):
            raise ValueError(f"File not found: {file_path}")
            
        if file_path.lower().endswith('.pdf'):    #pdf file
            return self.extract_pdf_from_path(file_path)
        elif file_path.lower().endswith('.docx'):    #docx file
            return self.extract_docx_from_path(file_path)
        elif file_path.lower().endswith('.txt'):    #txt file
            return self.extract_txt_from_path(file_path)
        else:
            self.acceptable = False
            raise ValueError("Unsupported file type, only '.pdf', '.docx', and '.txt' are supported currently.")

    def extract_from_upload_file(self, upload_file):
        
        if upload_file.filename.lower().endswith('.pdf'):    #pdf file
            return self.extract_pdf_from_upload(upload_file)
        elif upload_file.filename.lower().endswith('.docx'):    #docx file
            return self.extract_docx_from_upload(upload_file)
        elif upload_file.filename.lower().endswith('.txt'):    #txt file
            return self.extract_txt_from_upload(upload_file)
        else:
            self.acceptable = False
            raise ValueError("Unsupported file type, only '.pdf', '.docx', and '.txt' are supported currently.")

    def extract_pdf_from_upload(self, upload_file):
        try:
            content = upload_file.file.read()
            pdf_stream = io.BytesIO(content)    #convert to bytes
            reader = PyPDF2.PdfReader(pdf_stream)
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    self.text += page_text + "\n"  
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from pdf: {e}")
        
        return self.text.strip()

    def extract_docx_from_upload(self, upload_file):
        try:
            content = upload_file.file.read()
            doc_stream = io.BytesIO(content)    #convert to bytes
            doc = docx.Document(doc_stream)
            
            for para in doc.paragraphs:
                if para.text.strip():
                    self.text += para.text + "\n"                   
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from docx: {e}")
        
        return self.text.strip()

    def extract_pdf_from_path(self, file_path: str):
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        self.text += page_text + "\n"
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from pdf: {e}")
        
        return self.text.strip()

    def extract_docx_from_path(self, file_path: str):
        try:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                if para.text.strip():
                    self.text += para.text + "\n"
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from docx: {e}")
        
        return self.text.strip()

    def extract_txt_from_path(self, file_path: str):
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.text = file.read()
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from txt: {e}")
        return self.text.strip()

    def extract_txt_from_upload(self, upload_file):
        try:
            content = upload_file.file.read()
            self.text = content.decode('utf-8')
        except Exception as e:
            self.acceptable = False
            raise ValueError(f"Error extracting text from txt: {e}")
        return self.text.strip()


