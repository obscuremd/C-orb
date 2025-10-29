import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

// const url = 'http://192.168.191.34:5184/api/User';
const url = 'https://c-orb.onrender.com/api/User';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}
interface RegisterParams {
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
  location?: string;
  password: string;
}

export async function Authenticate(
  email: string,
  password: string
): Promise<{
  status: 'success' | 'error';
  title: string;
  message: string;
}> {
  if (email === '' || password === '') {
    return {
      status: 'error',
      title: 'Missing Credentials',
      message: 'Your email or password seems to be missing',
    };
  }
  try {
    const result = await axios.post(`${url}/authenticate`, { email, password });
    if (result.status === 200) {
      return {
        status: 'success',
        title: 'Otp Sent for authentication',
        message: 'Otp has been successfully sent to your email',
      };
    } else {
      return {
        status: 'error',
        title: 'Error Authenticating ',
        message: result.data.message,
      };
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return {
      status: 'error',
      title: 'Error Signing Up',
      message: 'Seems to be an error from our end, try signing again',
    };
  }
}

export async function VerifyOtp(
  email: string,
  code: number
): Promise<{
  status: 'success' | 'error';
  title: string;
  message: string;
  hasAccount?: boolean;
}> {
  if (email === '' || !code) {
    return {
      status: 'error',
      title: 'Missing Credientals',
      message: 'Your email or password seems to be missing',
    };
  }
  try {
    const result = await axios.post(`${url}/authenticate-verify-otp`, {
      email,
      code,
    });

    if (result.status === 200) {
      if (result.data.hasAccount) {
        try {
          await SecureStore.setItemAsync('UserToken', result.data.token);
        } catch (error) {
          return {
            status: 'error',
            title: 'Error',
            message: 'Error Caching Token',
          };
        }
      }
      return {
        status: 'success',
        title: 'Otp Verified',
        message: result.data.hasAccount
          ? "You're All ready to Go!!"
          : 'Seems you dont have an account with us yet!!',
        hasAccount: result.data.hasAccount,
      };
    } else {
      return {
        status: 'error',
        title: 'Error Authenticating ',
        message: result.data.message,
      };
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));

    return {
      status: 'error',
      title: 'Error Signing Up',
      message: 'Seems to be an error from our end, try signing again',
    };
  }
}

export async function Register({
  username,
  email,
  phoneNumber,
  profilePicture = '',
  coverPicture = '',
  bio = '',
  location = '',
  password,
}: RegisterParams): Promise<{
  status: 'success' | 'error';
  title: string;
  message: string;
}> {
  // Validate required fields
  if (!username || !email || !phoneNumber || !password || !bio || !location) {
    return {
      status: 'error',
      title: 'Missing Fields',
      message: 'Please fill in all required fields (Username, Email, PhoneNumber, Password).',
    };
  }

  try {
    const res = await axios.post(`${url}/register`, {
      username,
      email,
      phoneNumber,
      profilePicture,
      coverPicture,
      bio,
      location,
      password,
    });
    if (res.status === 200) {
      return {
        status: 'success',
        title: 'Registration Successful',
        message: res.data.message || 'Your account has been created successfully.',
      };
    } else {
      return {
        status: 'error',
        title: 'Error Signing Up',
        message: res.data.message,
      };
    }
  } catch (err: any) {
    console.log(err);
    return {
      status: 'error',
      title: 'Registration Failed',
      message: 'internal server error',
    };
  }
}

export async function GetUser(): Promise<{ status: boolean; user?: User }> {
  const token = await SecureStore.getItemAsync('UserToken');
  if (!token) {
    return { status: false };
  }
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp > now) {
      try {
        const result = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (result.status === 200) {
          return { status: true, user: result.data.user };
        } else {
          await SecureStore.deleteItemAsync('UserToken');
          return { status: false };
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('UserToken');
        return { status: false };
      }
    } else {
      await SecureStore.deleteItemAsync('UserToken');
      return { status: false };
    }
  } catch (error) {
    await SecureStore.deleteItemAsync('UserToken');
    return { status: false };
  }
}
export async function Logout() {}
