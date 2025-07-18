#defining a class which will convert the questions to a csv file

import csv
import io

class CSVDownloader:
    
    @staticmethod
    def questions_to_csv(questions):
        csv_string = io.StringIO()
        csv_writer = csv.writer(csv_string)

        #writing header
        csv_writer.writerow(['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer'])

        for question_key, question_data in questions.items():
            question = question_data.get('question', '')
            options = question_data.get('options', {})
            answer = question_data.get('answer', '')

            #writing row
            csv_writer.writerow([
                question,
                options.get('A', ''),
                options.get('B', ''),
                options.get('C', ''),
                options.get('D', ''),
                answer
            ])

        return csv_string.getvalue()