import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import useSentenceStore from '../store/sentenceStore';

export default function TabManager() {
  const { tabs, activeTab, addTab, deleteTab, setActiveTab, newTabName, setNewTabName } = useSentenceStore();

  const handleAddTab = () => {
    if (newTabName.trim()) {
      addTab(newTabName.trim());
    }
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={styles.tabText}>{tab}</Text>
            {tab !== 'Default' && (
              <TouchableOpacity onPress={() => deleteTab(tab)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>x</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.addTabContainer}>
        <TextInput
          style={styles.input}
          placeholder="New tab name"
          value={newTabName}
          onChangeText={setNewTabName}
        />
        <Button title="Add Tab" onPress={handleAddTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#cce5ff',
  },
  tabText: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 2,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  addTabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});
