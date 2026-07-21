import * as Crypto from 'expo-crypto';
import SignatureRepository from '../../database/repositories/workflow/SignatureRepository';

class SignatureValidationService {
  async validateSignature(signatureId, currentDocumentContent) {
    const signature = await SignatureRepository.findById(signatureId);
    if (!signature) return false;

    const currentHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      currentDocumentContent
    );

    return currentHash === signature.documentHash;
  }
}

export default new SignatureValidationService();
