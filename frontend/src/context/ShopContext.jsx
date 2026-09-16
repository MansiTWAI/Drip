import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { curatedProducts } from "../data/curatedProducts";

// Small debounce helper
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? "" : "http://localhost:4000");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState(curatedProducts);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Max discount
  const [maxDiscount, setMaxDiscount] = useState({
    value: 20,
    description: "FOR NEW MEMBERS",
    isActive: true,
  });

  // ---------------- DEBOUNCE ----------------
  const debouncedUpdate = useCallback(
    debounce((value) => {
      setDebouncedSearch(value.trim());
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedUpdate(value);
  };

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // ── Max discount ───────────────────────────────────────
  const fetchMaxDiscount = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/maxDiscount/get", {
        headers: token ? getAuthHeaders() : {},
      });
      if (res.data?.value !== undefined) {
        setMaxDiscount({
          value: Number(res.data.value),
          description: res.data.description || "",
          isActive: !!res.data.isActive,
        });
      }
    } catch (err) {
      console.warn("Using the default promotion until the API is available.", err?.message);
      // Optional: toast.error("Could not load max discount setting");
    }
  };

  // ---------------- CART LOGIC ----------------
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart);
      if (cartData[itemId]) {
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
      } else {
        cartData[itemId] = { [size]: 1 };
      }
      localStorage.setItem("cartItems", JSON.stringify(cartData));
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: getAuthHeaders() }
        );
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart);
      if (!cartData[itemId]) cartData[itemId] = {};
      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      } else {
        cartData[itemId][size] = quantity;
      }
      localStorage.setItem("cartItems", JSON.stringify(cartData));
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: getAuthHeaders() }
        );
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const loadUserCart = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
        localStorage.setItem(
          "cartItems",
          JSON.stringify(response.data.cartData || {})
        );
      }
    } catch (error) {
      console.warn("Could not load the saved cart.", error?.message);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) totalCount += cartItems[items][item];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (!itemInfo) continue;

      const finalPrice = getFinalPrice(itemInfo);

      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalAmount += finalPrice * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  // ---------------- WISHLIST LOGIC ----------------
  const loadUserWishlist = async () => {
    if (!token) return;

    try {
      const response = await axios.get(backendUrl + "/api/wishlist", {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist.map((p) => p._id));
      }
    } catch (error) {
      console.warn("Could not load the wishlist.", error?.message);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      setWishlist((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem("wishlist", JSON.stringify(next));
        return next;
      });
      toast.success("Wishlist updated");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/toggle",
        { productId },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setWishlist((prev) =>
          prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);
  const getWishlistCount = () => wishlist.length;

  // ---------------- ORDER LOGIC ----------------
  const handleCancelOrder = async (orderId, refreshOrders) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (refreshOrders) refreshOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ---------------- PRODUCTS ----------------
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        const apiProducts = response.data.products || [];
        setProducts(apiProducts.length ? apiProducts : curatedProducts);
      } else {
        setProducts(curatedProducts);
      }
    } catch (error) {
      console.warn("Product API is unavailable; rendering the editorial storefront.", error?.message);
      setProducts(curatedProducts);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const changeCartSize = async (itemId, oldSize, newSize) => {
    if (!newSize || oldSize === newSize) return;

    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart);
      const quantity = cartData[itemId]?.[oldSize] || 0;
      if (!quantity) return prevCart;

      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][newSize] = (cartData[itemId][newSize] || 0) + quantity;
      delete cartData[itemId][oldSize];
      localStorage.setItem("cartItems", JSON.stringify(cartData));
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/change-size",
          { itemId, oldSize, newSize },
          { headers: getAuthHeaders() }
        );
      } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to change size");
        await loadUserCart();
      }
    }
  };

  // ---------------- DISCOUNTS ----------------
  const getFinalPrice = (product) => {
    if (!product) return 0;
    if (product.finalPrice != null) return product.finalPrice;

    const discount = Math.min(
      product.discount || 0,
      maxDiscount.isActive ? maxDiscount.value : 100
    );

    if (discount <= 0) return product.price;
    return Math.round(product.price - (product.price * discount) / 100);
  };

  const getDiscountPercentage = (product) => {
    if (!product?.discount || product.discount <= 0) return 0;
    return Math.min(
      product.discount,
      maxDiscount.isActive ? maxDiscount.value : 100
    );
  };

  const getSavingsAmount = (product) => {
    if (!product?.discount || product.discount <= 0) return 0;
    const effectiveDiscount = Math.min(
      product.discount,
      maxDiscount.isActive ? maxDiscount.value : 100
    );
    return Math.round(product.price * (effectiveDiscount / 100));
  };

  const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return "₹0";
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  };

  const getPriceDisplay = (product) => {
    if (!product?.price) {
      return { mrp: "₹0", sale: "₹0", hasDiscount: false, discountText: "" };
    }

    const final = getFinalPrice(product);
    const displayedDiscount = getDiscountPercentage(product);
    const hasDiscount = displayedDiscount > 0;

    return {
      mrp: formatPrice(product.price),
      sale: formatPrice(final),
      discountText: hasDiscount ? `${displayedDiscount}% OFF` : "",
      hasDiscount,
    };
  };

  // ---------------- SEARCH LOGIC (OPTIMIZED) ----------------
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return products;

    const searchLower = debouncedSearch.toLowerCase();

    return products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.subCategory?.toLowerCase().includes(searchLower) ||
        p.fit?.toLowerCase().includes(searchLower) ||
        p.color?.toLowerCase().includes(searchLower) ||
        p.fabric?.toLowerCase().includes(searchLower) ||
        p.occasion?.toLowerCase().includes(searchLower)
      );
    });
  }, [debouncedSearch, products]);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedCart = localStorage.getItem("cartItems");
    const savedWishlist = localStorage.getItem("wishlist");

    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch { localStorage.removeItem("cartItems"); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch { localStorage.removeItem("wishlist"); }
    }

    if (savedToken) {
      setToken(savedToken);
    }
    fetchMaxDiscount();
  }, []);

  // Load user-specific data + max discount when token is available
  useEffect(() => {
    if (token) {
      loadUserCart();
      loadUserWishlist();
     
    }
  }, [token]);

  // ---------------- CONTEXT ----------------
  const value = {
    products,
    filteredProducts,
    isProductsLoading,
    currency,
    delivery_fee,

    search,
    debouncedSearch,
    setSearch: handleSearchChange,
    clearSearch,
    showSearch,
    setShowSearch,

    maxDiscount,
    fetchMaxDiscount,
   

    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    changeCartSize,
    getCartAmount,

    wishlist,
    toggleWishlist,
    isWishlisted,
    getWishlistCount,

    getFinalPrice,
    getDiscountPercentage,
    getSavingsAmount,
    formatPrice,
    getPriceDisplay,

    navigate,
    backendUrl,
    setToken,
    token,
    handleCancelOrder,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
