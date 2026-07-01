import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import SearchBar from "../../../compoent/SearchBar";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { GET_API } from "../../../Api/apiRequest";
import { image_url } from "../../../constant";
import imageIndex from "../../../assets/imageIndex";

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const { token } = useSelector((state: any) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSearchResults(searchQuery);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    const res = await GET_API(`shops/search?q=${query}`, token, "GET", setLoading);
    console.log(res, 'res')
    if (res?.success) {
      setResults(res.options || []);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => navigation.navigate(ScreenNameEnum.DetailScreen, { providerData: { _id: item.value, shopName: item.label, name: item.label } })}
    >
      <View style={styles.companyContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
          <Text style={styles.companyName}>{item.label}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09BFCD" }}>
      <StatusBarComponent backgroundColor="#09BFCD" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: "#F7FBFD" }}>
        <View style={{ backgroundColor: "#09BFCD", paddingBottom: 15 }}>
          <View style={{ marginHorizontal: 10, marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} >
              <Image source={imageIndex.back} style={{ height: 40, width: 40 }} resizeMode="contain" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <SearchBar
                placeholder="Search Services or Companies"
                searchBar1={{ marginTop: 0, marginBottom: 0 }}
                value={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#09BFCD" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.value || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20 }}
            ListEmptyComponent={() => (
              searchQuery.trim().length > 0 && !loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No results found</Text>
              ) : null
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  companyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    // elevation: 2,
    // borderWidth: 1,
    borderColor: '#eee',
  },
  companyContent: { padding: 16 },
  companyName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", flex: 1 },
  typeBadge: {
    backgroundColor: '#E8F8FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: '#09BFCD',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize'
  }
});

export default SearchScreen;
