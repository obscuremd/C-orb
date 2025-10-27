import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { avatarImages } from '@/lib/constants';
import { router } from 'expo-router';
import { Register } from '@/services/AuthServices';
import { TouchableOpacity } from 'react-native';
import { useModal } from '@/providers/ModalProvider';
import CustomAlert from '@/components/LocalComponents/ModalElements/CustomAlert';
import { useGen } from '@/providers/GeneralProvider';

export default function Index() {
  const { setModalVisible, setElement, setPosition } = useModal();
  const { userLoginState } = useGen();

  const [data, setData] = useState({
    username: '',
    email: userLoginState.email,
    phoneNumber: '',
    profilePicture: '',
    coverPicture: '',
    bio: '',
    location: '',
    password: userLoginState.password,
  });

  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    setLoading(true);
    const submissionData = {
      ...data,
      phoneNumber: data.phoneNumber.startsWith('+234')
        ? data.phoneNumber
        : `+234${data.phoneNumber}`,
    };
    try {
      const result = await Register(submissionData);

      if (result.status === 'success') {
        setModalVisible(true);
        setElement(
          <CustomAlert variant="success" title={result.title} description={result.message} />
        );
        setPosition('start');
        setTimeout(() => {
          router.push('/(main)/home');
        }, 2000);
      } else {
        setModalVisible(true);
        setPosition('start');
        setElement(
          <CustomAlert variant="destructive" title={result.title} description={result.message} />
        );
        console.log(result.title);
        console.log(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 gap-8 p-4">
      {/* Header */}
      <View className="gap-2">
        <Text className="text-title1 font-bold text-primary">Tell us About Yourself</Text>
        <Text className="text-title2 font-light text-primary">
          Fill out this form so we can personalize your experience and deliver the best service for
          you.
        </Text>
      </View>

      {/* Avatar Picker */}
      <View className="gap-4">
        <Image
          source={{
            uri: data.profilePicture || avatarImages[0],
          }}
          className="h-10 w-10 rounded-full"
        />
        <Text className="text-title2 font-semibold text-primary">Select an Avatar</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2 flex-row gap-4">
          {avatarImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setData((prev) => ({
                  ...prev,
                  profilePicture: image,
                  coverPicture: image,
                }))
              }>
              <Image source={{ uri: image }} className="h-16 w-16 rounded-full object-fill" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Form Inputs */}
      <View className="gap-4">
        <Input
          placeholder="Username"
          value={data.username}
          onChangeText={(text) => setData((prev) => ({ ...prev, username: text }))}
        />

        <View className="flex-row items-center">
          <Text className="mr-2 pl-5 text-base text-primary">+234</Text>
          <Input
            className="flex-1"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={data.phoneNumber}
            onChangeText={(text) =>
              // Remove +234 if user deletes it manually
              setData((prev) => ({
                ...prev,
                phoneNumber: text,
              }))
            }
          />
        </View>
        <Input
          placeholder="Bio"
          value={data.bio}
          onChangeText={(text) => setData((prev) => ({ ...prev, bio: text }))}
        />
        <Input
          placeholder="Residential Address"
          value={data.location}
          onChangeText={(text) => setData((prev) => ({ ...prev, location: text }))}
        />
      </View>

      {/* Button */}
      <Button onPress={handleRegistration} disabled={loading}>
        <Text className="text-title2 font-light text-primary-foreground">
          {loading ? 'Registering...' : 'Continue'}
        </Text>
      </Button>
    </View>
  );
}
