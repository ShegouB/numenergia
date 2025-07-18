// app/index.tsx
import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
        🌿 NUMENERGIA
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        Une plateforme numérique pour optimiser l’accès à l’énergie durable
        dans les zones rurales.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        ⚡ Objectif :
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Concevoir, simuler et recommander des systèmes énergétiques
        renouvelables adaptés aux besoins des communautés rurales.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        🧩 Fonctionnalités :
      </Text>
      <Text>• Simulation énergétique sur mesure</Text>
      <Text>• Recommandations personnalisées</Text>
      <Text>• Interface intuitive</Text>
      <Text style={{ marginBottom: 16 }}>• Base de données collaborative</Text>

      <Link href="./simulate" asChild>
        <Button className="mt-8">Lancer une simulation</Button>
      </Link>
    </ScrollView>
  );
}
