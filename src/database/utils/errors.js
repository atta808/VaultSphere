export class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

export class DatabaseInitializationError extends DatabaseError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.name = 'DatabaseInitializationError';
  }
}

export class MigrationError extends DatabaseError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.name = 'MigrationError';
  }
}

export class RepositoryError extends DatabaseError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.name = 'RepositoryError';
  }
}

export class TransactionError extends DatabaseError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.name = 'TransactionError';
  }
}
