import React, { useContext } from "react";
import { ShieldCheck } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const {
    cartItems,
    products,
    getFinalPrice,
    getSavingsAmount,
    formatPrice,
  } = useContext(ShopContext);

  let totalMRP = 0;
  let totalDiscount = 0;
  let totalFinal = 0;

  for (const itemId in cartItems) {
    const product = products.find((entry) => entry._id === itemId);
    if (!product) continue;

    const finalPrice = getFinalPrice(product);
    const savings = getSavingsAmount(product);

    for (const size in cartItems[itemId]) {
      const quantity = cartItems[itemId][size];
      totalMRP += product.price * quantity;
      totalDiscount += savings * quantity;
      totalFinal += finalPrice * quantity;
    }
  }

  return (
    <div className="w-full text-[#2d211a]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9a6a49]">Order summary</p>
          <h2 className="mt-1 font-serif text-3xl">Your total</h2>
        </div>
        <div className="rounded-full bg-[#8b5e3c]/10 p-3 text-[#6f452c]">
          <ShieldCheck size={22} strokeWidth={1.7} />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>Merchandise</span>
          <span>{formatPrice(totalMRP)}</span>
        </div>

        <div className="flex justify-between text-[#7a4d31]">
          <span>Drip savings</span>
          <span>-{formatPrice(totalDiscount)}</span>
        </div>

        <div className="flex justify-between text-stone-500">
          <span>Standard shipping</span>
          <span className="font-semibold uppercase tracking-wider text-[#7a4d31]">Complimentary</span>
        </div>

        <div className="my-5 border-t border-[#8b5e3c]/15" />

        <div className="flex items-end justify-between">
          <div>
            <p className="font-semibold">Total</p>
            <p className="mt-1 text-[10px] text-stone-400">Inclusive of all taxes</p>
          </div>
          <p className="font-serif text-3xl font-semibold">{formatPrice(totalFinal)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
