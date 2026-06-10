import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import imageIndex from '../assets/imageIndex';
import font from '../theme/font';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  bookingData?: any;
}

const ReviewModal = ({ visible, onClose, onSubmit, bookingData }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }
    onSubmit(rating, review);
    setRating(0);
    setReview('');
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Write a Review</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Image source={imageIndex.close} style={styles.closeIcon} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.label}>Rate your experience</Text>
                  
                  {/* Star Rating */}
                  <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity 
                        key={star} 
                        onPress={() => handleRating(star)}
                        activeOpacity={0.7}
                      >
                        <Image 
                          source={imageIndex.star} 
                          style={[
                            styles.starIcon, 
                            { tintColor: star <= rating ? '#FFCC00' : '#D1D1D1' }
                          ]} 
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Your Review (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Share your thoughts about the service..."
                    multiline
                    numberOfLines={4}
                    value={review}
                    onChangeText={setReview}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity 
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitText}>Submit Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: font.MonolithRegular,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    marginTop: 10,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  starIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    height: 120,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  submitBtn: {
    backgroundColor: '#09BFCD',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReviewModal;
