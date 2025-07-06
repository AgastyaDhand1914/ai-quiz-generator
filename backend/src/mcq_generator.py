#defining a class which will carry out the question generation

class MCQGenerator:
    def __init__(self, llm, prompt_template):
        self.llm = llm
        self.prompt_template = prompt_template

    def generate_mcq(self, number, context, JSON_FORMAT):
        prompt = self.prompt_template.format(number=number, context=context, JSON_FORMAT=JSON_FORMAT)
        return self.llm.invoke(prompt)

