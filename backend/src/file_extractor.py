#extracting text from uploaded docs from user

import PyPDF2, docx
import os

class FileExtractor:
    def __init__(self, file_path):
        self.file_path = file_path    #the file path
        # self.name = file_storage.filename   #the name of the file for checking file type
        self.text = ""                     #updated for extracted text from file
        self.acceptable = True             #to check if the file is acceptable for processing

    def extract_from_file(self):

        #call for appropriate extraction fn as per file extension
        #only supporting .pdf and .docx for now

        if self.file_path.endswith('.pdf'):
            return self.extract_from_pdf()
        elif self.file_path.endswith('.docx'):
            return self.extract_from_docx()
        else:
            self.acceptable = False
            raise ValueError("Unsupported file type")

    def extract_from_pdf(self):
        try:
            with open(self.file_path, 'rb') as file: #read as binary file
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:   #extracted as per page
                    self.text += page.extract_text()
        except Exception as e:
            self.acceptable = False
            self.text = ""
            raise ValueError(f"Error extracting text from file: {e}")
        
        return self.text

    def extract_from_docx(self):
        try:
            doc = docx.Document(self.file_path)  #load docx file
            for para in doc.paragraphs:   #extracted as per paragraph
                self.text += para.text
        except Exception as e:
            self.acceptable = False
            self.text = ""
            raise ValueError(f"Error extracting text from file: {e}")
        
        return self.text

