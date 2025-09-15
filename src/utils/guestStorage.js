// Guest storage utilities for cart and wishlist
export const GUEST_CART_KEY = 'guest_cart';
export const GUEST_WISHLIST_KEY = 'guest_wishlist';

// Guest Cart Functions
export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting guest cart:', error);
    return [];
  }
};

export const addToGuestCart = (item) => {
  try {
    const cart = getGuestCart();
    const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
    
    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.push({
        ...item,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error adding to guest cart:', error);
    return getGuestCart();
  }
};

export const removeFromGuestCart = (productId) => {
  try {
    const cart = getGuestCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  } catch (error) {
    console.error('Error removing from guest cart:', error);
    return getGuestCart();
  }
};

export const updateGuestCartQuantity = (productId, quantity) => {
  try {
    const cart = getGuestCart();
    const updatedCart = cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  } catch (error) {
    console.error('Error updating guest cart quantity:', error);
    return getGuestCart();
  }
};

export const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing guest cart:', error);
    return [];
  }
};

// Guest Wishlist Functions
export const getGuestWishlist = () => {
  try {
    const wishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting guest wishlist:', error);
    return [];
  }
};

export const addToGuestWishlist = (item) => {
  try {
    const wishlist = getGuestWishlist();
    const existingItem = wishlist.find(wishlistItem => wishlistItem.productId === item.productId);
    
    if (!existingItem) {
      wishlist.push({
        ...item,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
    }
    
    return wishlist;
  } catch (error) {
    console.error('Error adding to guest wishlist:', error);
    return getGuestWishlist();
  }
};

export const removeFromGuestWishlist = (productId) => {
  try {
    const wishlist = getGuestWishlist();
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updatedWishlist));
    return updatedWishlist;
  } catch (error) {
    console.error('Error removing from guest wishlist:', error);
    return getGuestWishlist();
  }
};

export const isInGuestWishlist = (productId) => {
  try {
    const wishlist = getGuestWishlist();
    return wishlist.some(item => item.productId === productId);
  } catch (error) {
    console.error('Error checking guest wishlist:', error);
    return false;
  }
};

export const clearGuestWishlist = () => {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing guest wishlist:', error);
    return [];
  }
};

// Migration functions for when user logs in
export const migrateGuestCartToUser = async (cartApi) => {
  try {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;
    
    // Add each guest cart item to user cart
    for (const item of guestCart) {
      try {
        await cartApi.addToCart({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          title: item.title,
          image: item.image
        });
      } catch (error) {
        console.error('Error migrating cart item:', error);
      }
    }
    
    // Clear guest cart after migration
    clearGuestCart();
    return true;
  } catch (error) {
    console.error('Error migrating guest cart:', error);
    return false;
  }
};

export const migrateGuestWishlistToUser = async (wishlistApi) => {
  try {
    const guestWishlist = getGuestWishlist();
    if (guestWishlist.length === 0) return;
    
    // Add each guest wishlist item to user wishlist
    for (const item of guestWishlist) {
      try {
        await wishlistApi.addToWishlist({
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image
        });
      } catch (error) {
        console.error('Error migrating wishlist item:', error);
      }
    }
    
    // Clear guest wishlist after migration
    clearGuestWishlist();
    return true;
  } catch (error) {
    console.error('Error migrating guest wishlist:', error);
    return false;
  }
};
