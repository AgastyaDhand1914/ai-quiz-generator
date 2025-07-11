from mcq_generator import MCQGenerator
from file_extractor import FileExtractor

file_extract_object = FileExtractor('C://Users//Arvind//Desktop//DTU 1st year//AIStuff//randomprojects//mcqgenerator//backend//unofficial//DeepLearning.docx')

context = file_extract_object.extract_from_file()

mcq_generator_object = MCQGenerator()

response = mcq_generator_object.generate_mcq(number=20, context=context)

print(response)