// components/ui/button.tsx
import { Pressable, Text, PressableProps } from 'react-native';

export function Button({ children, ...props }: PressableProps & { children: React.ReactNode }) {
  return (
    <Pressable
      style={{
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
      }}
      {...props}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{children}</Text>
    </Pressable>
  );
}
