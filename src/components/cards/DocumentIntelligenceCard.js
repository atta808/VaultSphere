import React, { useEffect, useState } from 'react';
import { SphereSectionCard } from './SphereSectionCard';
import { SphereInfoRow } from '../common/SphereInfoRow';
import { EmptyState } from '../feedback/EmptyState';
import OCRResultRepository from '../../database/repositories/OCRResultRepository';
import DocumentAnalysisRepository from '../../database/repositories/DocumentAnalysisRepository';
import DocumentSummaryRepository from '../../database/repositories/DocumentSummaryRepository';
import DocumentKeywordRepository from '../../database/repositories/DocumentKeywordRepository';
import DocumentEntityRepository from '../../database/repositories/DocumentEntityRepository';

export function DocumentIntelligenceCard({ documentId }) {
  const [data, setData] = useState({
    ocr: null,
    analysis: null,
    summary: null,
    keywords: [],
    entities: []
  });

  useEffect(() => {
    async function loadAI() {
      try {
        const [ocr, analysis, summary, keywords, entities] = await Promise.all([
          OCRResultRepository.findOne({ documentId }),
          DocumentAnalysisRepository.findOne({ documentId }),
          DocumentSummaryRepository.findOne({ documentId }),
          DocumentKeywordRepository.findBy({ documentId }),
          DocumentEntityRepository.findBy({ documentId })
        ]);
        setData({ ocr, analysis, summary, keywords, entities });
      } catch (err) {
        console.error('Failed to load AI data', err);
      }
    }
    if (documentId) loadAI();
  }, [documentId]);

  if (!data.ocr && !data.analysis) {
    return (
      <SphereSectionCard title="AI Intelligence">
        <EmptyState
          iconName="scan-outline"
          title="Not Analyzed"
          description="This document has not been processed by AI yet."
        />
      </SphereSectionCard>
    );
  }

  const keywordString = data.keywords.map(k => k.keyword).join(', ');
  const entityString = data.entities.map(e => e.value).join(', ');

  return (
    <SphereSectionCard title="AI Intelligence">
      <SphereInfoRow label="OCR Status" value={data.ocr ? "Completed" : "Pending"} />
      {data.analysis?.classification && (
        <SphereInfoRow label="Classification" value={data.analysis.classification} />
      )}
      {data.summary?.shortSummary && (
        <SphereInfoRow label="Summary" value={data.summary.shortSummary} />
      )}
      {keywordString ? (
        <SphereInfoRow label="Keywords" value={keywordString} />
      ) : null}
      {entityString ? (
        <SphereInfoRow label="Entities" value={entityString} showDivider={false} />
      ) : null}
    </SphereSectionCard>
  );
}
