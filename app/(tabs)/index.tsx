// app/index.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Zap, Lightbulb, LayoutGrid, Database } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NUMENERGIA</Text>
        <Text style={styles.subtitle}>
          Plateforme numérique pour l’accès à une énergie durable en milieu rural.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objectif</Text>
        <Text style={styles.text}>
          Développer un outil intelligent pour simuler et recommander des systèmes énergétiques
          renouvelables adaptés aux communautés rurales.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fonctionnalités Clés</Text>

        <View style={styles.feature}>
          <Zap size={20} color="#10B981" style={styles.icon} />
          <Text style={styles.text}>Simulation énergétique sur mesure</Text>
        </View>
        <View style={styles.feature}>
          <Lightbulb size={20} color="#F59E0B" style={styles.icon} />
          <Text style={styles.text}>Recommandations personnalisées</Text>
        </View>
        <View style={styles.feature}>
          <LayoutGrid size={20} color="#3B82F6" style={styles.icon} />
          <Text style={styles.text}>Interface intuitive web et mobile</Text>
        </View>
        <View style={styles.feature}>
          <Database size={20} color="#8B5CF6" style={styles.icon} />
          <Text style={styles.text}>Base de données collaborative</Text>
        </View>
      </View>

      {/* CARD DESIGN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prêt à commencer ?</Text>
        <Text style={styles.cardText}>
          Lancez une simulation énergétique personnalisée selon votre localisation.
        </Text>

        <Link href="./simulate" asChild>
          <Button className="mt-4">
            Lancer une simulation
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#0f172a', // bleu nuit futuriste
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22d3ee', // cyan électrique
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#38bdf8',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#f1f5f9',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 12,
  },
});
