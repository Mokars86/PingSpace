import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';

interface SpaceMember {
  id: string;
  name: string;
  avatar?: string;
  isSelected: boolean;
}

const CreateSpaceScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [spaceData, setSpaceData] = useState({
    name: '',
    description: '',
    category: 'general' as 'general' | 'business' | 'family' | 'friends' | 'project',
    isPrivate: false,
  });
  
  const [spaceImage, setSpaceImage] = useState<string | undefined>();
  const [selectedMembers, setSelectedMembers] = useState<SpaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock contacts for member selection
  const [availableContacts] = useState<SpaceMember[]>([
    { id: '1', name: 'Alice Johnson', isSelected: false },
    { id: '2', name: 'Bob Smith', isSelected: false },
    { id: '3', name: 'Carol Davis', isSelected: false },
    { id: '4', name: 'David Wilson', isSelected: false },
    { id: '5', name: 'Emma Brown', isSelected: false },
    { id: '6', name: 'Frank Miller', isSelected: false },
  ]);

  const spaceCategories = [
    { id: 'general', name: 'General', icon: 'chatbubbles', description: 'General discussions' },
    { id: 'business', name: 'Business', icon: 'briefcase', description: 'Work and business' },
    { id: 'family', name: 'Family', icon: 'home', description: 'Family members' },
    { id: 'friends', name: 'Friends', icon: 'people', description: 'Friend groups' },
    { id: 'project', name: 'Project', icon: 'construct', description: 'Project collaboration' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    createButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginLeft: 'auto',
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    imageSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    imageContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    spaceImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.inputBackground,
    },
    imagePlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePlaceholderText: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    editImageButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.accent,
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 80,
      textAlignVertical: 'top',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    categoryCardSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    categoryIcon: {
      marginBottom: theme.spacing.sm,
    },
    categoryName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    categoryDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    privacyToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    privacyInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    privacyTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    privacyDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    toggleButton: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.accent,
    },
    toggleCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleCircleActive: {
      alignSelf: 'flex-end',
    },
    membersList: {
      maxHeight: 200,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    memberItemSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    memberInitials: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    memberName: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    selectedCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to change the space image.');
      return;
    }

    Alert.alert(
      'Change Space Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openImagePicker() },
        { text: 'Remove Image', onPress: () => setSpaceImage(undefined), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSpaceImage(result.assets[0].uri);
    }
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSpaceImage(result.assets[0].uri);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    const contact = availableContacts.find(c => c.id === memberId);
    if (!contact) return;

    const isCurrentlySelected = selectedMembers.some(m => m.id === memberId);
    
    if (isCurrentlySelected) {
      setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
    } else {
      setSelectedMembers(prev => [...prev, { ...contact, isSelected: true }]);
    }
  };

  const handleCreateSpace = async () => {
    if (!spaceData.name.trim()) {
      Alert.alert('Error', 'Please enter a space name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Space Created! 🎉',
        `"${spaceData.name}" has been created successfully with ${selectedMembers.length} members.`,
        [
          {
            text: 'View Space',
            onPress: () => {
              // Navigate to the created space
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create space. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const canCreate = () => {
    return spaceData.name.trim() && selectedMembers.length > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Space</Text>
        <TouchableOpacity
          style={[styles.createButton, !canCreate() && { backgroundColor: theme.colors.textMuted }]}
          onPress={handleCreateSpace}
          disabled={!canCreate() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Space Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {spaceImage ? (
              <Image source={{ uri: spaceImage }} style={styles.spaceImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {spaceData.name ? getInitials(spaceData.name) : 'SP'}
                </Text>
              </View>
            )}
            <View style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Space Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter space name"
              placeholderTextColor={theme.colors.textMuted}
              value={spaceData.name}
              onChangeText={(text) => setSpaceData(prev => ({ ...prev, name: text }))}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What's this space about?"
              placeholderTextColor={theme.colors.textMuted}
              value={spaceData.description}
              onChangeText={(text) => setSpaceData(prev => ({ ...prev, description: text }))}
              multiline
              maxLength={200}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {spaceCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  spaceData.category === category.id && styles.categoryCardSelected,
                ]}
                onPress={() => setSpaceData(prev => ({ ...prev, category: category.id as any }))}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={spaceData.category === category.id ? theme.colors.accent : theme.colors.text}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.privacyToggle}
            onPress={() => setSpaceData(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
          >
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>Private Space</Text>
              <Text style={styles.privacyDescription}>
                {spaceData.isPrivate 
                  ? 'Only invited members can join' 
                  : 'Anyone with the link can join'
                }
              </Text>
            </View>
            <View style={[styles.toggleButton, spaceData.isPrivate && styles.toggleButtonActive]}>
              <View style={[styles.toggleCircle, spaceData.isPrivate && styles.toggleCircleActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Member Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Members</Text>
          <Text style={styles.selectedCount}>
            {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
          </Text>
          <ScrollView style={styles.membersList} nestedScrollEnabled>
            {availableContacts.map((contact) => {
              const isSelected = selectedMembers.some(m => m.id === contact.id);
              return (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.memberItem, isSelected && styles.memberItemSelected]}
                  onPress={() => toggleMemberSelection(contact.id)}
                >
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitials}>{getInitials(contact.name)}</Text>
                  </View>
                  <Text style={styles.memberName}>{contact.name}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateSpaceScreen;
