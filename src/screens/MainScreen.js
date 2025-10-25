import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import useSentenceStore from '../store/sentenceStore';
import SentenceItem from '../components/SentenceItem';
import TagCloud from '../components/TagCloud';
import TabManager from '../components/TabManager';

export default function MainScreen() {
  const {
    sentencesByTab,
    activeTab,
    addSentence,
    text,
    setText,
    filterTag,
    setFilterTag,
  } = useSentenceStore();
  const [sortOrder, setSortOrder] = useState('newest');

  const sentences = sentencesByTab[activeTab] || [];

  const handleAddSentence = () => {
    if (text.trim()) {
      addSentence(text);
      setText('');
    }
  };

  const topTags = useMemo(() => {
    const tagCounts = sentences.reduce((acc, sentence) => {
      sentence.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([tag]) => tag);
  }, [sentences]);

  const handleTagClick = (tag) => {
    setFilterTag(tag);
  };

  const filteredAndSortedSentences = sentences
    .filter(s => {
      if (!filterTag) return true;
      const filterTags = filterTag.trim().toLowerCase().split(' ');
      return filterTags.every(tag => s.tags.map(t => t.toLowerCase()).includes(tag));
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'mostUsed':
          return b.count - a.count;
        case 'leastUsed':
          return a.count - b.count;
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Silver Tongued</Text>
      <TabManager />
      <TagCloud tags={topTags} onTagClick={handleTagClick} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a sentence"
          value={text}
          onChangeText={setText}
        />
        <Button title="Clear" onPress={() => setText('')} />
        <Button title="Add" onPress={handleAddSentence} />
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter by tag"
          value={filterTag}
          onChangeText={setFilterTag}
        />
        <Button title="Clear" onPress={() => setFilterTag('')} />
        <Button title="Sort: Newest" onPress={() => setSortOrder('newest')} />
        <Button title="Sort: Most Used" onPress={() => setSortOrder('mostUsed')} />
      </View>
      <Text style={styles.sentenceCount}>
        {sentences.length} / 100
      </Text>
      <FlatList
        data={filteredAndSortedSentences}
        keyExtractor={(item) => item.createdAt.toString()}
        renderItem={({ item }) => <SentenceItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterContainer: {
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
  sentenceCount: {
    marginBottom: 10,
  },
});