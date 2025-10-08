const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();
const { User } = require('../models');


router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, address, pincode, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    let city = null, country = null;
    if (pincode) {
      
      try {
        const resp = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (Array.isArray(resp.data) && resp.data[0].Status === 'Success') {
          const postOffice = resp.data[0].PostOffice && resp.data[0].PostOffice[0];
          if (postOffice) {
            city = postOffice.District || postOffice.Block || postOffice.Name;
            country = postOffice.Country || 'India';
          }
        }
      } catch (e) {
       
      }
    }

    const password_hash = password;
    const user = await User.create({
      name, email, phone, address, pincode, city, country, password_hash
    });
    return res.json({ message: 'Registered successfully', user: { id: user.id, email: user.email, name: user.name }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // plain text check (no bcrypt compare)
  const ok = password === user.password_hash;
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY || '7d' }
  );

  res.json({ 
    token, 
    user: { id: user.id, email: user.email, name: user.name }
  });
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Provide email' });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(200).json({ message: 'If account exists, reset link generated' });
  }

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  // instead of sending email, return link
  res.json({ 
    message: 'Copy this reset link to reset your password', 
    resetLink 
  });
});
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    const hashedPassword = password;
    user.password_hash = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
