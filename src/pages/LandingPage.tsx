import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import getLandingStyles from '../theme/landingPageStyles';
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
  const width = Dimensions.get('window').width;
  const styles = getLandingStyles(width);

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

