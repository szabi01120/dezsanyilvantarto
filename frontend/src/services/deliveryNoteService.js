import axios from '../utils/axios';

export const DeliveryNoteService = {
  // Összes szállítólevél lekérése
  getAllDeliveryNotes: async () => {
    try {
      const response = await axios.get('/delivery_notes/get_delivery_notes');
      return response.data;
    } catch (error) {
      console.error('Hiba a szállítólevelek lekérésekor:', error);
      throw error;
    }
  },

  // Szállítólevél lekérése ID alapján
  getDeliveryNoteById: async (id) => {
    try {
      const response = await axios.get(`/delivery_notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú szállítólevél lekérésekor:`, error);
      throw error;
    }
  },

  // Új szállítólevél létrehozása
  createDeliveryNote: async () => {
    try {
      const response = await axios.post('/delivery_notes/create_delivery_note');
      return response.data;
    } catch (error) {
      console.error('Hiba a szállítólevél létrehozásakor:', error);
      throw error;
    }
  },

  // Tétel hozzáadása szállítólevélhez
  addItemToDeliveryNote: async (deliveryNoteId, itemData) => {
    try {
      const response = await axios.post(`/delivery_notes/${deliveryNoteId}/add_item`, itemData);
      return response.data;
    } catch (error) {
      console.error('Hiba a tétel hozzáadásakor:', error);
      throw error;
    }
  },

  // Tétel módosítása szállítólevélben
  updateDeliveryNoteItem: async (deliveryNoteId, itemId, itemData) => {
    try {
      const response = await axios.put(`/delivery_notes/${deliveryNoteId}/items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Hiba a tétel módosításakor:', error);
      throw error;
    }
  },

  // Tétel törlése szállítólevélből
  deleteDeliveryNoteItem: async (deliveryNoteId, itemId) => {
    try {
      const response = await axios.delete(`/delivery_notes/${deliveryNoteId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Hiba a tétel törlésekor:', error);
      throw error;
    }
  },

  // Szállítólevél frissítése
  updateDeliveryNote: async (id, data) => {
    try {
      const response = await axios.put(`/delivery_notes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú szállítólevél frissítésekor:`, error);
      throw error;
    }
  },

  // Szállítólevél törlése
  deleteDeliveryNote: async (id) => {
    try {
      const response = await axios.delete(`/delivery_notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Hiba a(z) ${id} azonosítójú szállítólevél törlésekor:`, error);
      throw error;
    }
  },
  // ✅ ÚJ: Autocomplete szolgáltatás
  getProductAutocomplete: async (query) => {
    try {
      const response = await axios.get(`/delivery_notes/autocomplete/products?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Hiba az autocomplete lekérésekor:', error);
      throw error;
    }
  }
};
