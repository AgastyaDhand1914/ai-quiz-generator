#defining a class which will carry out the question generation

import os
from huggingface_hub import InferenceClient
from langchain.prompts import PromptTemplate
import dotenv

dotenv.load_dotenv()

class MCQGenerator:
    def __init__(self):
        self.client = InferenceClient(
                        provider="novita",
                        api_key=os.getenv("HF_TOKEN"),
                    )
        self.prompt_template = PromptTemplate(
                input_variables=["number", "context"],
                template= '''
                You are a knowledgeable and intellectual professor. Design {number} multiple choice
                questions based on the following context:
                {context}
                The response should be a JSON object with the following format. Respond ONLY with a valid JSON object, using double quotes for all keys and string values.

                Format is as follows:

                {{
                    "questions" : {{
                        "1" : {{
                            "question" : "(body of the question)",
                            "options" : {{
                                "A" : "(content of option A)",
                                "B" : "(content of option B)",
                                "C" : "(content of option C)",
                                "D" : "(content of option D)"
                            }},
                            "answer" : "A"
                        }}
                    }}
                }}
                '''
            )

    def generate_mcq(self, number, context):
        formatted_prompt = self.prompt_template.format(number=number, context=context)
        
        completion = self.client.chat.completions.create(
                    model="deepseek-ai/DeepSeek-R1-0528",
                    messages=[
                        {
                            "role": "user",
                            "content": formatted_prompt
                        }
                    ],
                )
        
        return completion.choices[0].message.content

