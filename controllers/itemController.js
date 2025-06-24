import Item from "../models/Item.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const createItem = async (req, res) => {
  console.log("item added5");
  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({ message: "Form parsing error" });
      }

      const title = fields.title?.[0];
      const description = fields.description?.[0];
      const price = fields.price?.[0];

      const imageFile = files.image?.[0];

      if (!title || !description || !price || !imageFile) {
        return res.status(400).json({ message: "All fields required" });
      }

      const uploadResult = await cloudinary.uploader.upload(
        imageFile.filepath,
        {
          folder: "vdr-items",
          resource_type: "image",
        }
      );
      console.log("item added6");

      const item = await Item.create({
        title,
        description,
        price: Number(price),
        imageUrl: uploadResult.secure_url,
        seller: req.userId,
      });
      console.log("item added7");

      res.status(201).json(item);
    } catch (err) {
      console.log("item added8");

      console.log("Cloudinary upload error:", err);
      res.status(500).json({ message: "Item creation failed" });
    }
  });
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("seller", "fullname");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch items" });
  }
};

export const getSellerItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.userId });
    res.json(items);

  } catch (err) {
    res.status(500).json({ message: "Could not fetch your items" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller', 'fullname email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
};
