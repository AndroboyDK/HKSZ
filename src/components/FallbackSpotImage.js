// src/components/FallbackSpotImage.js
import React from 'react';
import { Image, View } from 'react-native';
import styles from '../styles/styles';

/**
 * Simple image with a graceful fallback.
 * - Pass `uri` to show the remote image
 * - Pass `style` to override size (defaults: full width x 160px)
 */
export default function FallbackSpotImage({ uri, style, resizeMode = 'cover' }) {
    if (uri) {
        return <Image source={{ uri }} style={[styles.imageFallback, style]} resizeMode={resizeMode} />;
    }
    return <View style={[styles.imageFallback, style]} />;
}
