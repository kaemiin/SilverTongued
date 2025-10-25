import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TagCloud({ tags, onTagClick }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Top Tags:</Text>
      {tags.map((tag, index) => (
        <TouchableOpacity key={index} onPress={() => onTagClick(tag)}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  tagText: {
    fontSize: 12,
  },
});
