
import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
    const loadingCount = useSelector(
        state => state.loading.count
    );

    if (loadingCount === 0) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        </View>
    );
};

export default GlobalLoader;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 9999,
        elevation: 9999,
    },
    loaderContainer: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
});