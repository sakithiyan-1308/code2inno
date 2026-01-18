export const getDeviceCapabilities = () => {
    // Basic mobile detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    return {
        isMobile,
        // High quality shadows only on desktop
        shadows: !isMobile,
        // Lower dpr on mobile to save battery/gpu
        dpr: isMobile ? 1 : [1, 2],
        // Post processing can be expensive
        postProcessing: !isMobile,
        // Texture resolution tier
        textureQuality: isMobile ? 'low' : 'high'
    };
};
