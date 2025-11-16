import { StyleSheet } from 'react-native';



export const COLORS = {
    brand: '#1F4E46',
    text: '#102420',
    bg: '#E9F5EC',
    border: '#DCEFE2',
    muted: '#345a52',
    danger: '#B3261E',
    success: '#2E7D32',
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: '#E9F5EC' },
    containerList: { flex: 1, backgroundColor: '#E9F5EC' },
    section: { padding: 16 },

    iconMd: { fontSize: 24 },
    iconLg: { fontSize: 30 }, // use for tab icons

    chip: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: '#fff',
    },

    chipRow: { flexDirection: 'row', gap: 8, marginTop: 8 },

    imageFallback: {
        width: '100%',
        height: 160,
        backgroundColor: '#F4FAF6',
        borderRadius: 12,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    // tighter vertical rhythm
    h1: { fontSize: 22, fontWeight: '700', color: COLORS.brand, marginBottom: 10 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    cardSubtitle: { fontSize: 13, color: COLORS.muted, marginBottom: 3 },


    chipButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#DCEFE2',
    },
    chipButtonText: {
        fontWeight: '600',
    },

    // Inline banner (permissions, etc.)
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#FFF8E1',
        borderWidth: 1,
        borderColor: '#FFE9B2',
        marginBottom: 12,
    },
    bannerText: { color: '#7A4E00', flex: 1, marginLeft: 8 },
    bannerAction: { color: COLORS.brand, fontWeight: '700' },

    // Typography
    h1: { fontSize: 26, fontWeight: '700', color: '#102420', marginBottom: 12 },
    h2: { fontSize: 20, fontWeight: '600', color: '#1F4E46', marginBottom: 8 },
    listItem: { fontSize: 16, color: '#102420' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#102420', marginBottom: 6 },
    cardSubtitle: { color: '#4F6F68', fontSize: 15, marginBottom: 4 },
    cardValue: { fontSize: 17, fontWeight: '700', color: '#1F4E46' },

    // Cards
    card: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        marginBottom: 12,
    },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: {
        backgroundColor: '#A3D9A5',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    separator: { height: 12 },
    listContent: { padding: 16 },

    // Buttons
    primaryButton: {
        backgroundColor: '#1F4E46',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 14,
    },
    primaryButtonSmall: {
        backgroundColor: '#1F4E46',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginRight: 8,
    },
    primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

    secondaryButton: {
        backgroundColor: '#A3D9A5',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        flexDirection: 'row',
    },
    secondaryButtonSmall: {
        backgroundColor: '#C6E7C8',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    secondaryButtonText: { color: '#102420', fontWeight: '700', fontSize: 15 },

    // Inputs
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F4E46',
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#C8E0CA',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#102420',
    },

    // Links
    linkButton: { alignItems: 'center', marginTop: 12 },
    linkText: { color: '#1F4E46', fontWeight: '600', fontSize: 15 },


    //Til authcontainer: 
    authLogo: {
        // increased 20% from 120 -> 144
        width: 144,
        height: 144,
        marginBottom: 20,
    },
    authCard: {
        width: '90%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    authHeader: {
        fontSize: 28,
        fontWeight: '800',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 24,
    },

    // Generic icon scale (apply where icon components use this style)
    icon: {
        transform: [{ scale: 1.2 }],
    },

    // Layout Helpers
    row: { flexDirection: 'row', marginTop: 8 },
    switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
});

export default styles;
