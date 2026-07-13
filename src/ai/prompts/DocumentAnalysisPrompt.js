export const DocumentAnalysisPrompt = {
  analyzeDocument: (ocrText) => `
You are an expert AI Document Intelligence system.
Analyze the following text extracted from a document via OCR.

OCR Text:
"""
${ocrText}
"""

Provide your analysis strictly in valid JSON format matching this schema:
{
  "classification": "Passport | CNIC | Driving License | Property Document | Court Order | Contract | Invoice | Receipt | Medical Report | Insurance | Education | Certificate | Other",
  "classificationConfidence": 0.95,
  "summary": {
    "short": "1 sentence summary",
    "medium": "2-3 sentences summary",
    "long": "Detailed paragraph summary"
  },
  "entities": [
    { "type": "Name | Organization | Address | PhoneNumber | Email | Date | Amount | DocumentNumber | ReferenceNumber", "value": "extracted value", "confidence": 0.99 }
  ],
  "keywords": [
    { "keyword": "important term", "type": "Primary | Secondary | Search" }
  ]
}

Ensure the response is ONLY valid JSON with no markdown blocks or extra text.
`
};
