# AI Assistant Architecture

The AI layer sits behind `ProviderRegistry` and `AIProvider` base classes. `GeminiProvider` implements `generateContentStream` to enable async generators streaming text.
`AIAssistantService` interacts with `ConversationService` for SQLite history, `PromptBuilderService` for context generation, and returns a generator.
Citations are injected dynamically.
