import { Stack } from 'expo-router';
import NodeHeaderScreen from './NodeItem/node[id]';
export default function RootLayout() {
  return (
    <Stack>
      <NodeHeaderScreen></NodeHeaderScreen>
    </Stack>
  );
}
