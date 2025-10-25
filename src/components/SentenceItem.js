import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import useSentenceStore from '../store/sentenceStore';

export default function SentenceItem({ item }) {
  const { deleteSentence, incrementCount, cloneSentence, addTag, removeTag } = useSentenceStore();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(item.createdAt, newTag.trim());
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}${month}${day}`;
  };

  return (
    <View style={styles.sentenceContainer}>
      <View style={styles.sentenceDetails}>
        <Text style={styles.sentenceText}>{item.text}</Text>
        <Text style={styles.dateText}>Created: {formatDate(item.createdAt)}</Text>
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>Tags:</Text>
          {item.tags.map((tag, index) => (
            <TouchableOpacity key={index} onPress={() => removeTag(item.createdAt, tag)} style={styles.tag}>
              <Text style={styles.tagText}>{tag} (x)</Text>
            </TouchableOpacity>
          ))}
        </View>
        {isAddingTag && (
          <View style={styles.addTagContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="New tag"
              value={newTag}
              onChangeText={setNewTag}
            />
            <Button title="Clear" onPress={() => setNewTag('')} />
            <Button title="Save" onPress={handleAddTag} />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Copy" onPress={() => {
          navigator.clipboard.writeText(item.text);
          incrementCount(item.createdAt);
        }} />
        <Button title="Clone" onPress={() => cloneSentence(item.createdAt)} />
        <Button title="Tag" onPress={() => setIsAddingTag(!isAddingTag)} />
        <Button title="Del" onPress={() => deleteSentence(item.createdAt)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sentenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  sentenceDetails: {
    flex: 1,
    marginRight: 10,
  },
  sentenceText: {
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagsLabel: {
    fontStyle: 'italic',
    color: 'gray',
    marginRight: 5,
  },
  tag: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    margin: 2,
  },
  tagText: {
    fontSize: 12,
  },
  addTagContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tagInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
