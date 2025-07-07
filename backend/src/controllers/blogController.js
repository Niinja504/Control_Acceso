import blogModel from "../models/blog.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import fs from "fs";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const blogController = {};

// Obtener todos los rostros
blogController.getAllPosts = async (req, res) => {
  try {
    const posts = await blogModel.find();
    return res.status(200).json({ status: "success", posts });
  } catch (error) {
    console.error("❌ Error al obtener rostros:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los rostros",
    });
  }
};

// Crear nuevo rostro (post)
blogController.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content || !req.file) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre, código o imagen",
      });
    }

    const localImagePath = req.file.path;

    // Subir imagen a Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(localImagePath, {
        folder: "rostros",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
    } catch (cloudErr) {
      console.error("❌ Error al subir a Cloudinary:", cloudErr);
      return res.status(500).json({
        status: "error",
        message: "Error al subir imagen a Cloudinary",
      });
    } finally {
      fs.unlink(localImagePath, (err) => {
        if (err) console.warn("⚠️ No se pudo eliminar imagen local:", err.message);
      });
    }

    const imageUrl = uploadResult.secure_url;

    // Verificar si la imagen ya existe
    const existing = await blogModel.findOne({ image: imageUrl });
    if (existing) {
      return res.status(200).json({
        status: "duplicate",
        message: "Rostro ya existente para esta imagen",
      });
    }

    const newPost = new blogModel({
      title,
      content,
      image: imageUrl,
    });
    await newPost.save();

    return res.status(200).json({
      status: "success",
      message: "Rostro guardado correctamente",
      data: newPost,
    });
  } catch (error) {
    console.error("❌ Error general en createPost:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al guardar rostro en el servidor",
    });
  }
};

export default blogController;
