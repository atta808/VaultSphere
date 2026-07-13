import ProviderRegistry from './providers/ProviderRegistry';
import { GoogleVisionProvider } from './providers/GoogleVisionProvider';
import { GeminiProvider } from './providers/GeminiProvider';

// Initialize and register providers
const visionProvider = new GoogleVisionProvider();
const geminiProvider = new GeminiProvider();

ProviderRegistry.registerProvider('googleVision', visionProvider);
ProviderRegistry.registerProvider('gemini', geminiProvider);

// Set defaults
ProviderRegistry.setDefaultOCRProvider('googleVision');
ProviderRegistry.setDefaultAnalysisProvider('gemini');

export { ProviderRegistry };
