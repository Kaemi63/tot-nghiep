const ADDRESS_KEY_PREFIX = 'fsa_saved_addresses';
const DEFAULT_ADDRESS_KEY_PREFIX = 'fsa_default_address';

const getStorageKey = (userId) => `${ADDRESS_KEY_PREFIX}_${userId}`;
const getDefaultKey = (userId) => `${DEFAULT_ADDRESS_KEY_PREFIX}_${userId}`;

export const addressService = {
  getAddresses(userId) {
    if (!userId || typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Lỗi đọc địa chỉ từ localStorage:', error);
      return [];
    }
  },

  saveAddresses(userId, addresses = []) {
    if (!userId || typeof window === 'undefined') return;
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(addresses));
    } catch (error) {
      console.error('Lỗi lưu địa chỉ vào localStorage:', error);
    }
  },

  addAddress(userId, address) {
    const addresses = this.getAddresses(userId);
    const newAddress = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
      ...address,
    };
    const next = [newAddress, ...addresses];
    this.saveAddresses(userId, next);
    this.setDefaultAddress(userId, newAddress.id);
    return next;
  },

  deleteAddress(userId, addressId) {
    const addresses = this.getAddresses(userId);
    const next = addresses.filter((address) => address.id !== addressId);
    this.saveAddresses(userId, next);
    const defaultId = this.getDefaultAddressId(userId);
    if (defaultId === addressId) {
      this.setDefaultAddress(userId, next[0]?.id || null);
    }
    return next;
  },

  setDefaultAddress(userId, addressId) {
    if (!userId || typeof window === 'undefined') return;
    try {
      if (addressId) {
        localStorage.setItem(getDefaultKey(userId), addressId);
      } else {
        localStorage.removeItem(getDefaultKey(userId));
      }
    } catch (error) {
      console.error('Lỗi lưu địa chỉ mặc định:', error);
    }
  },

  getDefaultAddressId(userId) {
    if (!userId || typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(getDefaultKey(userId));
    } catch (error) {
      return null;
    }
  },

  getDefaultAddress(userId) {
    const addresses = this.getAddresses(userId);
    const defaultAddressId = this.getDefaultAddressId(userId);
    return addresses.find((address) => address.id === defaultAddressId) || addresses[0] || null;
  },
};
