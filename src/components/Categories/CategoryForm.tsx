import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import ImagePicker from "../shared/ImagePicker";
import Button from "../shared/Button";
import { ICategory } from "../../interfaces";
import { useNavigation } from "@react-navigation/native";
import { useCategories, useCategoryImage } from "../../hooks/useCategories";
import { blobToBase64 } from "../../helper";
import { formStyle } from "../../AppStyles";
import { LIGHTGRAY, MEDIUMSLATEBLUE } from "../../colors";

interface ICategoryForm {
  category?: ICategory | undefined;
  onCategorySave: (category: ICategory) => void;
}

const CategoryForm = ({ onCategorySave, category }: ICategoryForm) => {
  const navigation = useNavigation();
  const { data: categories } = useCategories();

  const [name, setName] = useState(category?.Title);
  const [isEnabled, setIsEnabled] = useState(
    category ? (category.AspectRatio === 3 / 4 ? false : true) : false,
  );

  useEffect(() => {
    navigation.setOptions({
      title: name ? "Update Category" : "Add Category",
    });
  }, []);

  const [image, setImage] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string>();

  const { data: categoryImage } = category
    ? useCategoryImage(category!)
    : { data: null };

  useEffect(() => {
    (async () => {
      if (categoryImage) {
        const base64 = await blobToBase64(categoryImage);
        setImage(base64);
      }
    })();
  }, [categoryImage]);

  const takeImageHandler = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const onSave = () => {
    if (!name || !name.trim()) {
      Alert.alert("Warning", "Category Name is required.");
      return;
    }

    if (!category && !selectedImage) {
      Alert.alert("Warning", "Please 'Take Photo' or 'Select Image'.");
      return;
    }

    if (category) {
      const exists = categories!.value.find((c: { fields: ICategory }) =>
        c.fields.Title.toLowerCase() === name.trim().toLowerCase() &&
        c.fields.id !== category.id
      );
      if (exists) {
        Alert.alert("Warning", `Category '${name.trim()}' already exists.`);
        return;
      }
    } else {
      const exists = categories!.value.some((c: { fields: ICategory }) =>
        c.fields.Title.toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) {
        Alert.alert("Warning", `Category '${name.trim()}' already exists.`);
        return;
      }
    }

    const cat = {
      Title: name,
      ImageUrl: selectedImage,
      AspectRatio: isEnabled ? 4 / 3 : 3 / 4,
    } as ICategory;

    if (category) {
      cat.id = category.id;
      cat.WebUrl = category.WebUrl;
      cat.DriveFolder = category.DriveFolder;
    } else {
      cat.DriveFolder = name;
    }

    onCategorySave(cat);
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <ScrollView>
      <View style={formStyle.container}>
        <View style={formStyle.formContainer}>
          <View style={formStyle.card}>
            <TextInput
              placeholder="Name"
              style={[formStyle.input, { height: 35 }]}
              onChangeText={setName}
              value={name}
            />
          </View>
          <View
            style={[formStyle.card, {
              justifyContent: "flex-start",
              flexDirection: "row",
            }]}
          >
            <Switch
              trackColor={{ false: LIGHTGRAY, true: MEDIUMSLATEBLUE }}
              thumbColor={isEnabled ? MEDIUMSLATEBLUE : LIGHTGRAY}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={formStyle.aspectRationContainer}>
              Image Aspect Ratio {isEnabled
                ? <Text style={formStyle.aspectRatio}>4:3</Text>
                : <Text style={formStyle.aspectRatio}>3:4</Text>}
            </Text>
          </View>
          {image &&
            (
              <View
                style={[{
                  aspectRatio: isEnabled ? 4 / 3 : 3 / 4,
                }, formStyle.imageContainer]}
              >
                <Image
                  source={{ uri: image }}
                  resizeMode="cover"
                  style={formStyle.image}
                />
              </View>
            )}
          <View style={formStyle.card}>
            <ImagePicker
              aspectRatio={isEnabled ? "4:3" : "3:4"}
              onTakeImage={takeImageHandler}
            />
          </View>
          <Button style={{ padding: 0 }} onPress={() => onSave()}>
            {category ? "Update Category" : "Add Category"}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CategoryForm;
