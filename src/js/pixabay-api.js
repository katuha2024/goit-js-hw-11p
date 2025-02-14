export default function getRequestURL(requestWords) {
  const API_KEY = '48738449-8ffa6e5ebe5c10d7deb01fabe';

  const requestImageParam = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
  };

  let URL =
    'https://pixabay.com/api/?key=' +
    `${API_KEY}` +
    '&q=' +
    encodeURIComponent(requestWords);

  for (const param in requestImageParam) {
    URL += `&${param}=${requestImageParam[param]}`;
  }

  return URL;
}