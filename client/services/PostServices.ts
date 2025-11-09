import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { UploadImage } from './GeneralServices';

const url = 'https://c-orb.onrender.com/api/Social';

import { Alert } from 'react-native';

export async function createPost({
  Description,
  Post,
  Location,
  TagIds,
}: {
  Description: string;
  Post: string;
  Location: string;
  TagIds: Array<number>;
}): Promise<{ status: 'success' | 'error'; title: string; message: string; data: Post | null }> {
  const token = await SecureStore.getItemAsync('UserToken');
  if (!token) {
    return { status: 'error', title: 'Invalid Token', message: 'Token Not found', data: null };
  }

  // ✅ Required field checks
  if (!Description || !Post || !Location) {
    return {
      status: 'error',
      title: 'Missing Fields',
      message: 'All fields must be filled.',
      data: null,
    };
  }

  // ✅ Backend validation equivalent checks
  if (Description.length < 10) {
    return {
      status: 'error',
      title: 'Description too short',
      message: 'Description must be at least 10 characters long.',
      data: null,
    };
  }

  if (Location.length < 5) {
    return {
      status: 'error',
      title: 'Location too short',
      message: 'Location must be at least 5 characters long.',
      data: null,
    };
  }

  if (TagIds.length < 5) {
    return {
      status: 'error',
      title: 'Not enough tags',
      message: 'Please select at least 5 tags.',
      data: null,
    };
  }

  // ✅ Upload Image
  const UploadedImage = await UploadImage(Post);

  if (UploadedImage.status === 'error') {
    return {
      status: 'error',
      title: 'Image Upload Failed',
      message: 'Image upload failed',
      data: null,
    };
  }

  const PostUrl = UploadedImage.data;

  try {
    const response = await axios.post(
      `${url}/create-post`,
      { Description, PostUrl, Location, TagIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      status: 'success',
      title: 'Post Created',
      message: response.data.message,
      data: response.data.post,
    };
  } catch (error: any) {
    return {
      status: 'error',
      title: 'Error creating post',
      message: error?.response?.data?.message || 'Unexpected error occurred',
      data: null,
    };
  }
}

export async function getPosts(
  param: string
): Promise<{ status: 'success' | 'error'; title: string; message: string; data: Feed[] }> {
  const token = await SecureStore.getItemAsync('UserToken');
  if (!token)
    return {
      status: 'error',
      title: 'Invalid Token',
      message: 'Token Not found',
      data: [],
    };
  try {
    const response = await axios.get(`${url}/get-posts?param=${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // console.log('response:', JSON.stringify(response.data.posts, null, 2));
    return {
      status: 'success',
      title: 'Post Created',
      message: response.data.message,
      data: response.data.posts,
    };
  } catch (error: any) {
    console.log(JSON.stringify(error, null, 2));
    return {
      status: 'error',
      title: 'Error getting post',
      message: error?.response?.data?.message || 'Unexpected error occurred',
      data: [],
    };
  }
}
