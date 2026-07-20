import React from 'react';
import { Text } from 'react-native';

/**
 * Utility to highlight matched text in a string.
 * @param {string} text - The original text.
 * @param {string} highlight - The query text to highlight.
 * @param {object} highlightStyle - React Native style object for the highlighted portion.
 * @param {object} baseStyle - React Native style object for the base text.
 * @returns {React.ReactNode}
 */
export function HighlightedText({ text, highlight, highlightStyle, baseStyle }) {
  if (!highlight || !text) {
    return <Text style={baseStyle}>{text}</Text>;
  }

  // FTS query might have wildcards/quotes, strip them for simple highlighting
  const cleanHighlight = highlight.replace(/[\*"]/g, '').trim();
  if (!cleanHighlight) {
    return <Text style={baseStyle}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${cleanHighlight})`, 'gi'));

  return (
    <Text style={baseStyle}>
      {parts.map((part, i) =>
        part.toLowerCase() === cleanHighlight.toLowerCase() ? (
          <Text key={i} style={highlightStyle}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}
