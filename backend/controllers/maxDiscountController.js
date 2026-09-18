import MaxDiscount from "../models/maxDiscount.js";

// Get current max discount
export const getMaxDiscount = async (req, res) => {
  try {
    const discount = await MaxDiscount.findOne({ isActive: true });
    res.json(discount || { value: 0, description: "", isActive: false });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update max discount (admin only)
export const updateMaxDiscount = async (req, res) => {
  const { value, description, isActive } = req.body;

  try {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
      return res.status(400).json({ success: false, message: "Discount must be between 0 and 100" });
    }

    let discount = await MaxDiscount.findOne();
    if (discount) {
      discount.value = numericValue;
      discount.description = String(description || "").trim();
      discount.isActive = Boolean(isActive);
      await discount.save();
    } else {
      discount = new MaxDiscount({ value: numericValue, description: String(description || "").trim(), isActive: Boolean(isActive) });
      await discount.save();
    }
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
