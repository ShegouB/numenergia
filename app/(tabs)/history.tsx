import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getSimulations } from '@/services/storage';

export default function HistoryScreen() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getSimulations().then(setData);
  }, []);

  return (
    <View style={styles.container}>
      
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>📅 {new Date(item.date).toLocaleString()}</Text>
            <Text style={styles.content}>{item.result}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 16, backgroundColor: '#eee', padding: 12, borderRadius: 8 },
  date: { fontSize: 12, color: '#555' },
  content: { fontSize: 16 },
});
