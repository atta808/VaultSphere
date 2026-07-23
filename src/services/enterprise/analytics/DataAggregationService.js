import DocumentRepository from '../../../database/repositories/DocumentRepository';

export class DataAggregationService {
  static async getWidgetData(dataSource) {
    const docRepo = new DocumentRepository();

    if (dataSource === 'docs_total') {
       return await docRepo.countDocuments();
    } else if (dataSource === 'storage_usage') {
       return await docRepo.sumStorageUsage();
    }

    return 0;
  }
}
