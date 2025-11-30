// pixabay-api.js
import axios from 'axios';


const API_KEY = '53389210-1518ce0ab28dfc8ed2510f80a';
const per_page = 15;

const pixabayInstance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  timeout: 10000,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page,
  },
});

export async function getImagesByQuery(query, page = 1) {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }
  try {
    const response = await pixabayInstance.get('', {
      params: {
        q: query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { per_page };
