const { loginViaWeb } = require("./service/AuthenticationService");
const {
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
} = require("./service/MenuService");

const WebRouter = require("express").Router();

/**
 * Web Page Routes
 */
// Render the home page
WebRouter.get("/", (req, res) => {
  res.render("pages/index", { title: "Home Page" });
});

// Render the menu list page
WebRouter.get("/menu", (req, res) => {
  res.render("pages/menu/menulist", { title: "Menu List" });
});

// Render the create menu page
WebRouter.get("/menu/create", (req, res) => {
  res.render("pages/menu/create", { title: "Create Menu" });
});

// Render the update menu page
WebRouter.get("/menu/update/:id", async (req, res) => {
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
WebRouter.get("/login", (req, res) => {
  res.render("pages/login", { title: "Login" });
});

// Render servererror page
WebRouter.get("/servererror", (req, res) => {
  res.render("pages/servererror", { error: "500 Internal Server error" });
});

/**
 * Additional routes can be added here as needed
 * CRUD operations for menu items can be handled via API routes
 */
WebRouter.post("/auth/login", loginViaWeb);

WebRouter.post("/menu/createNewItem", async (req, res) => {
  const [result, error] = await createMenuItem(req, res);
  if (result) {
    console.log("Menu item created:", result);
    res.redirect("/menu");
  } else {
    console.error("Login error:", error);
    res.redirect("/servererror");
  }
});

WebRouter.post("/menu/update/:id", async (req, res) => {
  const [result, error] = await updateMenuItem(req, res);
  if (result) {
    console.log("Menu item updated:", result);
    res.redirect("/menu");
  } else {
    console.error("Update menu error:", error);
    res.redirect("/servererror");
  }
});

module.exports = WebRouter;
