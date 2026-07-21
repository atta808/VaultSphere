import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import { useTheme } from '../../../hooks/useTheme';

/**
 * Robust PDF Renderer using react-native-pdf.
 * Provides scrolling, zoom, and page navigation.
 */
const PDFRenderer = ({ uri, onPageChange, currentPage, setTotalPages }) => {
  const { colors, typography } = useTheme();
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jump to the current page if it changes from outside
    if (pdfRef.current && currentPage) {
      pdfRef.current.setPage(currentPage);
    }
  }, [currentPage]);

  const source = { uri, cache: true };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pdf
        ref={pdfRef}
        source={source}
        onLoadComplete={(numberOfPages, _filePath) => {
          setLoading(false);
          if (setTotalPages) setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, _numberOfPages) => {
          if (onPageChange) onPageChange(page);
        }}
        onError={(err) => {
          console.log(err);
          setError(err);
          setLoading(false);
        }}
        style={[styles.pdf, { backgroundColor: colors.background }]}
        enablePinchZoom={true}
        spacing={10}
      />

      {loading && (
         <View style={[StyleSheet.absoluteFillObject, styles.center, { backgroundColor: colors.background }]}>
           <ActivityIndicator size="large" color={colors.primary} />
         </View>
      )}

      {error && (
        <View style={[StyleSheet.absoluteFillObject, styles.center, { backgroundColor: colors.background }]}>
          <Text style={[typography.body, { color: colors.error }]}>Failed to load PDF</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PDFRenderer;
