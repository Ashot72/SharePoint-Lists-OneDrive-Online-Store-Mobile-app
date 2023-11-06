import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import Button from "./Button";
import { LIGHTGRAY } from "../../colors";

interface IImagePicker {
  aspectRatio: string;
  onTakeImage: (imageUri: string) => void;
}

const ImagePicker = ({ aspectRatio, onTakeImage }: IImagePicker) => {
  const [pickedImage, setPickedImage] = useState<string>();

  const [useCameraPermissionInformation, requirePermission] =
    useCameraPermissions();

  const verifyPermissions = async () => {
    if (
      useCameraPermissionInformation?.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requirePermission();

      return permissionResponse.granted;
    }

    if (useCameraPermissionInformation?.status === PermissionStatus.DENIED) {
      const permissionResponse = await requirePermission();

      if (permissionResponse.granted) {
        return true;
      }

      Alert.alert(
        "Insufficient permissions!",
        "You need to grant permissions to use this app.",
      );
      return false;
    }

    return true;
  };

  const takeImageHandler = async (isCamera: boolean) => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    let image: ImagePickerResult;

    if (isCamera) {
      image = await launchCameraAsync({
        allowsEditing: true,
        aspect: [+aspectRatio.charAt(0), +aspectRatio.charAt(2)],
        quality: 1,
      });
    } else {
      image = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [+aspectRatio.charAt(0), +aspectRatio.charAt(2)],
        quality: 1,
      });
    }

    const uri = image.assets ? image.assets[0].uri : null;

    if (uri) {
      setPickedImage(uri);
      onTakeImage(uri);
    }
  };

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>
        {imagePreview}
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={() => takeImageHandler(true)}>
          Take Photo
        </Button>
        <Button style={styles.button} onPress={() => takeImageHandler(false)}>
          Select Image
        </Button>
      </View>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: LIGHTGRAY,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    flex: 0.5,
    padding: 5,
  },
});
