import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Linking,
  ScrollView
} from 'react-native';
import { 
  Download, 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function DownloadsPage() {
  const navigation = useNavigation<any>();

  const handleDownload = () => {
    if (Platform.OS === 'web') {
      window.location.href = '/kiddo-app.apk';
    } else {
      Linking.openURL('https://example.com/download');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Downloads</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Smartphone color="#6366f1" size={48} />
          </View>
          <Text style={styles.title}>KidTasker Mobile</Text>
          <Text style={styles.version}>Version 1.0.0 (Latest)</Text>
          
          <Text style={styles.description}>
            Take the KidTasker experience with you! Install our mobile app to get real-time 
            notifications, use voice commands, and let your kids manage tasks on their own devices.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
               <CheckCircle2 color="#22c55e" size={20} />
               <Text style={styles.featureText}>Real-time push notifications</Text>
            </View>
            <View style={styles.featureItem}>
               <CheckCircle2 color="#22c55e" size={20} />
               <Text style={styles.featureText}>Voice-enabled task creation</Text>
            </View>
            <View style={styles.featureItem}>
               <CheckCircle2 color="#22c55e" size={20} />
               <Text style={styles.featureText}>Offline mode support</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Download color="#fff" size={24} style={{ marginRight: 10 }} />
            <Text style={styles.downloadBtnText}>Download Android APK</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Note: You may need to enable "Install from Unknown Sources" in your Android settings to install this APK.
          </Text>
        </View>

        <View style={styles.infoSection}>
           <View style={styles.infoHeader}>
              <Info color="#64748b" size={20} />
              <Text style={styles.infoTitle}>How to Install</Text>
           </View>
           <View style={styles.steps}>
              <Text style={styles.step}>1. Click the download button above.</Text>
              <Text style={styles.step}>2. Once downloaded, open the .apk file.</Text>
              <Text style={styles.step}>3. If prompted, allow installations from your browser/file manager.</Text>
              <Text style={styles.step}>4. Click "Install" and you're ready to go!</Text>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
    marginBottom: 24,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  downloadBtn: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
  infoSection: {
    width: '100%',
    maxWidth: 500,
    marginTop: 40,
    paddingHorizontal: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  steps: {
    gap: 12,
  },
  step: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  }
});
