import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';

import DocumentViewerService from '../services/viewer/DocumentViewerService';
import BookmarkService from '../services/viewer/BookmarkService';
import AnnotationService from '../services/viewer/AnnotationService';
import RecentPositionService from '../services/viewer/RecentPositionService';
import ViewerPreferenceService from '../services/viewer/ViewerPreferenceService';
import ThumbnailService from '../services/viewer/ThumbnailService';
import DocumentRepository from '../database/repositories/DocumentRepository';

// UI
import ViewerToolbar from '../components/viewer/ui/ViewerToolbar';
import AnnotationPanel from '../components/viewer/ui/AnnotationPanel';
import BookmarkPanel from '../components/viewer/ui/BookmarkPanel';
import ThumbnailSidebar from '../components/viewer/ui/ThumbnailSidebar';
import SearchInDocumentBar from '../components/viewer/ui/SearchInDocumentBar';
import ReadingProgressIndicator from '../components/viewer/ui/ReadingProgressIndicator';

// Renderers
import PDFRenderer from '../components/viewer/renderers/PDFRenderer';
import ImageRenderer from '../components/viewer/renderers/ImageRenderer';
import TextRenderer from '../components/viewer/renderers/TextRenderer';
import UnsupportedRenderer from '../components/viewer/renderers/UnsupportedRenderer';

const DocumentViewerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { documentId } = route.params;

  const [document, setDocument] = useState(null);
  const [preparedDoc, setPreparedDoc] = useState(null);
  const [rendererType, setRendererType] = useState('unsupported');
  const [loading, setLoading] = useState(true);

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Panels
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Data
  const [bookmarks, setBookmarks] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const loadPreferencesAndPosition = async (docId) => {
    const prefs = await ViewerPreferenceService.getPreferences();
    if (prefs.rememberLastPage) {
      const position = await RecentPositionService.getPosition(docId);
      if (position) {
        setCurrentPage(position.pageNumber || 1);
        setZoomLevel(position.zoomLevel || 1);
        setScrollPosition(position.scrollY || 0);
      }
    }
  };

  const loadSideData = async (docId) => {
    const b = await BookmarkService.getBookmarks(docId);
    setBookmarks(b || []);

    const a = await AnnotationService.getAnnotations(docId);
    setAnnotations(a || []);
  };

  const generateThumbnails = async (doc) => {
    // Basic mock of thumbnail generation. In reality, this queries the service per page.
    const thumbUri = await ThumbnailService.generateThumbnail(doc, 1);
    if (thumbUri) {
      setThumbnails([{ pageNumber: 1, uri: thumbUri }]);
    } else {
      setThumbnails([{ pageNumber: 1, uri: null }]);
    }
  };

  const saveReadingPosition = async () => {
    if (documentId) {
      await RecentPositionService.savePosition(documentId, {
        pageNumber: currentPage,
        zoomLevel,
        scrollY: scrollPosition
      });
    }
  };

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        const docRepo = new DocumentRepository();
        const doc = await docRepo.findById(documentId);

        if (!doc) {
          Alert.alert('Error', 'Document not found.');
          navigation.goBack();
          return;
        }
        setDocument(doc);

        const type = DocumentViewerService.getRendererType(doc.mimeType, doc.fileName);
        setRendererType(type);

        const prepared = await DocumentViewerService.prepareDocument(doc);
        setPreparedDoc(prepared);

        await loadPreferencesAndPosition(doc.id);
        await loadSideData(doc.id);

        // Async thumbnail generation
        generateThumbnails(doc);

      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load document.');
      } finally {
        setLoading(false);
      }
    };

    navigation.setOptions({ headerShown: false });
    loadDocument();
    return () => {
      // Cleanup on unmount
      saveReadingPosition();
      if (preparedDoc) {
        DocumentViewerService.cleanupDocument(preparedDoc.uri);
      }
    };
  }, [documentId, navigation, currentPage, zoomLevel, scrollPosition, preparedDoc]);

  // Handlers
  const handleAddBookmark = async (title) => {
    await BookmarkService.createBookmark({
      documentId,
      title,
      pageNumber: currentPage
    });
    loadSideData(documentId);
  };

  const handleAddAnnotation = async (type) => {
    await AnnotationService.createAnnotation({
      documentId,
      pageNumber: currentPage,
      type,
      content: 'New ' + type,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    loadSideData(documentId);
  };

  // Render Renderer
  const renderDocument = () => {
    if (!preparedDoc) return null;

    switch (rendererType) {
      case 'image':
        return (
          <ImageRenderer
            uri={preparedDoc.uri}
            onZoomChange={setZoomLevel}
          />
        );
      case 'text':
        return (
          <TextRenderer
            uri={preparedDoc.uri}
            initialScrollPosition={scrollPosition}
            onScrollPositionChange={setScrollPosition}
          />
        );
      case 'pdf':
        return (
          <PDFRenderer
            uri={preparedDoc.uri}
            currentPage={currentPage}
            setTotalPages={setTotalPages}
            onPageChange={setCurrentPage}
          />
        );
      default:
        return (
          <UnsupportedRenderer
            fileName={preparedDoc.fileName}
            mimeType={preparedDoc.mimeType}
          />
        );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showSearch ? (
        <SearchInDocumentBar
          onClose={() => setShowSearch(false)}
          currentMatch={0}
          totalMatches={0}
        />
      ) : (
        <ViewerToolbar
          onClose={() => navigation.goBack()}
          onToggleBookmarks={() => { setShowBookmarks(!showBookmarks); setShowAnnotations(false); setShowThumbnails(false); }}
          onToggleAnnotations={() => { setShowAnnotations(!showAnnotations); setShowBookmarks(false); setShowThumbnails(false); }}
          onToggleThumbnails={() => { setShowThumbnails(!showThumbnails); setShowBookmarks(false); setShowAnnotations(false); }}
          onSearch={() => setShowSearch(true)}
        />
      )}

      <View style={styles.viewerContainer}>
        {renderDocument()}
      </View>

      {/* Overlays */}
      <ReadingProgressIndicator currentPage={currentPage} totalPages={totalPages} />

      {showThumbnails && (
        <ThumbnailSidebar
          thumbnails={thumbnails}
          currentPage={currentPage}
          onSelectPage={(page) => { setCurrentPage(page); setShowThumbnails(false); }}
          onClose={() => setShowThumbnails(false)}
        />
      )}

      {showBookmarks && (
        <BookmarkPanel
          bookmarks={bookmarks}
          onClose={() => setShowBookmarks(false)}
          onAddBookmark={handleAddBookmark}
          onSelectBookmark={(b) => { setCurrentPage(b.pageNumber); setShowBookmarks(false); }}
        />
      )}

      {showAnnotations && (
        <AnnotationPanel
          annotations={annotations}
          onClose={() => setShowAnnotations(false)}
          onAddAnnotation={handleAddAnnotation}
          onSelectAnnotation={(a) => { setCurrentPage(a.pageNumber); setShowAnnotations(false); }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerContainer: {
    flex: 1,
    overflow: 'hidden',
  }
});

export default DocumentViewerScreen;
