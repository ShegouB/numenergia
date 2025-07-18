export type EnergyUsage = 'irrigation' | 'eclairage' | 'pompage' | 'stockage';

export function recommendSystem({
  sunlightHours,
  usage,
}: {
  sunlightHours: number;
  usage: EnergyUsage;
}) {
  if (sunlightHours < 3) {
    return 'Préconisation : Système hybride (solaire + batterie ou éolien)';
  }

  switch (usage) {
    case 'irrigation':
      return 'Préconisation : Système solaire avec pompe à haut débit';
    case 'eclairage':
      return 'Préconisation : Système solaire avec batterie 12V, LED basse conso';
    case 'pompage':
      return 'Préconisation : Système solaire direct avec régulateur de pompe';
    case 'stockage':
      return 'Préconisation : Système solaire + batteries Lithium-Ion de 200Ah';
    default:
      return 'Usage non reconnu';
  }
}
