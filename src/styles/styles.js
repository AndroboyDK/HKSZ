import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
    containerList: { flex: 1, backgroundColor: '#fff' },
    section: { padding: 16 },
    h1: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
    h2: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    list: { gap: 6 },
    listItem: { fontSize: 16 },
    card: {
        backgroundColor: '#f8f9fb',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    cardSubtitle: { color: '#555', marginBottom: 4 },
    cardValue: { fontSize: 16, fontWeight: '700' },
    badge: { backgroundColor: '#e8eefc', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
    separator: { height: 12 },
    listContent: { padding: 16 },
    primaryButton: {
        backgroundColor: '#2f6fed',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // 👈 add this
        marginTop: 12,
    },
    primaryButtonSmall: { backgroundColor: '#2f6fed', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
    primaryButtonText: { color: '#fff', fontWeight: '700' },
    secondaryButton: { backgroundColor: '#f1f3f5', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
    secondaryButtonSmall: { backgroundColor: '#f1f3f5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    secondaryButtonText: { color: '#111', fontWeight: '700' },
    row: { flexDirection: 'row', marginTop: 8 },
    inputLabel: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    linkButton: { alignItems: 'center', marginTop: 12 },
    linkText: { color: '#2f6fed', fontWeight: '600' },
    switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 }
});


export default styles;