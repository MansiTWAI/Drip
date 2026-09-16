import React, { useContext, useMemo } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    products,
    cartItems,
    updateQuantity,
    changeCartSize,
    navigate,
    getFinalPrice,
    formatPrice,
  } = useContext(ShopContext);

  const cartData = useMemo(() => {
    const items = [];

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) items.push({ _id: itemId, size, quantity });
      }
    }

    return items;
  }, [cartItems]);

  if (cartData.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[#f7f2ec] px-5 py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-[#8b5e3c]/15 bg-white p-10 text-center shadow-[0_24px_80px_rgba(88,55,35,0.08)] sm:p-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#8b5e3c]/10 text-[#6f452c]">
            <ShoppingBag size={32} strokeWidth={1.6} />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b5e3c]">Your bag</p>
          <h1 className="font-serif text-4xl text-[#2d211a]">Nothing here yet.</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-500">
            Discover the latest Drip pieces and build a look that feels like you.
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="mt-8 flex items-center gap-3 rounded-full bg-[#6f452c] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#4c2f20]"
          >
            Explore collection <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="bg-[#f7f2ec] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b5e3c]">Your selection</p>
            <h1 className="font-serif text-4xl text-[#2d211a] sm:text-6xl">Shopping bag</h1>
          </div>
          <p className="text-sm text-stone-500">
            {cartData.length} {cartData.length === 1 ? "style" : "styles"} in your bag
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px] xl:gap-12">
          <section className="space-y-4" aria-label="Cart items">
            {cartData.map((item) => {
              const product = products.find((entry) => entry._id === item._id);
              if (!product) return null;

              const finalPrice = getFinalPrice(product);
              const itemTotal = finalPrice * item.quantity;
              const sizes = product.sizes || [];

              return (
                <article
                  key={`${item._id}-${item.size}`}
                  className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 rounded-3xl border border-[#8b5e3c]/10 bg-white p-4 shadow-[0_14px_45px_rgba(88,55,35,0.06)] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6 sm:p-6"
                >
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group overflow-hidden rounded-2xl bg-[#eee5dc]"
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      className="aspect-[3/4] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={product.image?.[0]}
                      alt={product.name}
                    />
                  </button>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a6a49]">
                          {product.category} / {product.subCategory}
                        </p>
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="mt-1 text-left font-serif text-xl leading-tight text-[#2d211a] hover:text-[#8b5e3c] sm:text-2xl"
                        >
                          {product.name}
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="rounded-full p-2 text-stone-400 transition hover:bg-[#8b5e3c]/10 hover:text-[#6f452c]"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="font-semibold text-[#2d211a]">{formatPrice(finalPrice)}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span>
                          <span className="rounded-full bg-[#8b5e3c]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6f452c]">
                            {product.discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-[minmax(120px,1fr)_auto_auto] sm:items-end">
                      <label className="block">
                        <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">
                          Size
                        </span>
                        <select
                          value={item.size}
                          onChange={(event) => changeCartSize(item._id, item.size, event.target.value)}
                          className="h-11 w-full rounded-xl border border-[#8b5e3c]/20 bg-[#faf7f3] px-3 text-sm font-semibold text-[#2d211a] outline-none transition focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/10"
                          aria-label={`Size for ${product.name}`}
                        >
                          {sizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </label>

                      <div>
                        <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">
                          Quantity
                        </span>
                        <div className="flex h-11 items-center rounded-xl border border-[#8b5e3c]/20 bg-[#faf7f3]">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="flex h-full w-10 items-center justify-center rounded-l-xl text-[#6f452c] transition hover:bg-[#8b5e3c]/10 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity for ${product.name}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold text-[#2d211a]" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="flex h-full w-10 items-center justify-center rounded-r-xl text-[#6f452c] transition hover:bg-[#8b5e3c]/10"
                            aria-label={`Increase quantity for ${product.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="text-left sm:min-w-24 sm:text-right">
                        <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">
                          Subtotal
                        </span>
                        <p className="text-base font-bold text-[#2d211a]">{formatPrice(itemTotal)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="sticky top-32 rounded-[2rem] border border-[#8b5e3c]/15 bg-white p-6 shadow-[0_24px_70px_rgba(88,55,35,0.09)] sm:p-8">
            <CartTotal />
            <button
              onClick={() => navigate("/place-order")}
              className="mt-7 flex w-full items-center justify-between rounded-full bg-[#6f452c] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#4c2f20] active:scale-[0.99]"
            >
              Checkout securely <ArrowRight size={17} />
            </button>
            <p className="mt-4 text-center text-[10px] leading-5 text-stone-400">
              Taxes calculated at checkout · Easy 7-day returns
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
