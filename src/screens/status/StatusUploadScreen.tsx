import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import { useStatus } from '../../contexts/StatusContext';
import { StatusUploadData } from '../../types';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

type StatusUploadScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StatusUpload'>;

interface StatusUploadScreenProps {
  navigation: StatusUploadScreenNavigationProp;
}

const StatusUploadScreen: React.FC<StatusUploadScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { uploadStatus, isUploading } = useStatus();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'contacts' | 'close_friends'>('contacts');
  const [textStatus, setTextStatus] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ff1744');
  const [mode, setMode] = useState<'image' | 'text'>('image');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    headerButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    headerButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
    },
    content: {
      flex: 1,
    },
    modeSelector: {
      flexDirection: 'row',
      margin: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
    },
    modeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    },
    activeModeButton: {
      backgroundColor: theme.colors.accent,
    },
    modeButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeModeButtonText: {
      color: '#FFFFFF',
    },
    imageContainer: {
      flex: 1,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.inputBackground,
      minHeight: 400,
    },
    imagePlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: theme.borderRadius.lg,
    },
    placeholderText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
    },
    textStatusContainer: {
      flex: 1,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
    },
    textStatusInput: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
      textAlign: 'center',
      width: '100%',
    },
    colorPalette: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
      flexWrap: 'wrap',
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: theme.spacing.xs,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: '#FFFFFF',
    },
    captionContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    captionInput: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    privacyContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    privacyTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    privacyOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    privacyOption: {
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
    },
    selectedPrivacyOption: {
      backgroundColor: theme.colors.accent,
    },
    privacyOptionText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    selectedPrivacyOptionText: {
      color: '#FFFFFF',
    },
    uploadButton: {
      margin: theme.spacing.md,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    uploadButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      marginLeft: theme.spacing.sm,
    },
    disabledButton: {
      backgroundColor: theme.colors.textMuted,
    },
  });

  const backgroundColors = [
    '#ff1744', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUpload = async () => {
    if (mode === 'image' && !selectedImage) {
      Alert.alert('No image selected', 'Please select an image to upload.');
      return;
    }

    if (mode === 'text' && !textStatus.trim()) {
      Alert.alert('No text entered', 'Please enter some text for your status.');
      return;
    }

    try {
      const uploadData: StatusUploadData = {
        type: mode,
        mediaUri: mode === 'image' ? selectedImage || undefined : undefined,
        text: mode === 'text' ? textStatus : undefined,
        backgroundColor: mode === 'text' ? backgroundColor : undefined,
        textColor: '#FFFFFF',
        caption: caption.trim() || undefined,
        privacy,
      };

      await uploadStatus(uploadData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Upload failed', 'Failed to upload status. Please try again.');
    }
  };

  const canUpload = () => {
    if (mode === 'image') return selectedImage;
    if (mode === 'text') return textStatus.trim();
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>New Status</Text>
        
        <TouchableOpacity
          style={[styles.headerButton, !canUpload() && styles.disabledButton]}
          onPress={handleUpload}
          disabled={!canUpload() || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.headerButtonText}>Share</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'image' && styles.activeModeButton]}
            onPress={() => setMode('image')}
          >
            <Text style={[
              styles.modeButtonText,
              mode === 'image' && styles.activeModeButtonText
            ]}>
              Image
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, mode === 'text' && styles.activeModeButton]}
            onPress={() => setMode('text')}
          >
            <Text style={[
              styles.modeButtonText,
              mode === 'text' && styles.activeModeButtonText
            ]}>
              Text
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'image' ? (
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <TouchableOpacity onPress={showImageOptions}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.imagePlaceholder} onPress={showImageOptions}>
                <Ionicons name="camera" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.placeholderText}>Tap to add photo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={[styles.textStatusContainer, { backgroundColor }]}>
            <TextInput
              style={styles.textStatusInput}
              placeholder="What's on your mind?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={textStatus}
              onChangeText={setTextStatus}
              multiline
              textAlign="center"
            />
            
            <View style={styles.colorPalette}>
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    backgroundColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setBackgroundColor(color)}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption..."
            placeholderTextColor={theme.colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
          />
        </View>

        <View style={styles.privacyContainer}>
          <Text style={styles.privacyTitle}>Who can see this?</Text>
          <View style={styles.privacyOptions}>
            {[
              { key: 'public', icon: 'globe-outline', label: 'Public' },
              { key: 'contacts', icon: 'people-outline', label: 'Contacts' },
              { key: 'close_friends', icon: 'heart-outline', label: 'Close Friends' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.privacyOption,
                  privacy === option.key && styles.selectedPrivacyOption,
                ]}
                onPress={() => setPrivacy(option.key as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={privacy === option.key ? '#FFFFFF' : theme.colors.textSecondary}
                />
                <Text style={[
                  styles.privacyOptionText,
                  privacy === option.key && styles.selectedPrivacyOptionText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatusUploadScreen;
