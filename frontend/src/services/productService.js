import axios from '../utils/axios';

export const ProductService = {
  // Összes termék lekérése
  getAllProducts: async () => {
    const response = await axios.get('/products/get_products');
    try {
      return response.data;
    } catch (error) {
      console.error('Hiba a termékek lekérésekor:', error);
      throw error;
    }
  },

  // termék lekérése ID alapján
  getProductById: async (id) => {
    try {
      const response = await axios.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú termék lekérésekor:`, error);
      throw error;
    }
  },

  // Új termék hozzáadása
  addProduct: async (productData) => {
    try {
      const response = await axios.post('/products/add_product', productData);
      return response.data;
    } catch (error) {
      console.error('Hiba a termék hozzáadásakor:', error);
      throw error;
    }
  },

  // Termék frissítése
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`/products/${id}`, productData);
      console.log('response:', response);
      console.log('productData:', productData);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú termék frissítésekor:`, error);
      throw error;
    }
  },

  // Termék törlése
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú termék törlésekor:`, error);
      throw error;
    }
  }
};
