import ProviderRegistry from './providers/ProviderRegistry';
import { GoogleVisionProvider } from './providers/GoogleVisionProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import CloudEmbeddingProvider from './providers/embedding/CloudEmbeddingProvider';
import LocalEmbeddingProvider from './providers/embedding/LocalEmbeddingProvider';

// Initialize and register providers
const visionProvider = new GoogleVisionProvider();
const geminiProvider = new GeminiProvider();
const cloudEmbeddingProvider = new CloudEmbeddingProvider();
const localEmbeddingProvider = new LocalEmbeddingProvider();

ProviderRegistry.registerProvider('googleVision', visionProvider);
ProviderRegistry.registerProvider('gemini', geminiProvider);
ProviderRegistry.registerProvider('cloudEmbedding', cloudEmbeddingProvider);
ProviderRegistry.registerProvider('localEmbedding', localEmbeddingProvider);

// Set defaults
ProviderRegistry.setDefaultOCRProvider('googleVision');
ProviderRegistry.setDefaultAnalysisProvider('gemini');
ProviderRegistry.setDefaultEmbeddingProvider('cloudEmbedding');

export { ProviderRegistry };
