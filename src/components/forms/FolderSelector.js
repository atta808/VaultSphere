import React, { useState, useEffect } from 'react';
import { Logger } from '../../utils/logger/Logger';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import VaultService from '../../services/vault/VaultService';
import { Modal, Portal, RadioButton } from 'react-native-paper';

export const FolderSelector = ({ selectedFolderId, onSelect }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const [folders, setFolders] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const flds = await VaultService.getAllFolders();
        setFolders(flds);
      } catch (error) {
        Logger.error('Failed to load folders for selector', error);
      }
    };
    loadFolders();
  }, []);

  const selectedFolderName = selectedFolderId
    ? folders.find(f => f.id === selectedFolderId)?.name || 'Root Vault'
    : 'Root Vault';

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing[16], marginBottom: spacing[16] }]}
        onPress={() => setVisible(true)}
      >
        <View style={styles.leftContent}>
           <Ionicons name="folder-outline" size={24} color={colors.primary} />
           <View style={{ marginLeft: spacing[12] }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Importing to</Text>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>{selectedFolderName}</Text>
           </View>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
          <Text style={[styles.modalTitle, { color: colors.text, marginBottom: spacing[16] }]}>Select Destination Folder</Text>

          <RadioButton.Group onValueChange={newValue => { onSelect(newValue === 'root' ? null : newValue); setVisible(false); }} value={selectedFolderId || 'root'}>
            <TouchableOpacity onPress={() => { onSelect(null); setVisible(false); }} style={[styles.option, { borderBottomColor: colors.border }]}>
               <Text style={{ color: colors.text, fontSize: 16 }}>Root Vault</Text>
               <RadioButton value="root" color={colors.primary} />
            </TouchableOpacity>

            {folders.map(folder => (
               <TouchableOpacity key={folder.id} onPress={() => { onSelect(folder.id); setVisible(false); }} style={[styles.option, { borderBottomColor: colors.border }]}>
                 <Text style={{ color: colors.text, fontSize: 16 }}>{folder.name}</Text>
                 <RadioButton value={folder.id} color={colors.primary} />
               </TouchableOpacity>
            ))}
          </RadioButton.Group>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    margin: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  }
});
