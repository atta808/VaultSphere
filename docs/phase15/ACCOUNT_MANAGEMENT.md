# Account Management

## Purpose
Manages cloud identities ensuring multiple device sessions can map efficiently. Uses `AccountService` to interact smoothly regardless of the core provider used.

## Current Implementations
Built primarily on Firebase Auth handling:
- Email/Password Sign Up
- Email/Password Sign In
- Sign Out
- Guest Context
- Password Recovery

## Future Scope
Enterprise SSO, Google Sign-in, and Apple accounts easily plug into the UI following this abstracted implementation without breaking the UI component dependencies.
