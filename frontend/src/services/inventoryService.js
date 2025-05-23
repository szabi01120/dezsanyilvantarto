import axios from '../utils/axios';

export const InventoryService = {
  // Összes készlet tétel lekérése
  getAllInventory: async () => {
    try {
      const response = await axios.get('/inventory/get_inventory');
      return response.data;
    } catch (error) {
      console.error('Hiba a készlet lekérésekor:', error);
      throw error;
    }
  },

  // Statisztikák lekérése
  getStatistics: async () => {
    try {
      const response = await axios.get('/inventory/statistics');
      return response.data;
    } catch (error) {
      console.error('Hiba a statisztikák lekérésekor:', error);
      throw error;
    }
  },

  // Készlet mozgások lekérése
  getInventoryMovements: async (inventoryId) => {
    try {
      const response = await axios.get(`/inventory/${inventoryId}/movements`);
      return response.data;
    } catch (error) {
      console.error('Hiba a készletmozgások lekérésekor:', error);
      throw error;
    }
  },

  // Alacsony készletű termékek
  getLowStockItems: async (threshold = 5) => {
    try {
      const response = await axios.get(`/inventory/low_stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      console.error('Hiba az alacsony készletű termékek lekérésekor:', error);
      throw error;
    }
  }
};
