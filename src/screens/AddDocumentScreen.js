import React from 'react';

import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereActionCard } from '../components/cards/SphereActionCard';

export default function AddDocumentScreen() {
  return (
    <ScreenContainer scrollable>
      <SpherePageHeader
        title="Add to Vault"
        subtitle="Choose how you want to add a new document."
      />

      <SphereSectionCard>
        <SphereActionCard
          title="Scan Document"
          subtitle="Use camera to scan physical pages"
          icon="camera"
          onPress={() => {}}
        />
        <SphereActionCard
          title="Import PDF"
          subtitle="Select a PDF from your device"
          icon="document-text"
          onPress={() => {}}
        />
        <SphereActionCard
          title="Import Image"
          subtitle="Choose an image from your gallery"
          icon="image"
          onPress={() => {}}
        />
        <SphereActionCard
          title="Create Folder"
          subtitle="Organize your documents"
          icon="folder"
          onPress={() => {}}
        />
      </SphereSectionCard>
    </ScreenContainer>
  );
}
