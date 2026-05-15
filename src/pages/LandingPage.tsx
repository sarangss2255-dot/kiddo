import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import { 
  Download, 
  Rocket, 
  ShieldCheck, 
  Heart, 
  Star, 
  Layout, 
  Smartphone,
  Trophy
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const navigation = useNavigation<any>();

  const handleDownload = () => {
    navigation.navigate('Downloads');
  };

  const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
    <View style={styles.featureCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={32} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroTextContent}>
            <View style={styles.badge}>
              <Star color="#f59e0b" size={16} />
              <Text style={styles.badgeText}>The Ultimate Kid Productivity App</Text>
            </View>
            <Text style={styles.title}>
              Transform Chores into <Text style={styles.highlight}>Epic Quests</Text>
            </Text>
            <Text style={styles.subtitle}>
              Empower your children with responsibility, gamified tasks, and rewarding milestones. 
              The fun way to manage family routines.
            </Text>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Rocket color="#fff" size={24} style={{ marginRight: 10 }} />
                <Text style={styles.primaryButtonText}>Get Started Now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleDownload}
              >
                <Download color="#4f46e5" size={24} style={{ marginRight: 10 }} />
                <Text style={styles.secondaryButtonText}>Download Mobile App</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Device Mockup Preview (Simulated with View) */}
          <View style={styles.previewContainer}>
            <View style={styles.phoneFrame}>
               <View style={styles.phoneScreen}>
                  <View style={styles.mockHeader}>
                     <View style={styles.avatar} />
                     <View style={styles.mockTextShort} />
                  </View>
                  <View style={styles.mockCard} />
                  <View style={styles.mockCard} />
                  <View style={styles.mockCard} />
               </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Parents Love KidTasker</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard 
              icon={ShieldCheck} 
              title="Parental Control" 
              description="Manage tasks and approve rewards with a secure parent-only dashboard."
              color="#4f46e5"
            />
            <FeatureCard 
              icon={Trophy} 
              title="Gamified Rewards" 
              description="Kids earn points and badges for completing their daily responsibilities."
              color="#f59e0b"
            />
            <FeatureCard 
              icon={Layout} 
              title="Custom Routines" 
              description="Create unique schedules tailored to your family's needs and lifestyle."
              color="#10b981"
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Cross-Platform" 
              description="Access KidTasker on web or your mobile device anywhere, anytime."
              color="#ec4899"
            />
          </View>
        </View>

        {/* Download Call to Action */}
        <View style={styles.ctaSection}>
           <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Ready to join the adventure?</Text>
              <Text style={styles.ctaSubtitle}>Take the experience with you. Download our Android app today!</Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={handleDownload}
              >
                <Download color="#fff" size={24} style={{ marginRight: 10 }} />
                <Text style={styles.ctaButtonText}>Download for Android (APK)</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
           <Text style={styles.footerText}>© 2026 KidTasker. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
    flexDirection: Platform.OS === 'web' && width > 800 ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
  },
  heroTextContent: {
    flex: 1,
    maxWidth: Platform.OS === 'web' && width > 800 ? '50%' : '100%',
    marginBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
    gap: 8,
  },
  badgeText: {
    color: '#92400e',
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    fontSize: Platform.OS === 'web' && width > 800 ? 56 : 40,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: Platform.OS === 'web' && width > 800 ? 64 : 48,
    marginBottom: 20,
  },
  highlight: {
    color: '#6366f1',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 28,
    marginBottom: 40,
  },
  buttonGroup: {
    flexDirection: Platform.OS === 'web' && width > 500 ? 'row' : 'column',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 18,
    fontWeight: '700',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 280,
    height: 560,
    backgroundColor: '#1e293b',
    borderRadius: 40,
    padding: 12,
    borderWidth: 8,
    borderColor: '#334155',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  mockTextShort: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  mockCard: {
    width: '100%',
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 80,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 48,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    maxWidth: 1200,
  },
  featureCard: {
    width: Platform.OS === 'web' && width > 600 ? 280 : '100%',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  ctaCard: {
    backgroundColor: '#6366f1',
    padding: 48,
    borderRadius: 40,
    alignItems: 'center',
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    marginBottom: 32,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#6366f1',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
