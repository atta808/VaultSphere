import * as Crypto from 'expo-crypto';
import SignatureRepository from '../../database/repositories/workflow/SignatureRepository';
import SignatureHistoryRepository from '../../database/repositories/workflow/SignatureHistoryRepository';
import PermissionService from '../collaboration/PermissionService';
import AuditTrailService from '../collaboration/AuditTrailService';
import SecurityService from '../security/SecurityService';

class DigitalSignatureService {
  async applySignature(documentId, documentContent, user, vaultPin, signatureImage = null) {
    // Authenticate with Vault PIN before signing
    const isAuthenticated = await SecurityService.verifyPin(vaultPin);
    if (!isAuthenticated) {
        throw new Error('Invalid Vault PIN');
    }

    await PermissionService.validatePermission(user.id, 'document', 'sign');

    const documentHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      documentContent
    );

    const signatureHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      documentHash + user.id + new Date().toISOString()
    );

    const signature = await SignatureRepository.create({
      uuid: SignatureRepository.generateUUID(),
      documentId,
      userId: user.id,
      userName: user.name,
      signatureHash,
      documentHash,
      signatureImage
    });

    await SignatureHistoryRepository.create({
      signatureId: signature.id,
      action: 'APPLIED',
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    await AuditTrailService.logAction(user.id, 'APPLY_SIGNATURE', 'signature', signature.id);

    return signature;
  }
}

export default new DigitalSignatureService();
