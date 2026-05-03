import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryColor = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes("cnc")) return Colors.cnc;
    if (lowerCat.includes("assembly")) return Colors.assembly;
    if (lowerCat.includes("finishing") || lowerCat.includes("finish"))
      return Colors.finishing;
    if (lowerCat.includes("carpentry")) return Colors.carpentry;
    return Colors.accent;
  };

  const color = getCategoryColor(category);

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default CategoryBadge;
