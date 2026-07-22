import { BaseRepository } from '../BaseRepository';

export class RetentionPolicyRepository extends BaseRepository {
  constructor() {
    super('retention_policies');
  }
}
