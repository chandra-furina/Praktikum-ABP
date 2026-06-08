require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 WAJIB: supaya file HTML bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

// VALIDASI ENV
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error("❌ SUPABASE_URL/SUPABASE_KEY belum diisi di .env");
    process.exit(1);
}

// KONEKSI SUPABASE
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// TEST API
app.get('/test', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json(error);
    res.json(data);
});

// CREATE
app.post('/users', async (req, res) => {
    const { nama, alamat } = req.body;
    const { data, error } = await supabase
        .from('users')
        .insert([{ nama, alamat }])
        .select();

    if (error) return res.status(500).json(error);
    res.json(data);
});

// READ
app.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) return res.status(500).json(error);
    res.json(data);
});

// GET BY ID
app.get('/users/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json(error);
    res.json(data);
});

// UPDATE
app.put('/users/:id', async (req, res) => {
    const { nama, alamat } = req.body;
    const { data, error } = await supabase
        .from('users')
        .update({ nama, alamat })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json(error);
    res.json(data);
});

// DELETE
app.delete('/users/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json(error);
    res.json(data);
});

// ROOT → index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START SERVER
app.listen(3000, () => {
    console.log("🚀 Server jalan di http://localhost:3000");
});