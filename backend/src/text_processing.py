#processing text extracted from files or inputted by user

import re

class TextProcessor:
    def __init__(self, raw_text):
        self.raw_text = raw_text
    
    def clean_text(self):
        cleaned_text = re.sub(r'\s+', ' ', self.raw_text)    #removing widespaces and newline characters
        cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', cleaned_text)    #removing special characters

        return cleaned_text.strip()
    
    def extract_content(self):
        content = re.findall(r'<p>(.*?)</p>', self.raw_text, re.DOTALL)    #extracting content between paragraph tags
        return content