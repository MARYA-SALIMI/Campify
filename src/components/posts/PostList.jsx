import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PostCard from './PostCard';

const PostList = ({
    posts = [],
    onPostPress,
    loading = false,
    onEndReached,
    ListHeaderComponent,
}) => {
    const renderItem = ({ item }) => (
        <PostCard post={item} onPress={onPostPress} />
    );

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyTitle}>Henüz gönderi yok</Text>
                <Text style={styles.emptyDesc}>Bu kategoride henüz paylaşım yapılmamış.</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!loading) return <View style={{ height: 24 }} />;
        return (
            <View style={styles.loaderRow}>
                <ActivityIndicator size="small" color="#10B981" />
                <Text style={styles.loaderText}>Yükleniyor...</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id || item._id)}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    list: {
        paddingTop: 8,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 44,
        marginBottom: 14,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 6,
    },
    emptyDesc: {
        fontSize: 13,
        color: '#374151',
        textAlign: 'center',
        lineHeight: 19,
    },
    loaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 10,
    },
    loaderText: {
        fontSize: 13,
        color: '#4B5563',
    },
});

export default PostList;