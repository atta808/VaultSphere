import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';

// Screens
import KnowledgeDashboardScreen from '../screens/knowledge/KnowledgeDashboardScreen';
import KnowledgeGraphExplorerScreen from '../screens/knowledge/KnowledgeGraphExplorerScreen';
import SemanticSearchScreen from '../screens/knowledge/SemanticSearchScreen';
import AITopicsScreen from '../screens/knowledge/AITopicsScreen';
import RecommendationsScreen from '../screens/knowledge/RecommendationsScreen';
import RelatedDocumentsScreen from '../screens/knowledge/RelatedDocumentsScreen';
import RelationshipManagerScreen from '../screens/knowledge/RelationshipManagerScreen';

const Stack = createNativeStackNavigator();

export function KnowledgeStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.KNOWLEDGE_DASHBOARD}
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      <Stack.Screen
        name={ROUTES.KNOWLEDGE_DASHBOARD}
        component={KnowledgeDashboardScreen}
        options={{ title: 'Knowledge Graph' }}
      />
      <Stack.Screen
        name={ROUTES.KNOWLEDGE_GRAPH_EXPLORER}
        component={KnowledgeGraphExplorerScreen}
        options={{ title: 'Graph Explorer' }}
      />
      <Stack.Screen
        name={ROUTES.SEMANTIC_SEARCH}
        component={SemanticSearchScreen}
        options={{ title: 'Semantic Search' }}
      />
      <Stack.Screen
        name={ROUTES.AI_TOPICS}
        component={AITopicsScreen}
        options={{ title: 'AI Topics' }}
      />
      <Stack.Screen
        name={ROUTES.RECOMMENDATIONS}
        component={RecommendationsScreen}
        options={{ title: 'Recommendations' }}
      />
      <Stack.Screen
        name={ROUTES.RELATED_DOCUMENTS}
        component={RelatedDocumentsScreen}
        options={{ title: 'Related Documents' }}
      />
      <Stack.Screen
        name={ROUTES.RELATIONSHIP_MANAGER}
        component={RelationshipManagerScreen}
        options={{ title: 'Relationship Manager' }}
      />
    </Stack.Navigator>
  );
}
