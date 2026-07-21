export const AIPrompts = {
  // Document Context Prompt
  documentContext: (text) => `Use the following document text as context for the user's questions.\n\nDOCUMENT TEXT:\n"""\n${text}\n"""\n`,

  // Summarize
  summarize: () => `Summarize this document. Provide a brief overview followed by key points.`,

  // Explain Clause
  explainText: (selectedText) => `Explain the following text in simple, easy-to-understand terms:\n\n"""\n${selectedText}\n"""\n`,

  // Compare Changes Summary
  compareSummary: (diffText) => `Analyze the following differences between two documents. Provide a high-level summary of what was added, removed, or changed. Do not list every single word change, but group them into logical themes.\n\nCHANGES:\n"""\n${diffText}\n"""\n`,

  // Extract Entities
  extractEntities: (text) => `Extract the following entities from the text: Names, Dates, Addresses, Phone Numbers, Emails, Amounts, Document Numbers, Reference Numbers. Return ONLY a valid JSON array of objects with "type", "value", and "confidence" (0.0-1.0) properties. Do not include markdown formatting.\n\nTEXT:\n"""\n${text}\n"""\n`
};
