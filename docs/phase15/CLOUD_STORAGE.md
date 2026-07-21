# Cloud Storage Provider Abstraction

## Abstract Design
To prevent vendor lock-in to Firebase, all cloud interactions happen across an interface via `CloudProviderRegistry` and `CloudProvider`.

## Future Implementations
Currently, only `FirebaseCloudProvider` is implemented. Because the architectural boundaries exist, services can safely interact with `CloudStorageService` knowing it can seamlessly handle new options (e.g., Google Drive, AWS S3, Supabase Storage, Dropbox) simply by building new providers following the interface.
