import { Stack } from 'expo-router';
import NodeHeaderScreen from './node';
export default function RootLayout() {
  return (
    <Stack>
      <NodeHeaderScreen></NodeHeaderScreen>
    </Stack>
  );
}
