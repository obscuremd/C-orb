import { ActivityIndicator, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '../ui/button';
import { CloudCheck, PictureInPicture } from 'lucide-react-native';

interface Props {
  imageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder?: string;
  stretch?: boolean;
}

const ImageUploadUi = ({
  imageUrl,
  setImageUrl,
  stretch = false,
  placeholder = 'Select An Image',
}: Props) => {
  // constants
  // ----------------------------------------------------------------------------------
  const storage = getStorage();

  // states
  // ----------------------------------------------------------------------------------
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // functions
  // -----------------------------------------------------------------------------------

  // image picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  // image upload
  const uploadPic = async () => {
    setLoading(true);
    if (!image) {
      return;
    }

    const response = await fetch(image); // Fetch the file from the local URI
    const blob = await response.blob(); // Convert it into a Blob

    const ImageRef = ref(storage, `files/${Date.now()}-image`);

    try {
      const upload = await uploadBytes(ImageRef, blob);
      const url = await getDownloadURL(upload.ref);
      setImageUrl(url);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View
      className={`${stretch ? 'w-full' : 'w-[150px]'} border-grayscale-800 relative h-[150px] items-center justify-center gap-2 rounded-lg border-[1px] border-dashed`}>
      {image === null ? (
        <>
          <Button onPress={pickImageAsync}>
            <PictureInPicture />
          </Button>
          <View>
            <Text>{placeholder}</Text>
          </View>
        </>
      ) : imageUrl === null ? (
        <View className="relative w-full">
          <Image
            source={{ uri: image }}
            className={`${stretch ? 'w-full' : 'w-[140px]'} h-[140px]`}
          />
          <BlurView
            intensity={100}
            tint="dark"
            className={`absolute ${stretch ? 'w-full' : 'w-[140px]'} h-[140px] items-center justify-center gap-2`}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button onPress={pickImageAsync}>
                  <PictureInPicture />
                </Button>
              </>
            )}
          </BlurView>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          className={`${stretch ? 'w-full' : 'w-[140px]'} h-[140px]`}
        />
      )}
    </View>
  );
};

export default ImageUploadUi;
