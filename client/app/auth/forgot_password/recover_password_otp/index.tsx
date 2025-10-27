import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import InputOTP from '@/components/ui/input-otp';

export default function index() {
  const [otp, setOtp] = useState('');
  return (
    <View className="flex-1 gap-8">
      <View className="gap-2">
        <Text className="text-title1 font-bold text-primary">Verify OTP</Text>
        <Text className="text-title2 font-light text-primary">
          Verify the 6 Digit otp sent to your email
        </Text>
      </View>
      <View className="gap-8 py-8">
        <InputOTP length={3} setValue={setOtp} />
        <Text className="text-title2 font-light text-primary">Didn’t Recieve OTP? Send Again</Text>
      </View>
      <Button onPress={() => router.push('/auth/login')}>
        <Text className="text-title2 font-light text-primary-foreground">Recover</Text>
      </Button>
    </View>
  );
}
