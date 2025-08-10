import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import PollService from '../../services/PollService';

interface CreatePollProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
  currentUserId: string;
  onPollCreated?: (pollId: string) => void;
}

const CreatePoll: React.FC<CreatePollProps> = ({
  visible,
  onClose,
  chatId,
  currentUserId,
  onPollCreated,
}) => {
  const { theme } = useTheme();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const expirationOptions = [
    { label: 'No expiration', value: null },
    { label: '1 hour', value: 60 },
    { label: '6 hours', value: 360 },
    { label: '1 day', value: 1440 },
    { label: '3 days', value: 4320 },
    { label: '1 week', value: 10080 },
  ];

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    } else {
      Alert.alert('Limit Reached', 'You can add up to 10 options maximum.');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      Alert.alert('Minimum Required', 'A poll must have at least 2 options.');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    // Validation
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question for your poll.');
      return;
    }

    const validOptions = options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 options for your poll.');
      return;
    }

    if (validOptions.some(opt => opt.length > 100)) {
      Alert.alert('Error', 'Option text cannot exceed 100 characters.');
      return;
    }

    setIsCreating(true);

    try {
      const poll = await PollService.createPoll(
        question.trim(),
        validOptions,
        chatId,
        currentUserId,
        {
          isAnonymous,
          allowMultipleVotes,
          expiresIn: expiresIn || undefined,
        }
      );

      onPollCreated?.(poll.id);
      resetForm();
      onClose();
      Alert.alert('Success', 'Poll created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setIsAnonymous(false);
    setAllowMultipleVotes(false);
    setExpiresIn(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    createButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
    },
    createButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    createButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    questionInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    optionsContainer: {
      marginBottom: theme.spacing.md,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    optionInput: {
      flex: 1,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    removeOptionButton: {
      padding: theme.spacing.sm,
    },
    addOptionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    addOptionText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '50',
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    expirationOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    expirationOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedExpiration: {
      backgroundColor: theme.colors.accent + '20',
      borderColor: theme.colors.accent,
    },
    expirationText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    selectedExpirationText: {
      color: theme.colors.accent,
    },
    characterCount: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'right',
      marginTop: theme.spacing.xs,
    },
    overLimit: {
      color: theme.colors.error,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Poll</Text>
          <TouchableOpacity
            style={[
              styles.createButton,
              (isCreating || !question.trim() || options.filter(opt => opt.trim()).length < 2) &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreatePoll}
            disabled={isCreating || !question.trim() || options.filter(opt => opt.trim()).length < 2}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="What would you like to ask?"
              placeholderTextColor={theme.colors.textMuted}
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={200}
            />
            <Text style={[styles.characterCount, question.length > 180 && styles.overLimit]}>
              {question.length}/200
            </Text>
          </View>

          {/* Options Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <View key={index} style={styles.optionItem}>
                  <TextInput
                    style={styles.optionInput}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor={theme.colors.textMuted}
                    value={option}
                    onChangeText={(value) => handleOptionChange(index, value)}
                    maxLength={100}
                  />
                  {options.length > 2 && (
                    <TouchableOpacity
                      style={styles.removeOptionButton}
                      onPress={() => handleRemoveOption(index)}
                    >
                      <Ionicons name="remove-circle" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            {options.length < 10 && (
              <TouchableOpacity style={styles.addOptionButton} onPress={handleAddOption}>
                <Ionicons name="add" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.addOptionText}>Add option</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Anonymous voting</Text>
                <Text style={styles.settingDescription}>
                  Hide who voted for each option
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Multiple votes</Text>
                <Text style={styles.settingDescription}>
                  Allow users to select multiple options
                </Text>
              </View>
              <Switch
                value={allowMultipleVotes}
                onValueChange={setAllowMultipleVotes}
                trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Expiration Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Poll Duration</Text>
            <View style={styles.expirationOptions}>
              {expirationOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.expirationOption,
                    expiresIn === option.value && styles.selectedExpiration,
                  ]}
                  onPress={() => setExpiresIn(option.value)}
                >
                  <Text
                    style={[
                      styles.expirationText,
                      expiresIn === option.value && styles.selectedExpirationText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CreatePoll;
