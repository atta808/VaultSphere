// Dedicated service for highlighting text from OCR / search matches
// as requested by requirements
import { Logger } from '../../utils/logger/Logger';

export class HighlightService {
  /**
   * Translates a search match (usually text index) into view coordinates
   * (bounding box) for rendering over the PDF/Image if OCR data is available.
   */
  getHighlightCoordinates(matchData, ocrData, pageDimensions) {
    if (!ocrData || !matchData) return null;

    // In a real implementation this would map string indices to OCR bounding boxes.
    // For now we return a dummy rect based on the page dimensions.
    return {
      x: 10,
      y: 10,
      width: 100,
      height: 20
    };
  }
}

export default new HighlightService();
