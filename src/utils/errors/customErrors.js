export class VaultError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class StorageError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'StorageError';
  }
}

export class FileImportError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'FileImportError';
  }
}

export class FileMoveError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'FileMoveError';
  }
}

export class FolderError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'FolderError';
  }
}

export class ValidationError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class MetadataError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'MetadataError';
  }
}

export class ImportError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'ImportError';
  }
}

export class DuplicateFileError extends VaultError {
  constructor(message, duplicateInfo) {
    super(message);
    this.name = 'DuplicateFileError';
    this.duplicateInfo = duplicateInfo;
  }
}

export class UnsupportedFileError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'UnsupportedFileError';
  }
}

export class PermissionDeniedError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}

export class InvalidFileError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'InvalidFileError';
  }
}

export class CancelledImportError extends VaultError {
  constructor(message) {
    super(message);
    this.name = 'CancelledImportError';
  }
}
