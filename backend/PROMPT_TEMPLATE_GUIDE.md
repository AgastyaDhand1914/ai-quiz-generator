# Prompt Template Guide for MCQ Generator

This guide explains how to use the enhanced prompt template system in your MCQ generator.

## Overview

The MCQ generator now supports multiple prompt templates that can be customized for different use cases:

- **Standard**: General-purpose MCQ generation
- **Academic**: University-level questions with deeper analysis
- **K-12**: Age-appropriate questions for school students
- **Technical**: Practical, hands-on questions for technical subjects
- **Custom**: Your own custom templates

## Quick Start

### Basic Usage

```python
from src.mcq_generator import MCQGenerator
from huggingface_hub import InferenceClient

# Setup your LLM client
client = InferenceClient(
    provider="novita",
    api_key=os.getenv("HF_TOKEN"),
)

# Create generator with standard template
generator = MCQGenerator(client, template_type="standard")

# Generate questions
result = generator.generate_mcq(
    number=3,
    context="Your text content here...",
    difficulty="medium",
    subject="Computer Science"
)
```

### Using Different Templates

```python
# Academic template for university-level questions
academic_generator = MCQGenerator(client, template_type="academic")

# K-12 template for school students
k12_generator = MCQGenerator(client, template_type="k12")

# Technical template for practical subjects
technical_generator = MCQGenerator(client, template_type="technical")
```

## Template Types

### 1. Standard Template
- **Use case**: General MCQ generation
- **Variables**: `number`, `context`, `difficulty`, `subject`
- **Features**: Balanced questions with explanations

```python
result = generator.generate_mcq(
    number=5,
    context="Your content...",
    difficulty="medium",
    subject="History"
)
```

### 2. Academic Template
- **Use case**: University-level assessments
- **Variables**: `number`, `context`, `difficulty`, `subject`
- **Features**: 
  - Tests deep understanding, not just memorization
  - Includes Bloom's Taxonomy levels
  - Focuses on analysis, synthesis, and evaluation

```python
academic_generator = MCQGenerator(client, template_type="academic")
result = academic_generator.generate_mcq(
    number=3,
    context="Complex academic content...",
    difficulty="hard",
    subject="Advanced Mathematics"
)
```

### 3. K-12 Template
- **Use case**: School-level assessments
- **Variables**: `number`, `context`, `difficulty`, `subject`, `grade_level`
- **Features**:
  - Age-appropriate language
  - Simple, clear explanations
  - Builds foundational knowledge

```python
k12_generator = MCQGenerator(client, template_type="k12")
result = k12_generator.generate_mcq(
    number=4,
    context="Simple content for kids...",
    difficulty="easy",
    subject="Science",
    grade_level="5th grade"
)
```

### 4. Technical Template
- **Use case**: Technical/vocational training
- **Variables**: `number`, `context`, `difficulty`, `subject`
- **Features**:
  - Practical application questions
  - Safety and standards focus
  - Real-world scenarios

```python
technical_generator = MCQGenerator(client, template_type="technical")
result = technical_generator.generate_mcq(
    number=3,
    context="Technical procedures...",
    difficulty="medium",
    subject="Automotive Repair"
)
```

## Creating Custom Templates

### Method 1: Using the Template Manager

```python
# Create a custom template
custom_template = """
You are a {role} expert. Generate {number} questions about {topic}:

Content: {context}
Level: {level}

Requirements:
{requirements}

Format as JSON with questions, options, answers, and explanations.
"""

# Add to generator
generator.add_custom_template(
    name="my_custom_template",
    template_text=custom_template,
    input_variables=["number", "context", "role", "topic", "level", "requirements"]
)

# Use the custom template
generator.set_template("my_custom_template")
result = generator.generate_mcq(
    number=2,
    context="Your content...",
    role="language teacher",
    topic="grammar",
    level="intermediate",
    requirements="Focus on verb tenses and sentence structure"
)
```

### Method 2: Direct Template Creation

```python
from langchain.prompts import PromptTemplate

# Create template directly
my_template = PromptTemplate(
    input_variables=["question_type", "content", "difficulty"],
    template="""
    Generate a {question_type} question based on: {content}
    Difficulty: {difficulty}
    
    Format as JSON with question, options, and answer.
    """
)

# Add to template manager
template_manager = PromptTemplateManager()
template_manager.add_template("my_template", my_template)
```

## Advanced Features

### Question Validation

```python
# Generate questions with automatic validation
result = generator.generate_with_validation(
    number=3,
    context="Your content...",
    difficulty="medium",
    subject="Physics"
)

# Each question will include validation feedback
for q_num, question_data in result["questions"].items():
    print(f"Question {q_num}:")
    print(f"  Question: {question_data['question']}")
    print(f"  Validation: {question_data['validation']}")
```

### Template Management

```python
# List all available templates
templates = generator.get_available_templates()
print("Available templates:", templates)

# Switch between templates
generator.set_template("academic")
# Now using academic template

generator.set_template("k12")
# Now using K-12 template
```

### Dynamic Template Switching

```python
# Create different generators for different contexts
contexts = {
    "elementary": ("k12", {"grade_level": "3rd grade"}),
    "high_school": ("k12", {"grade_level": "11th grade"}),
    "university": ("academic", {}),
    "technical": ("technical", {})
}

for context_name, (template_type, extra_params) in contexts.items():
    generator = MCQGenerator(client, template_type=template_type)
    result = generator.generate_mcq(
        number=2,
        context="Your content...",
        difficulty="medium",
        subject="Science",
        **extra_params
    )
    print(f"{context_name} questions:", result)
```

## Best Practices

### 1. Choose the Right Template
- Use **standard** for general purposes
- Use **academic** for university-level content
- Use **k12** for school-aged students
- Use **technical** for practical, hands-on subjects

### 2. Provide Good Context
```python
# Good context
context = """
Machine learning is a subset of artificial intelligence that enables computers to learn 
from data without being explicitly programmed. It includes supervised learning, 
unsupervised learning, and reinforcement learning approaches.
"""

# Bad context (too vague)
context = "Machine learning is important."
```

### 3. Set Appropriate Difficulty
- **easy**: Basic concepts, definitions
- **medium**: Application, analysis
- **hard**: Synthesis, evaluation, complex scenarios

### 4. Use Validation for Quality Control
```python
# Always validate important questions
validated_result = generator.generate_with_validation(
    number=5,
    context=context,
    difficulty="medium",
    subject="Important Subject"
)
```

## Error Handling

```python
try:
    result = generator.generate_mcq(
        number=3,
        context=context,
        difficulty="medium",
        subject="Physics"
    )
    
    if "error" in result:
        print(f"Error generating questions: {result['error']}")
    else:
        print("Questions generated successfully:", result)
        
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Template Variables Reference

| Template | Required Variables | Optional Variables |
|----------|-------------------|-------------------|
| standard | `number`, `context`, `difficulty`, `subject` | None |
| academic | `number`, `context`, `difficulty`, `subject` | None |
| k12 | `number`, `context`, `difficulty`, `subject`, `grade_level` | None |
| technical | `number`, `context`, `difficulty`, `subject` | None |
| custom | Depends on your template | Depends on your template |

## Examples

See `example_usage.py` for complete working examples of all template types and features. 