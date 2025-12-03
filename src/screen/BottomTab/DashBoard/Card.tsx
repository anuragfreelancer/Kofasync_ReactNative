import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { color } from '../../../constant';

const CompanyCard = ({ company }) => {
  return (
    <TouchableOpacity style={styles.companyCard}>
      <View style={styles.companyHeader}>
        <Image source={company.logo} style={styles.companyLogo} />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyLocation}>{company.location}</Text>
          <Text style={styles.companyDownloads}>{company.downloads} Downloads</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>${company.rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewServicesButton}>
        <Text style={styles.viewServicesText}>View Services</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  companyCard: {
    backgroundColor: color.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: color.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.textPrimary,
    marginBottom: 4,
  },
  companyLocation: {
    fontSize: 12,
    color: color.textSecondary,
    marginBottom: 2,
  },
  companyDownloads: {
    fontSize: 12,
    color: color.textLight,
  },
  ratingContainer: {
    backgroundColor: color.success,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.white,
  },
  viewServicesButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewServicesText: {
    color: color.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
export default CompanyCard;