import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
import CustomInput from "../../../compoent/CustomInput";
import CustomButton from "../../../compoent/CustomButton";
import ImagePickerModal from "../../../compoent/ImagePickerModal";
import imageIndex from "../../../assets/imageIndex";
import { GetProfileApi, UpdateProfile } from "../../../Api/apiRequest";
import { BASE_URL, color, image_url } from "../../../constant";

const EditProfile = () => {
  const navigation = useNavigation();
  const userData: any = useSelector((state: any) => state.auth.userData);
  //  const isLogin:any = useSelector <any>((state) => state?.auth?.userData);
  console.log(userData, 'userData');
  const [fullName, setFullName] = useState(userData?.name || userData?.username || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [address, setAddress] = useState(userData?.address || "");
  const [image, setImage] = useState<any>(userData?.profileImage ? image_url + userData?.profileImage : null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone || userData?.phoneNumber || "");
  const [specialization, setSpecialization] = useState(userData?.specialization || "");
  const [experience, setExperience] = useState(userData?.experience?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isProvider = userData?.role === "Provider" || userData?.role === "provider";

  const getProfileApi = async () => {
    try {
      const response = await GetProfileApi(setIsLoading, dispatch);
    } catch (error) {
    }
  };

  useEffect(() => {
    getProfileApi();
  }, []);

  useEffect(() => {
    if (userData) {
      setFullName(userData?.name || userData?.username || "");
      setEmail(userData?.email || "");
      setAddress(userData?.address || "");
      setPhoneNumber(userData?.phone || userData?.phoneNumber || "");
      setSpecialization(userData?.specialization || "");
      setExperience(userData?.experience?.toString() || "");
      if (userData?.profileImage) {
        setImage(image_url + userData.profileImage);
      }
    }
  }, [userData]);

  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setIsModalVisible(false);
      }
    });
  };

  const takePhotoFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setIsModalVisible(false);
      }
    });
  };

  const handleSave = async () => {
    try {
      const params = {
        username: fullName,
        email: email,
        address: address,
        phone: phoneNumber,
        specialization: specialization,
        experience: experience,
        imagePrfoile: image,
        id: userData?.providerId || userData?._id,
        role: userData?.role,
      };
      console.log("UpdateProfile Params:", params);
      const response = await UpdateProfile(params, setIsLoading);

      if (response) {
        getProfileApi();
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader label="Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 'padding'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust offset if needed

      >
        <ScrollView contentContainerStyle={styles.container}

        >
          <View style={styles.profileContainer}>
            <Image
              source={image ? { uri: image.uri || image } : imageIndex.profile}
              style={styles.profileImage}
              resizeMode="cover"
            />

            {/* Edit Icon */}
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setIsModalVisible(true)}
            >
              <Image
                source={imageIndex.Editpen}
                style={styles.editIcon}
                resizeMode="contain"
                tintColor={'#fff'}
              />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              // leftIcon={<Image source={imageIndex.profiel} style={styles.icon} />}
              />

              <CustomInput
                placeholder="Contact"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              // leftIcon={<Image source={imageIndex.Phone1} style={styles.icon} />}
              />

              {isProvider && (
                <>
                  <CustomInput
                    placeholder="Specialization"
                    value={specialization}
                    onChangeText={setSpecialization}
                  />
                  <CustomInput
                    placeholder="Experience (Years)"
                    value={experience}
                    onChangeText={setExperience}
                    keyboardType="numeric"
                  />
                </>
              )}

              <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                editable={false}
              // leftIcon={<Image source={imageIndex.mess} style={styles.icon} />}
              />
              <CustomInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              // leftIcon={<Image source={imageIndex.location1} style={styles.icon} />}
              />
            </View>
          </View>

          {/* Image Picker Modal */}
          <ImagePickerModal
            modalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            pickImageFromGallery={pickImageFromGallery}
            takePhotoFromCamera={takePhotoFromCamera}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <CustomButton title="Save"
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative", // needed for absolute edit icon
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: color.primary
  },
  editIconContainer: {
    position: "relative",
    bottom: 20,
    right: 0,
    padding: 8,
    left: 16,
    backgroundColor: color.primary,

    borderRadius: 20
  },
  editIcon: {
    width: 16,
    height: 16,

  },
  inputContainer: {
    marginTop: 20,
    width: "90%",
  },
  icon: {
    width: 18,
    height: 18,
  },
  buttonContainer: {
    marginBottom: 30,
    marginHorizontal: 15,
  },
});

export default EditProfile;
