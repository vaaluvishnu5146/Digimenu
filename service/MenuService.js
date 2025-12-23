const Menu = require("../model/MenuItemSchema");
const mongoose = require("mongoose");

async function createMenuItem(req, res) {
  // Logic to create a new menu item
  const item = new Menu({
    ...req.body,
    isVeg: req.body.isVeg == "on" ? true : false,
    isAvailable: req.body.isAvailable == "on" ? true : false,
  });
  try {
    const response = await item.save();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

async function updateMenuItem(req, res) {
  // Logic to update an existing menu item
  console.log("Update Menu Item Req Body:", req.body);
  const menuId = req.params.id;
  console.log("Menu ID to update:", menuId);
  const updatedData = {
    ...req.body,
    isVeg: req.body.isVeg == "on" ? true : false,
    isAvailable: req.body.isAvailable == "on" ? true : false,
  };
  try {
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      throw new Error("Invalid menu ID");
    }

    const response = await Menu.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(menuId) },
      updatedData,
      {
        new: true,
      }
    );
    console.log("response", response);
    return [response, null];
  } catch (error) {
    console.error("error", error);
    return [null, error];
  }
}

function deleteMenuItem(req, res) {
  // Logic to delete a menu item
}

function getMenuItems(req, res) {
  // Logic to retrieve menu items
  try {
    const response = Menu.find({}).then((items) => {
      return items;
    });
    return response;
  } catch (error) {
    return error;
  }
}

function getMenuItemById(id) {
  // Logic to retrieve a menu item by ID
  return Menu.findById(id);
}

module.exports = {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItemById,
};
