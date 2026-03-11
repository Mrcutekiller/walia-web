// This file exists to satisfy expo-router's default route requirement.
// The actual first tab is 'ai'. This redirects to it.
import { Redirect } from 'expo-router';
export default function Index() {
  return <Redirect href="/(tabs)/ai" />;
}
