import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const url = 'https://c-orb.onrender.com/api/Social';

export async function createPost({
  Description,
  PostUrl,
  Location,
  TagIds,
}: {
  Description: string;
  PostUrl: string;
  Location: string;
  TagIds: Array<Number>;
}): Promise<{ status: 'success' | 'error'; title: string; message: string; data: Post | null }> {
  const token = await SecureStore.getItemAsync('UserToken');
  if (!token)
    return {
      status: 'error',
      title: 'Invalid Token',
      message: 'Token Not found',
      data: null,
    };
  if (Description == '' || PostUrl == '' || Location == '')
    return {
      status: 'error',
      title: 'empty Fields',
      message: 'Fields must be properly filled',
      data: null,
    };
  if (TagIds.length < 2)
    return { status: 'error', title: 'Tags Empty', message: 'add at least 2 tags', data: null };

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
    const response = await axios.post(`${url}/get-posts?param=${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
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
      data: [],
    };
  }
}
