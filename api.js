const express = require("express");
const CryptoJS = require("crypto-js");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// GET orqali URL va KEY yuboriladi
app.get("/api/encrypt", (req, res) => {
    const { url, key } = req.query;

    if (!url || !key) {
        return res.status(400).json({ error: "URL va KEY talab qilinadi!" });
    }

    try {
        const keyHex = CryptoJS.enc.Hex.parse(key);
        const ivHex = CryptoJS.enc.Hex.parse(process.env.IV || "afc4e290725a3bf0ac4d3ff826c43c10");

        const encrypted = CryptoJS.AES.encrypt(url, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });

        return res.json({ encrypted: encrypted.toString() });
    } catch (error) {
        return res.status(500).json({ error: "Shifrlashda xatolik yuz berdi" });
    }
});

// Serverni ishga tushirish
module.exports = app;
