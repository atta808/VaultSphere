class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class AuthenticationError extends SecurityError {
  constructor(message = 'Authentication failed.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class BiometricError extends SecurityError {
  constructor(message = 'Biometric operation failed.') {
    super(message);
    this.name = 'BiometricError';
  }
}

export class PinError extends SecurityError {
  constructor(message = 'PIN operation failed.') {
    super(message);
    this.name = 'PinError';
  }
}

export class EncryptionError extends SecurityError {
  constructor(message = 'Encryption operation failed.') {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class SecureStorageError extends SecurityError {
  constructor(message = 'Secure storage operation failed.') {
    super(message);
    this.name = 'SecureStorageError';
  }
}

export class SessionError extends SecurityError {
  constructor(message = 'Session error occurred.') {
    super(message);
    this.name = 'SessionError';
  }
}
