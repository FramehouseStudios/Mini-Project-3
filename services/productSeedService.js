const API_URL = 'https://fakestoreapi.com/products';

const fallbackProducts = [
  {
    id: 1,
    title: 'Canvas Field Backpack',
    price: 78.5,
    description: 'Durable everyday backpack with laptop storage and water-resistant canvas.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 4.4, count: 230 },
  },
  {
    id: 2,
    title: 'Minimal Gold Bracelet',
    price: 42,
    description: 'Polished bracelet for a clean jewelry collection and quick catalog demo.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 4.1, count: 190 },
  },
  {
    id: 3,
    title: 'Portable Solid State Drive',
    price: 109,
    description: 'Compact storage product used for electronics category testing.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 4,
    title: 'Soft Cotton Jacket',
    price: 55.99,
    description: 'Lightweight jacket for product search, sorting, and update examples.',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    rating: { rate: 4.3, count: 500 },
  },
];

const fetchExternalProducts = async () => {
  try {
    const response = await fetch(API_URL, { signal: AbortSignal.timeout(3000) });

    if (!response.ok) {
      throw new Error(`Fake Store API returned ${response.status}`);
    }

    return {
      source: 'Fake Store API',
      products: await response.json(),
    };
  } catch (_error) {
    return {
      source: 'Local fallback seed data',
      products: fallbackProducts,
    };
  }
};

module.exports = {
  fetchExternalProducts,
  fallbackProducts,
};
