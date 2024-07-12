import axios from 'axios';

async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
const images = fetchData('https://api.be-practical.com/aws/images')

export { images };
