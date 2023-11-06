import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icons from "@expo/vector-icons/MaterialIcons";
//@ts-ignore
import RCTNetworking from "react-native/Libraries/Network/RCTNetworking";
import { IAuth } from "../../interfaces";
import { BLACK, GRAY, WHITE } from "../../colors";
import { height, width } from "../../dimentions";
import Button from "../../components/shared/Button";
import { useGetPicture } from "../../hooks/useUsers";
import { blobToBase64 } from "../../helper";
import { useCreateLists } from "../../hooks/useListsGeneration";
import { DrawerStackScreenProps } from "../../navigators/DrawerNavigator";

const RegistrationScreen = (
  { navigation }: DrawerStackScreenProps<"Registration">,
) => {
  const isFocused = useIsFocused();

  const [profileImage, setProfileImage] = useState("");
  const [relativeUrl, setRelativeUrl] = useState("");

  const { data: userPicture, refetch } = useGetPicture();

  const createLists = useCreateLists(() => {});

  const [login, setLogin] = useState<IAuth | undefined>(undefined);

  const signOut = () =>
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          RCTNetworking.clearCookies(() => {});
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("auth");
          setLogin(undefined);
        },
      },
    ]);

  const getHost = (userPrincipalName: string) =>
    "https://" + userPrincipalName.split("@")[1].toLowerCase();

  const handleRelativesiteUrl = async (userPrincipalName: string) => {
    if (relativeUrl.trim() === "") {
      Alert.alert("Warning", "Please specify Relative Site URL.");
      return;
    }

    const url = getHost(userPrincipalName) + relativeUrl;

    await AsyncStorage.setItem("url", url);
    await AsyncStorage.setItem("relativeUrl", relativeUrl);

    try {
      await createLists();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  useEffect(() => {
    if (login) {
      refetch();
    }
  }, [login]);

  useEffect(() => {
    (async () => {
      const relativeUrl = await AsyncStorage.getItem("relativeUrl");
      setRelativeUrl(relativeUrl || "");
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        login
          ? (
            <View style={styles.logoutImage}>
              <Icons
                name="logout"
                color={tintColor}
                size={24}
                onPress={() => signOut()}
              />
            </View>
          )
          : <></>
      ),
    });
  }, [login]);

  useEffect(() => {
    (async () => {
      if (login && userPicture) {
        try {
          const base64 = await blobToBase64(userPicture);
          setProfileImage(base64);
        } catch (e: any) {
          Alert.alert("Error!", e.message);
        }
      }
    })();
  }, [login, userPicture]);

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem("auth");
      if (auth) {
        setLogin(JSON.parse(auth));
      }
    })();
  }, [isFocused]);

  return (
    (!login)
      ? (
        <View style={styles.Container}>
          <Text style={styles.loginTitle}>Sign In to Azure</Text>
          <View>
            <Button
              onPress={() => (navigation as any).navigate("SignIn")}
              style={{ marginTop: 5 }}
            >
              Sign In
            </Button>
          </View>
        </View>
      )
      : (
        <ImageBackground
          source={require("../../../assets/images/bg.png")}
          style={styles.bg}
        >
          <ScrollView style={styles.containerProfile}>
            {profileImage &&
              (
                <View>
                  <Image source={{ uri: profileImage }} style={styles.photo} />
                  <View style={styles.containerProfileItem}>
                    <Text style={styles.name}>{login.displayName}</Text>
                    <Text style={styles.descriptionProfileItem}>
                      {login.userPrincipalName}
                    </Text>
                    <Text style={styles.inputTitle}>Relative Site URL</Text>

                    <TextInput
                      placeholder={getHost(login.userPrincipalName)}
                      style={styles.input}
                      value={relativeUrl}
                      onChangeText={(text: string) => setRelativeUrl(text)}
                    />
                    <Button
                      onPress={() =>
                        handleRelativesiteUrl(login.userPrincipalName)}
                      style={{ marginTop: 5 }}
                    >
                      Save
                    </Button>
                  </View>
                </View>
              )}
          </ScrollView>
        </ImageBackground>
      )
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  loginTitle: {
    color: GRAY,
    textAlign: "center",
    fontSize: 18,
  },
  containerProfileItem: {
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingBottom: 25,
    margin: 20,
    borderRadius: 8,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    marginTop: -95,
  },
  name: {
    paddingTop: 25,
    paddingBottom: 5,
    fontSize: 15,
    textAlign: "center",
  },
  descriptionProfileItem: {
    color: GRAY,
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 13,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: width,
    height: height,
  },
  containerProfile: { marginHorizontal: 0 },
  photo: {
    width: width,
    height: 450,
  },
  inputTitle: {
    textAlign: "center",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
  },
  logoutImage: {
    marginRight: 15,
  },
});

export default RegistrationScreen;
