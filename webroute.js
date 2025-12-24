const { loginViaWeb } = require("./service/AuthenticationService");
const {
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
} = require("./service/MenuService");
const Category = require("./model/CategorySchema");
const MenuItem = require("./model/MenuItemSchema");
const checkTokenValidity = require("./middlewares/tokenchecker");
const OrderSchema = require("./model/OrderSchema");
const WebRouter = require("express").Router();

/**
 * Web Page Routes
 */
// Render the home page
WebRouter.get("/dashboard", checkTokenValidity, (req, res) => {
  res.render("pages/index", { title: "Home Page" });
});

// Render the menu list page
WebRouter.get("/menu", checkTokenValidity, async (req, res) => {
  try {
    const items = await MenuItem.find({}).populate("categoryId");
    res.render("pages/menu/menulist", {
      title: "Menu Items List",
      items,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.redirect("/servererror");
  }
});

// Render the create menu page
WebRouter.get("/menu/create", checkTokenValidity, (req, res) => {
  res.render("pages/menu/create", { title: "Create Menu" });
});

// Render the update menu page
WebRouter.get("/menu/update/:id", checkTokenValidity, async (req, res) => {
  const menuId = req.params.id;
  try {
    const response = await getMenuItemById(menuId);
    return res.render("pages/menu/update", {
      menuItem: response,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return res.redirect("/servererror");
  }
});

// Render the login page
WebRouter.get("/", (req, res) => {
  res.render("pages/login", { title: "Login" });
});

// Logout route
WebRouter.get("/logout", (req, res) => {
  // Here you can clear the token cookie or session
  res.clearCookie("token");
  res.redirect("/");
});

// Render servererror page
WebRouter.get("/servererror", (req, res) => {
  res.render("pages/servererror", { error: "500 Internal Server error" });
});

// Render unauthorized page
WebRouter.get("/unauthorized", (req, res) => {
  res.render("pages/unauthorized", { error: "401 Unauthorized Access" });
});

/**
 * Category Routes
 */
// Render the create category page
WebRouter.get("/category/create", checkTokenValidity, (req, res) => {
  res.render("pages/category/create", { title: "Create Category" });
});

// Render the list category page with data
WebRouter.get("/categories", checkTokenValidity, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("pages/category/categoryList", {
      title: "Category List",
      categories: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.redirect("/servererror");
  }
});

// Render the update category page
WebRouter.get("/category/update/:id", checkTokenValidity, async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      console.error("Category not found");
      return res.redirect("/servererror");
    }
    return res.render("pages/category/update", {
      category: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.redirect("/servererror");
  }
});

// Render the orders page
WebRouter.get("/orders", checkTokenValidity, async (req, res) => {
  // Fetch orders from database if needed
  try {
    const orders = await OrderSchema.find({});
    res.render("pages/orders/list", { orders });
    console.log("Fetched orders:", orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.redirect("/servererror");
  }
});

// Render the update order page
WebRouter.get("/order/update/:id", checkTokenValidity, async (req, res) => {
  const orderId = req.params.id;
  try {
    // Fetch order details from database (not implemented here)
    const order = await OrderSchema.findById(orderId); // Placeholder for fetched order
    console.log("Fetched order:", order);
    return res.render("pages/orders/update", {
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.redirect("/servererror");
  }
});

/**
 * Additional routes can be added here as needed
 * CRUD operations for menu items can be handled via API routes
 */

// Login handler
WebRouter.post("/auth/login", loginViaWeb);

// Create menu item handler
WebRouter.post("/menu/createNewItem", checkTokenValidity, async (req, res) => {
  const [result, error] = await createMenuItem(req, res);
  if (result) {
    console.log("Menu item created:", result);
    res.redirect("/menu");
  } else {
    console.error("Login error:", error);
    res.redirect("/servererror");
  }
});

// Update menu item handler
WebRouter.post("/menu/update/:id", checkTokenValidity, async (req, res) => {
  const [result, error] = await updateMenuItem(req, res);
  if (result) {
    console.log("Menu item updated:", result);
    res.redirect("/menu");
  } else {
    console.error("Update menu error:", error);
    res.redirect("/servererror");
  }
});

// Create category handler
WebRouter.post(
  "/category/createCategory",
  checkTokenValidity,
  async (req, res) => {
    try {
      const { category, isActive } = req.body;
      const newCategory = new Category({
        name: category,
        isActive: isActive === "on" ? true : false,
      });
      await newCategory.save();
      console.log("Category created:", newCategory);
      res.redirect("/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      res.redirect("/servererror");
    }
  }
);

// Update category handler
WebRouter.post("/category/update/:id", checkTokenValidity, async (req, res) => {
  const categoryId = req.params.id;
  try {
    const { category, isActive } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: category,
        isActive: isActive === "on" ? true : false,
      },
      { new: true }
    );
    if (!updatedCategory) {
      console.error("Category not found for update");
      return res.redirect("/categories");
    }
    console.log("Category updated:", updatedCategory);
    res.redirect("/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    res.redirect("/servererror");
  }
});

// Render the update order page
WebRouter.post("/order/update/:id", checkTokenValidity, async (req, res) => {
  const orderId = req.params.id;
  try {
    // Fetch order details from database (not implemented here)
    const order = await OrderSchema.findByIdAndUpdate(orderId, req.body, {
      new: true,
    }); // Placeholder for fetched order
    console.log("Updated order:", order);
    return res.redirect("/orders");
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.redirect("/servererror");
  }
});

module.exports = WebRouter;
