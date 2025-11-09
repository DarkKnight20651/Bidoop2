// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import api from "../api/client";

const { width: screenWidth } = Dimensions.get("window");

const DEFAULT_COORDS = {
  lat: 19.4326,
  lng: -99.1332,
};

const HERO_CAROUSEL_DATA = [
  {
    id: "1",
    title: "Vive experiencias únicas",
    subtitle: "Talleres de artesanía tradicional",
    image: "https://images.unsplash.com/photo-1541976590-713941681591?w=800",
    cta: "Explorar talleres",
    backgroundColor: "#8B4513",
  },
  {
    id: "2",
    title: "Descubre arte local",
    subtitle: "Mercados artesanales cerca de ti",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    cta: "Ver mercados",
    backgroundColor: "#A0522D",
  },
  {
    id: "3",
    title: "Aprende de maestros",
    subtitle: "Clases con artesanos expertos",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    cta: "Conocer maestros",
    backgroundColor: "#CD853F",
  }
];

export default function HomeScreen({ navigation }) {
  const [topPlaces, setTopPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 🔝 Lugares top
      const rankingRes = await api.get("/ranking/global?limit=5");
      setTopPlaces(rankingRes.data || []);

      // 📅 Eventos próximos
      const { lat, lng } = DEFAULT_COORDS;
      const eventsRes = await api.get(
        `/events/nearby?lat=${lat}&lng=${lng}&radius=10000&limit=5`
      );
      setEvents(eventsRes.data || []);

      // 🧺 Productos
      const productsRes = await api.get("/products");
      setProducts(productsRes.data || []);
    } catch (error) {
      console.log("Error cargando home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => 
        prevIndex === HERO_CAROUSEL_DATA.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const renderHeroCarousel = () => (
    <View style={styles.heroCarousel}>
      <FlatList
        data={HERO_CAROUSEL_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.heroSlide, { backgroundColor: item.backgroundColor }]}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{item.title}</Text>
              <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.heroCta}>
                <Text style={styles.heroCtaText}>{item.cta}</Text>
                <Text style={styles.arrowIcon}>➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentHeroIndex(newIndex);
        }}
      />
      
      <View style={styles.carouselIndicators}>
        {HERO_CAROUSEL_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentHeroIndex && styles.indicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderPlaceCard = ({ item, index }) => (
    <TouchableOpacity style={styles.placeCard} activeOpacity={0.9}>
      <View style={styles.placeRankBadge}>
        <Text style={styles.placeRankText}>{index + 1}</Text>
      </View>
      <View style={styles.placeImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.placeImage} />
        ) : (
          <View style={styles.placeImagePlaceholder}>
            <Text style={styles.placeholderText}>🏺</Text>
          </View>
        )}
      </View>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={1}>
          {item.name || "Lugar sin nombre"}
        </Text>
        <Text style={styles.placePoints}>{item.points || 0} pts</Text>
        {!!item.badges?.length && (
          <Text style={styles.placeBadges}>
            {item.badges.length} insignia{item.badges.length === 1 ? "" : "s"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => {
    const date = item.date ? new Date(item.date) : new Date();
    const day = date.getDate();
    const month = date.toLocaleString("es-MX", { month: "short" });

    return (
      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.85}
      >
        <View style={styles.eventDateBadge}>
          <Text style={styles.eventDateDay}>{day}</Text>
          <Text style={styles.eventDateMonth}>{month}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={1}>
            {item.name || "Evento sin nombre"}
          </Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description || "Descripción no disponible"}
          </Text>
          <View style={styles.eventLocation}>
            <Text style={styles.eventLocationText}>
              📍 {item.location || "Por confirmar"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductCard = (product, index) => (
    <TouchableOpacity
      key={product._id || index}
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("ProductDetail", { id: product._id })}
    >
      {product.url ? (
        <Image source={{ uri: product.url }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productPlaceholderText}>🛍️</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name || "Producto sin nombre"}
        </Text>
        <Text style={styles.productPrice}>${product.price || "0"}</Text>
        {product.place?.name && (
          <Text style={styles.productPlace} numberOfLines={1}>
            📍 {product.place.name}
          </Text>
        )}
        <View style={styles.productRating}>
          <Text style={styles.ratingText}>⭐ 4.8</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Cargando artesanías cercanas…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={["#8B4513"]}
          tintColor="#8B4513"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenida 👋</Text>
          <Text style={styles.subGreeting}>
            Descubre arte y experiencias únicas
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Carrusel Hero */}
      {renderHeroCarousel()}

      {/* Categorías */}
      <View style={styles.categoriesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {["Talleres", "Mercados", "Artesanos", "Eventos", "Productos"].map((category, index) => (
            <TouchableOpacity key={category} style={styles.categoryChip}>
              <Text style={styles.categoryIcon}>
                {["🎨", "🛍️", "👨‍🎨", "📅", "🏺"][index]}
              </Text>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lugares top */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lugares destacados 🌟</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {topPlaces.length === 0 ? (
          <Text style={styles.emptyText}>
            Aún no hay lugares en el ranking.
          </Text>
        ) : (
          <FlatList
            horizontal
            data={topPlaces}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderPlaceCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </View>

      {/* Próximos eventos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos eventos 📅</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay eventos próximos en tu zona.
          </Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderEventCard}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Productos recomendados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recomendados para ti 💫</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {products.length === 0 ? (
          <Text style={styles.emptyText}>
            Todavía no hay productos para mostrar.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {products.slice(0, 10).map((product, index) => renderProductCard(product, index))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const COLORS = {
  background: "#ffffffff",
  card: "#FFFFFF",
  primary: "#8B4513",
  primaryLight: "#A0522D",
  accent: "#CD853F",
  text: "#3B3027",
  muted: "#8C7B6A",
  border: "#E5D9CC",
  success: "#27AE60",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.muted,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  subGreeting: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5E6D3",
  },
  notificationIcon: {
    fontSize: 18,
  },
  heroCarousel: {
    height: 200,
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroSlide: {
    width: screenWidth - 40,
    height: 200,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    marginBottom: 12,
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroCtaText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  arrowIcon: {
    fontSize: 14,
    color: "#FFF",
  },
  carouselIndicators: {
    flexDirection: "row",
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: "#FFF",
    width: 20,
  },
  categoriesSection: {
    marginVertical: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionAction: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  placeCard: {
    width: 160,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeRankBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FFF9F0",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeRankText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
  placeImageContainer: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#F5E7D9",
  },
  placeImage: {
    width: "100%",
    height: "100%",
  },
  placeImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  placeInfo: {
    gap: 2,
  },
  placeName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  placePoints: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  placeBadges: {
    fontSize: 11,
    color: COLORS.muted,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventDateBadge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#FFF9F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  eventDateMonth: {
    fontSize: 12,
    textTransform: "uppercase",
    color: COLORS.primary,
    fontWeight: "600",
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
    lineHeight: 18,
  },
  eventLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventLocationText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  productCard: {
    width: 180,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImage: {
    width: "100%",
    height: 140,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5E7D9",
  },
  productPlaceholderText: {
    fontSize: 24,
  },
  productInfo: {
    padding: 12,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  productPlace: {
    fontSize: 12,
    color: COLORS.muted,
  },
  productRating: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.muted,
  },
});