import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: '#E9F5EC' },
    containerList: { flex: 1, backgroundColor: '#E9F5EC' },
    section: { padding: 16 },

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
        width: 120,
        height: 120,
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


    // Layout Helpers
    row: { flexDirection: 'row', marginTop: 8 },
    switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
});

export default styles;
