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
import { ICategory, IProduct } from "../../interfaces";
import { useNavigation } from "@react-navigation/native";
import { blobToBase64 } from "../../helper";
import { useProductImage } from "../../hooks/useProducts";
import { formStyle } from "../../AppStyles";
import { LIGHTGRAY, MEDIUMSLATEBLUE } from "../../colors";

interface IProductForm {
  category: ICategory;
  product: IProduct;
  onProductSave: (product: IProduct) => void;
}

const ProductForm = ({ onProductSave, category, product }: IProductForm) => {
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(
    product ? (product.AspectRatio === 3 / 4 ? false : true) : false,
  );
  const [name, setName] = useState(product?.Title);
  const [description, setDescription] = useState(
    product ? product.Description : undefined,
  );
  const [count, setCount] = useState(
    product ? product.Count.toString() : undefined,
  );
  const [price, setPrice] = useState(
    product ? product.Price.toString() : undefined,
  );

  useEffect(() => {
    navigation.setOptions({
      title: name ? "Update Product" : "Add Product",
    });
  }, []);

  const [image, setImage] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string>();

  const { data: productImage } = product
    ? useProductImage(product!)
    : { data: null };

  useEffect(() => {
    (async () => {
      if (productImage) {
        const base64 = await blobToBase64(productImage);
        setImage(base64);
      }
    })();
  }, [productImage]);

  const takeImageHandler = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const onSave = () => {
    if (!name || !name.trim()) {
      Alert.alert("Warning", "Product Name is required.");
      return;
    }

    if (!description || !description.trim()) {
      Alert.alert("Warning", "Product Description is required.");
      return;
    }

    if (!count || !count.trim()) {
      Alert.alert("Warning", "Product Count is required.");
      return;
    } else {
      if (+count < 0 || !Number.isInteger(+count)) {
        Alert.alert("Warning", "Product Count must be a positive number.");
        return;
      }
    }

    if (!price || !price.trim()) {
      Alert.alert("Warning", "Product Price is required.");
      return;
    } else {
      if (+price < 0 || !/^-?\d+(\.\d+)?$/.test(price)) {
        Alert.alert(
          "Warning",
          "Product Price must be a positive (decimal) number.",
        );
        return;
      }
    }

    if (!product && !selectedImage) {
      Alert.alert("Warning", "Please 'Take Photo' or 'Select Image'.");
      return;
    }

    const prod = {
      Title: name,
      Description: description,
      Count: +count,
      Price: +price,
      ImageUrl: selectedImage,
      AspectRatio: isEnabled ? 4 / 3 : 3 / 4,
    } as IProduct;

    if (product) {
      prod.id = product.id;
      prod.WebUrl = product.WebUrl, prod.DriveFolder = product.DriveFolder;
    } else {
      prod.DriveFolder = category.DriveFolder,
        prod.CategoryLookupId = category.id!;
    }

    onProductSave(prod);
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
          <View style={formStyle.card}>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Description"
              style={formStyle.input}
              onChangeText={setDescription}
              value={description}
            />
          </View>
          <View style={formStyle.card}>
            <TextInput
              placeholder="Price"
              style={[formStyle.input, { height: 35 }]}
              onChangeText={setPrice}
              value={price}
            />
          </View>
          <View style={formStyle.card}>
            <TextInput
              placeholder="Count"
              style={[formStyle.input, { height: 35 }]}
              onChangeText={setCount}
              value={count}
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
            {product ? "Update Product" : "Add Product"}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductForm;
