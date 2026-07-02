# LLM Benchmark Prompts for Text Processing

Reusable one-paragraph prompts to benchmark any LLM across different text
processing capabilities.

## 1. General Writing

Write a professional but engaging blog post of about 500 words explaining why
event-driven architectures are becoming popular in modern web applications. The
audience is experienced software developers familiar with REST APIs but new to
asynchronous systems. Include practical examples, discuss trade-offs, and conclude
with recommendations for when event-driven architecture is and is not appropriate.

## 2. Summarization

Read the following article and produce three outputs: (1) a one-sentence summary,
(2) a five-bullet executive summary, and (3) a detailed summary of approximately 250
words that preserves the key arguments, evidence, and conclusions without
introducing new information. Maintain the author's original intent and avoid opinions.

## 3. Information Extraction

Extract all people, organizations, locations, dates, monetary values, product names,
phone numbers, email addresses, URLs, invoice numbers, purchase order numbers,
and contractual deadlines from the following document. For each extracted item,
identify its category, exact text as it appears, and the sentence where it was found.
If a field is missing, explicitly return null instead of guessing.

## 4. Classification

Analyze the following customer support message and classify it into one primary
category (Billing, Technical Support, Account Access, Feature Request, Complaint,
Cancellation, or General Inquiry), assign a priority level (Low, Medium, High,
Critical), determine the customer's sentiment (Positive, Neutral, Negative), estimate
whether immediate human intervention is required, and briefly explain the reasoning
behind each classification.

## 5. Translation

Translate the following technical documentation from English into Spanish while
preserving formatting, Markdown syntax, code blocks, variable names, API endpoints,
commands, filenames, and technical terminology. Use natural language appropriate for
software engineers in Latin America, avoiding literal translations when they reduce
clarity.

## 6. Structured JSON Output

Read the following purchase order and convert it into valid JSON using this schema:
customer, company, invoice_number, purchase_date, due_date, currency, line_items
(description, quantity, unit_price, total), subtotal, tax, shipping, grand_total,
payment_terms, and notes. Return only valid JSON that strictly follows the schema,
using null for missing values and preserving numeric types where appropriate.

## 7. OCR Post-Processing

The following text was produced by OCR and contains spelling errors, incorrect
punctuation, broken words, duplicated lines, missing accents, incorrect line breaks,
and formatting issues. Clean and reconstruct the document while preserving the
original meaning, correcting obvious OCR mistakes, restoring paragraphs, normalizing
whitespace, and marking any sections that remain uncertain instead of inventing
missing text.

## 8. Long Document Analysis

Analyze the following report as if you were preparing a briefing for a senior executive.
Identify the main objectives, major findings, supporting evidence, assumptions, risks,
unresolved issues, contradictions, action items, deadlines, stakeholders, and
recommendations. Also identify any logical inconsistencies or unsupported claims, and
conclude with a concise executive briefing highlighting the most important decisions
that should be made.

## 9. RAG Over Documents

Using only the information contained in the provided documents, answer the following
question. Cite every claim by referencing the specific document name and section
where the information was found. If the answer cannot be determined from the
provided documents, explicitly state that the information is unavailable instead of
relying on outside knowledge or making assumptions. Provide both a concise answer
and a detailed explanation showing how the conclusion was reached.

## What Each Prompt Tests

| Prompt       | Capability Tested |
|-------------|------------------|
| General Writing | Style, coherence, audience adaptation |
| Summarization | Content preservation and compression |
| Information Extraction | Precision and hallucination resistance |
| Classification | Reasoning and label consistency |
| Translation | Fluency while preserving technical content |
| Structured JSON | Instruction following and schema compliance |
| OCR Post-Processing | Error correction without fabrication |
| Long Document Analysis | Synthesis, reasoning, organization |
| RAG | Grounding responses in sources, avoiding unsupported claims |

> Source: inbox/chats/local-models.md · processed 2026-07-02
