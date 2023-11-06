import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BLACK, GRAY, MEDIUMSLATEBLUE, WHITE } from "../../colors";

interface IHorizontalList {
  data: any;
  itemIndex: number;
  navigate: (idOrIndex: number) => void;
  column: string;
}

const HorizontalList = (
  { data, itemIndex, navigate, column }: IHorizontalList,
) => {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 4,
        paddingHorizontal: 16,
        gap: 12,
      }}
      renderItem={({ item, index }) => {
        const isSelected = itemIndex === index;
        const arrayData = Array.isArray(item.fields);

        return (
          <TouchableOpacity
            onPress={() => navigate(arrayData ? index : item.id)}
            style={[styles.container, {
              backgroundColor: isSelected ? MEDIUMSLATEBLUE : WHITE,
              borderWidth: isSelected ? 0 : 0.25,
            }]}
          >
            <Text
              style={[styles.text, {
                color: isSelected ? WHITE : BLACK,
                opacity: isSelected ? 1 : 0.5,
              }]}
            >
              {arrayData ? "#" + item.fields[0][column] : item.fields[column]}
            </Text>
            {arrayData &&
              (
                <Text
                  style={[styles.text, {
                    color: isSelected ? WHITE : BLACK,
                    opacity: isSelected ? 1 : 0.5,
                  }]}
                >
                  {item.createdDate}
                </Text>
              )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderColor: GRAY,
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});

export default HorizontalList;
