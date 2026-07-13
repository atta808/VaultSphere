export const OCRPrompt = {
  // Strategy for OCR text normalization
  normalizationRules: [
    "Remove multiple consecutive newlines",
    "Trim leading and trailing whitespace",
    "Normalize quotes and dashes"
  ],
  languagePreferences: ["en"],
  postProcessingInstructions: "Ensure text blocks are logically separated by single newlines. Discard purely graphical noise characters.",

  // Future LLM-based OCR Prompt
  llmPrompt: `
You are an expert OCR extraction engine. Extract all text from the provided image accurately.
Observe the following rules:
1. Maintain the natural reading order.
2. Preserve paragraph breaks.
3. Ignore noise or graphical artifacts.
  `
};
