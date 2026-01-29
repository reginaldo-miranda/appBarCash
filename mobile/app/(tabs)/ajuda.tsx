import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { SafeIcon } from '../../components/SafeIcon';
import { MANUAL_DATA, ManualCategory, ManualTopic } from '../../src/data/manualContent';
import ScreenIdentifier from '../../src/components/ScreenIdentifier';

export default function AjudaScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    if (selectedCategory === id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(id);
      setExpandedTopic(null); // Reset topic when changing category
    }
  };

  const toggleTopic = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenIdentifier screenName="Manual de Ajuda" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manual de Ajuda 📘</Text>
        <Text style={styles.headerSubtitle}>Tire suas dúvidas sobre o sistema</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {MANUAL_DATA.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <TouchableOpacity 
              style={[
                styles.categoryHeader, 
                selectedCategory === category.id && styles.categoryHeaderActive
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                 <View style={[styles.iconBox, { backgroundColor: selectedCategory === category.id ? '#fff' : '#E3F2FD' }]}>
                    <SafeIcon 
                        name={category.icon as any} 
                        size={24} 
                        color={selectedCategory === category.id ? '#1976D2' : '#1976D2'} 
                        fallbackText="" 
                    />
                 </View>
                 <View>
                    <Text style={[styles.categoryTitle, selectedCategory === category.id && { color: '#fff' }]}>
                        {category.title}
                    </Text>
                    <Text style={[styles.categoryDesc, selectedCategory === category.id && { color: '#E3F2FD' }]}>
                        {category.description}
                    </Text>
                 </View>
              </View>
              <SafeIcon 
                name={selectedCategory === category.id ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={selectedCategory === category.id ? '#fff' : '#999'} 
              />
            </TouchableOpacity>

            {selectedCategory === category.id && (
              <View style={styles.topicsList}>
                {category.topics.map((topic) => (
                   <View key={topic.id} style={styles.topicItem}>
                      <TouchableOpacity 
                        style={styles.topicHeader}
                        onPress={() => toggleTopic(topic.id)}
                      >
                         <Text style={[styles.topicTitle, expandedTopic === topic.id && { color: '#2196F3' }]}>
                            {topic.title}
                         </Text>
                         <SafeIcon 
                            name={expandedTopic === topic.id ? 'remove' : 'add'} 
                            size={18} 
                            color={expandedTopic === topic.id ? '#2196F3' : '#666'} 
                         />
                      </TouchableOpacity>
                      
                      {expandedTopic === topic.id && (
                        <View style={styles.topicContentBox}>
                           <Text style={styles.topicContentText}>
                              {topic.content}
                           </Text>
                        </View>
                      )}
                   </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryHeaderActive: {
    backgroundColor: '#2196F3',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  topicsList: {
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  topicItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  topicContentBox: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  topicContentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  }
});
