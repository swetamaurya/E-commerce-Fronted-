import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUtils";
import { 
  addToGuestCart, 
  addToGuestWishlist, 
  removeFromGuestWishlist, 
  isInGuestWishlist,
  getGuestWishlist
} from "../utils/guestStorage";

export default function ProductCard({
  product,
  viewMode = "grid",
  category: forcedCategory,
  wishlistStatus = false,
  onWishlistChange
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Normalize images and find primary image
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) => {
          const url = typeof img === "string" ? img : img?.url;
          return {
            url: getImageUrl(url),
            alt: typeof img === "string" ? product.name || product.title : img?.alt || product.name || product.title,
            isPrimary: typeof img === "string" ? false : Boolean(img?.isPrimary)
          };
        })
        .filter((i) => i.url);
    }
    return product?.image ? [{ url: getImageUrl(product.image), alt: product.name || product.title, isPrimary: true }] : [];
  }, [product]);
  
  // Debug: Log product data for troubleshooting
  console.log('🔍 ProductCard Debug:', {
    productName: product?.name,
    imagesCount: images.length,
    images: images.map(img => ({ url: img.url, isPrimary: img.isPrimary })),
    primaryImages: images.filter(img => img.isPrimary === true)
  });

  // Find primary image or use first image as fallback
  const primaryImage = images.find(img => img.isPrimary === true) || images[0];
  const primaryImg = primaryImage?.url || getImageUrl(product?.image) || null;
  const hoverImg = images.find(img => img.isPrimary !== true)?.url || images[1]?.url || images[0]?.url || getImageUrl(product?.image) || null;

  console.log('🎯 Selected primary image:', primaryImg);

  // Extract variant data for display
  const variant = product?.variants?.[0] || {};
  const displaySize = variant.size || product?.size || (product?.sizes && product.sizes.join(', '));
  const displayColor = variant.color || product?.color || (product?.colors && product.colors.join(', '));
  const displayThickness = product?.thickness || product?.meterial;

  // Presentational helpers for color meta
  const getShortColor = (color) => {
    if (!color || typeof color !== 'string') return '';
    const lower = color.trim();
    // Prefer left side before common separators
    const firstPart = lower.split(/,|\//)[0].split(/\s+with\s+/i)[0];
    // Keep at most two words
    const words = firstPart.split(/\s+/).slice(0, 2).join(' ');
    return words;
  };

  const getColorSwatch = (color) => {
    if (!color || typeof color !== 'string') return '';
    const hexMatch = color.match(/#([0-9a-fA-F]{3,8})/);
    if (hexMatch) return hexMatch[0];
    // Try a simple CSS color name (first word)
    const simple = color.trim().toLowerCase().split(/[,\s/]+/)[0];
    const named = ['black','white','gray','grey','red','blue','navy','green','teal','yellow','orange','purple','pink','beige','brown','maroon','olive','cyan','magenta','gold','silver'];
    if (named.includes(simple)) return simple;
    return '';
  };

  // Update wishlist status when props change
  useEffect(() => {
    setIsWishlisted(wishlistStatus);
  }, [wishlistStatus]);

  // Check wishlist status (both logged in and guest users)
  useEffect(() => {
    if (onWishlistChange) {
      // Parent is managing wishlist status, no need to check individually
      return;
    }
    
    const checkWishlistStatus = async () => {
      try {
        const productId = product.id || product._id;
        console.log('🔍 ProductCard - Product object:', product);
        console.log('🔍 ProductCard - Product ID (id):', product.id);
        console.log('🔍 ProductCard - Product ID (_id):', product._id);
        console.log('🔍 ProductCard - Final productId:', productId);
        
        if (localStorage.getItem("token")) {
          // Logged in user - check server wishlist
          const timeoutId = setTimeout(async () => {
            try {
              const res = await wishlistApi.checkWishlistItem(productId);
              console.log('🔍 ProductCard - Server wishlist check result:', res);
              setIsWishlisted(!!res?.inWishlist);
            } catch (e) {
              console.error("Error checking wishlist status:", e);
              setIsWishlisted(false);
            }
          }, 100); // 100ms debounce
          
          return () => clearTimeout(timeoutId);
        } else {
          // Guest user - check local storage
          const isInWishlist = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Guest wishlist check result:', isInWishlist);
          console.log('🔍 ProductCard - Setting isWishlisted to:', isInWishlist);
          setIsWishlisted(isInWishlist);
          
          // Double-check by getting the raw wishlist data
          const rawWishlist = getGuestWishlist();
          console.log('🔍 ProductCard - Raw wishlist data:', rawWishlist);
          console.log('🔍 ProductCard - Looking for productId:', productId);
          console.log('🔍 ProductCard - Found in raw data:', rawWishlist.some(item => item.productId === productId));
        }
      } catch (e) {
        console.error("Error in wishlist check setup:", e);
        setIsWishlisted(false);
      }
    };
    
    checkWishlistStatus();
    
    // Multiple delayed refreshes to ensure status is checked after component is fully loaded
    const delayedRefresh1 = setTimeout(() => {
      if (!localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Delayed refresh 1 (500ms):', currentStatus);
        setIsWishlisted(currentStatus);
      }
    }, 500);
    
    const delayedRefresh2 = setTimeout(() => {
      if (!localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Delayed refresh 2 (1000ms):', currentStatus);
        setIsWishlisted(currentStatus);
      }
    }, 1000);
    
    const delayedRefresh3 = setTimeout(() => {
      if (!localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Delayed refresh 3 (2000ms):', currentStatus);
        setIsWishlisted(currentStatus);
      }
    }, 2000);
    
    return () => {
      clearTimeout(delayedRefresh1);
      clearTimeout(delayedRefresh2);
      clearTimeout(delayedRefresh3);
    };
  }, [product.id || product._id, onWishlistChange]);

  // Listen for wishlist updates to refresh status
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (!onWishlistChange) {
        const productId = product.id || product._id;
        if (!localStorage.getItem("token")) {
          // Only for guest users
          const isInWishlist = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Wishlist updated, new status:', isInWishlist);
          setIsWishlisted(isInWishlist);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !onWishlistChange && !localStorage.getItem("token")) {
        // Page became visible - refresh wishlist status
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Page visible, refreshing status:', currentStatus);
        setIsWishlisted(currentStatus);
      }
    };

    const handleFocus = () => {
      if (!onWishlistChange && !localStorage.getItem("token")) {
        // Window focused - refresh wishlist status
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Window focused, refreshing status:', currentStatus);
        setIsWishlisted(currentStatus);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Also add a manual refresh every 500ms for debugging
    const intervalId = setInterval(() => {
      if (!onWishlistChange && !localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        if (currentStatus !== isWishlisted) {
          console.log('🔍 ProductCard - Status mismatch detected, updating:', currentStatus);
          setIsWishlisted(currentStatus);
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [product.id || product._id, onWishlistChange, isWishlisted]);

  // Listen for route changes to refresh wishlist status
  useEffect(() => {
    if (!onWishlistChange && !localStorage.getItem("token")) {
      const productId = product.id || product._id;
      const currentStatus = isInGuestWishlist(productId);
      console.log('🔍 ProductCard - Route changed, refreshing status:', currentStatus);
      setIsWishlisted(currentStatus);
    }
  }, [location.pathname, product.id, product._id, onWishlistChange]);

  // Additional refresh on window load (when returning from other pages)
  useEffect(() => {
    const handleWindowLoad = () => {
      if (!onWishlistChange && !localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Window loaded, refreshing status:', currentStatus);
        setIsWishlisted(currentStatus);
      }
    };

    // Check immediately
    handleWindowLoad();

    // Also listen for window load events
    window.addEventListener('load', handleWindowLoad);
    
    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, [product.id, product._id, onWishlistChange]);

  // Force refresh on component mount (for page navigation)
  useEffect(() => {
    if (!onWishlistChange && !localStorage.getItem("token")) {
      const productId = product.id || product._id;
      
      // Immediate check
      const immediateCheck = () => {
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Immediate mount check:', currentStatus);
        setIsWishlisted(currentStatus);
      };
      
      // Multiple delayed checks to ensure we catch the status
      const delayedChecks = [
        setTimeout(() => {
          const currentStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Mount check 1 (100ms):', currentStatus);
          setIsWishlisted(currentStatus);
        }, 100),
        
        setTimeout(() => {
          const currentStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Mount check 2 (300ms):', currentStatus);
          setIsWishlisted(currentStatus);
        }, 300),
        
        setTimeout(() => {
          const currentStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Mount check 3 (500ms):', currentStatus);
          setIsWishlisted(currentStatus);
        }, 500),
        
        setTimeout(() => {
          const currentStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Mount check 4 (1000ms):', currentStatus);
          setIsWishlisted(currentStatus);
        }, 1000),
        
        setTimeout(() => {
          const currentStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Mount check 5 (2000ms):', currentStatus);
          setIsWishlisted(currentStatus);
        }, 2000)
      ];
      
      immediateCheck();
      
      return () => {
        delayedChecks.forEach(clearTimeout);
      };
    }
  }, [product.id, product._id, onWishlistChange]);

  // Aggressive refresh for wishlist status (especially for already added items)
  useEffect(() => {
    if (!onWishlistChange && !localStorage.getItem("token")) {
      const productId = product.id || product._id;
      
      // Check every 500ms for the first 10 seconds after component mount
      const aggressiveInterval = setInterval(() => {
        const currentStatus = isInGuestWishlist(productId);
        if (currentStatus !== isWishlisted) {
          console.log('🔍 ProductCard - Aggressive refresh detected mismatch, updating:', currentStatus);
          setIsWishlisted(currentStatus);
        }
      }, 500);
      
      // Clear the aggressive interval after 10 seconds
      const clearAggressive = setTimeout(() => {
        clearInterval(aggressiveInterval);
        console.log('🔍 ProductCard - Stopped aggressive refresh');
      }, 10000);
      
      return () => {
        clearInterval(aggressiveInterval);
        clearTimeout(clearAggressive);
      };
    }
  }, [product.id, product._id, onWishlistChange, isWishlisted]);

  // Specific handler for page visibility changes (returning from other pages)
  useEffect(() => {
    const handlePageVisible = () => {
      if (!onWishlistChange && !localStorage.getItem("token")) {
        const productId = product.id || product._id;
        const currentStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Page became visible, checking status:', currentStatus);
        setIsWishlisted(currentStatus);
        
        // Also do multiple checks with delays
        setTimeout(() => {
          const delayedStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Delayed visibility check:', delayedStatus);
          setIsWishlisted(delayedStatus);
        }, 200);
        
        setTimeout(() => {
          const delayedStatus2 = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Second delayed visibility check:', delayedStatus2);
          setIsWishlisted(delayedStatus2);
        }, 500);
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handlePageVisible);
    
    // Also listen for when the window regains focus
    window.addEventListener('focus', handlePageVisible);
    
    return () => {
      document.removeEventListener('visibilitychange', handlePageVisible);
      window.removeEventListener('focus', handlePageVisible);
    };
  }, [product.id, product._id, onWishlistChange]);

  // Convert category name to URL-friendly format
  const categoryToUrl = (categoryName) => {
    if (!categoryName) return "cotton-yoga-mats";

    const categoryMap = {
      // Main categories (URLs)
      "Cotton Yoga Mats": "cotton-yoga-mats",
      "Bedside Runners": "bedside-runners",
      "Mats Collection": "mats-collection",
      "Bath Mats": "bath-mats",
      "Area Rugs": "area-rugs",

      // Sub-categories that map to main categories
      "In Door Mats": "mats-collection",
      "Out Door Mats": "mats-collection",
      "Aasan Mats": "mats-collection",
      "Animal Rugs": "area-rugs",

      // Already-converted slugs (pass-through)
      "cotton-yoga-mats": "cotton-yoga-mats",
      "bedside-runners": "bedside-runners",
      "mats-collection": "mats-collection",
      "bath-mats": "bath-mats",
      "area-rugs": "area-rugs"
    };

    // First check the map for full names
    if (categoryMap[categoryName]) {
      return categoryMap[categoryName];
    }

    // If it's already a slug (contains hyphens and lowercase), return as-is
    if (typeof categoryName === 'string' && categoryName.includes('-') && categoryName === categoryName.toLowerCase()) {
      return categoryName;
    }

    // Otherwise convert to slug format
    return categoryName.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleProductClick = () => {
    const catFromPath = window.location.pathname.split("/")[1] || "cotton-yoga-mats";
    // IMPORTANT: Always convert through categoryToUrl to handle all formats
    const category = categoryToUrl(forcedCategory) || categoryToUrl(product?.category) || catFromPath;

    console.log('🔗 ProductCard Click Debug:', {
      forcedCategory,
      productCategory: product?.category,
      categoryToUrlResult: categoryToUrl(product?.category),
      forcedCategoryConverted: categoryToUrl(forcedCategory),
      catFromPath,
      finalCategory: category,
      productId: product.id || product._id,
      productName: product.name || product.title,
      navigateTo: `/${category}/${product.id || product._id}`
    });

    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/${category}/${product.id || product._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    setIsTogglingWishlist(true);

    try {
      const productId = product.id || product._id;
      console.log('🔍 ProductCard - Adding/Removing product:', product);
      console.log('🔍 ProductCard - Product ID (id):', product.id);
      console.log('🔍 ProductCard - Product ID (_id):', product._id);
      console.log('🔍 ProductCard - Final productId:', productId);
      console.log('🔍 ProductCard - Current isWishlisted state:', isWishlisted);

      const productData = {
        productId: productId,
        title: product.name || product.title,
        price: product.price,
        image: primaryImg,
      };

      console.log('🔍 ProductCard - Product data being stored:', productData);

      if (localStorage.getItem("token")) {
        // Logged in user - use API
        if (isWishlisted) {
          await wishlistApi.removeFromWishlist(productId);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          await wishlistApi.addToWishlist(productData);
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      } else {
        // Guest user - use local storage
        // First check the actual status from localStorage
        const actualStatus = isInGuestWishlist(productId);
        console.log('🔍 ProductCard - Actual status from localStorage:', actualStatus);
        
        if (actualStatus) {
          console.log('🔍 ProductCard - Removing from guest wishlist:', productId);
          removeFromGuestWishlist(productId);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          console.log('🔍 ProductCard - Adding to guest wishlist:', productData);
          addToGuestWishlist(productData);
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }

      // Notify parent component
      if (onWishlistChange) {
        onWishlistChange(productId, !isWishlisted);
      }

      // Force refresh wishlist status after a short delay
      setTimeout(() => {
        if (!localStorage.getItem("token")) {
          const newStatus = isInGuestWishlist(productId);
          console.log('🔍 ProductCard - Force refresh status:', newStatus);
          setIsWishlisted(newStatus);
        }
      }, 100);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      const productId = product.id || product._id;
      const productData = {
        productId: productId,
        quantity: 1,
        price: product.price,
        title: product.name || product.title,
        image: primaryImg,
      };
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        console.log('Adding to cart:', { product, productId });
        await cartApi.addToCart(productData);
        toast.success("Added to cart");
      } else {
        // Guest user - use local storage
        addToGuestCart(productData);
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ---- LIST VIEW ----
  if (viewMode === "list") {
    return (
      <article
        className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white border border-gray-200 rounded-md overflow-hidden relative">
            {product.badge && (
              <div className="absolute left-1 top-1 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                {product.badge}
              </div>
            )}
            {primaryImg && (
              <img
                src={primaryImg}
                alt={product.title || product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100"
                loading="lazy"
                title={product.title || product.name}
                onError={(e) => {
                  e.target.style.objectFit = 'cover';
                  e.target.style.backgroundColor = '#ffffff';
                }}
              />
            )}
            {hoverImg && hoverImg !== primaryImg && (
              <img
                src={hoverImg}
                alt={product.title || product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 hover:opacity-100"
                loading="lazy"
                onError={(e) => {
                  e.target.style.objectFit = 'cover';
                  e.target.style.backgroundColor = '#ffffff';
                }}
              />
            )}
            {/* Wishlist Icon */}
            <button
              onClick={handleWishlistClick}
              disabled={isTogglingWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute right-1 top-1 z-20 p-1 sm:p-1.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isWishlisted ? "bg-red-600" : "bg-white"
              }`}
              style={{ width: 28, height: 28 }}
            >
              {isWishlisted ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="white" viewBox="0 0 24 24" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1 sm:mb-2 line-clamp-2">
            {product.title || product.name}
          </h3>
          {/* Description hidden as requested */}
          {/* Size & Color */}
          {(displaySize || displayColor) && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {displaySize && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-300 text-gray-700 text-[10px] sm:text-xs font-medium">
                  {displaySize}
                </span>
              )}
              {displayColor && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-medium max-w-full">
                  {(() => {
                    const sw = getColorSwatch(displayColor);
                    return sw ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300" style={{ background: sw }}></span>
                    ) : null;
                  })()}
                  <span className="truncate">{getShortColor(displayColor)}</span>
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-1 sm:gap-2">
            <div className="font-black text-base sm:text-lg text-gray-900">₹{product.price}</div>
            {product.mrp && product.mrp > product.price && (
              <>
                <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>
                <div className="text-red-600 font-bold text-sm">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </div>
              </>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ---- GRID VIEW ----
  return (
    <article
      className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={handleProductClick}
    >
      {/* Promotional Banner */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-20 bg-red-600 text-white text-sm font-extrabold px-3 py-1.5 rounded shadow-lg">
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        disabled={isTogglingWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 z-20 p-1.5 sm:p-2 md:p-2.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
          isWishlisted ? "bg-red-600" : "bg-white"
        }`}
        style={{ width: 32, height: 32 }}
      >
        {isWishlisted ? (
          // White filled heart on red bg
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="white"
            viewBox="0 0 24 24"
            stroke="none"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
          </svg>
        ) : (
          // Black outlined heart on white bg
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="none"
            stroke="black"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <div className="aspect-square bg-white overflow-hidden relative group/image">
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={product.name || product.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            title={product.name || product.title}
            onError={(e) => {
              e.target.style.objectFit = 'cover';
              e.target.style.backgroundColor = '#ffffff';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Rating Badge - Bottom Left */}
        {(() => {
          const rating = product.rating ? parseFloat(product.rating) : null;
          const count = product.reviewsCount ? parseInt(product.reviewsCount) : 0;
          

          // Only show if rating is a valid number
          if (rating && !isNaN(rating)) {
            return (
       <div className="absolute bottom-2 left-2 flex items-center gap-1.2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-md px-2 py-0.5 shadow-sm">
  <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
  <svg className="w-4 h-4 text-green-600 fill-current" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
  <span className="text-xs text-gray-600 font-medium"> | {count}</span>
</div>


            );
          }
          return null;
        })()}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="p-1.5 sm:p-2 md:p-3 flex flex-col flex-1">

        {/* Product Title */}
        <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-snug mb-0.5 sm:mb-1 md:mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {product.title || product.name}
        </h3>

        {/* Description hidden as requested */}

        {/* Size & Color */}
        {(displaySize || displayColor) && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
            {displaySize && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-gray-300 text-gray-700 text-[9px] sm:text-xs font-medium bg-white hover:bg-gray-50 transition-colors">
                {displaySize}
              </span>
            )}
            {displayColor && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-gray-300 text-gray-700 text-[9px] sm:text-xs font-medium bg-white hover:bg-gray-50 transition-colors">
                {getShortColor(displayColor)}
              </span>
            )}
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2 flex-1">
          <div className="font-black text-xs sm:text-lg md:text-xl text-gray-900">₹{product.price}</div>
          {product.mrp && product.mrp > product.price && (
            <>
              <div className="line-through text-gray-500 text-[8px] sm:text-xs">₹{product.mrp}</div>
              <div className="text-red-600 font-bold text-[8px] sm:text-xs">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </div>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-1 sm:py-1.5 md:py-2 bg-gray-900 text-white text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-[1.02] disabled:bg-gray-600 disabled:cursor-not-allowed mt-auto"
        >
          {isAddingToCart ? "ADDING..." : "ADD TO CART"}
        </button>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Rate Product</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product Info */}
            <div className="flex gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <img
                src={primaryImg}
                alt={product.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.title}</p>
                <p className="text-xs text-gray-600">₹{product.price}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="text-4xl transition-colors"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= userRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-xs text-gray-600 mt-2">You rated: {userRating} star{userRating !== 1 ? "s" : ""}</p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Write a Review (Optional)</label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{userReview.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (userRating === 0) {
                    toast.error("Please select a rating");
                    return;
                  }
                  setSubmittingRating(true);
                  try {
                    // TODO: Send rating to API
                    // await cartApi.submitRating(product.id, { rating: userRating, review: userReview });
                    toast.success(`Rated ${userRating} stars! Thank you for your feedback.`);
                    setUserRating(0);
                    setUserReview("");
                    setShowRatingModal(false);
                  } catch (error) {
                    toast.error("Failed to submit rating");
                  } finally {
                    setSubmittingRating(false);
                  }
                }}
                disabled={userRating === 0 || submittingRating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
