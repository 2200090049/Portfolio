import express from 'express';
import upload from '../middleware/upload.js';
import Profile from '../models/Profile.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload profile image
router.post('/profile-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { portfolioType } = req.body;
    
    if (!portfolioType) {
      // Delete uploaded file if no portfolio type
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Portfolio type is required' });
    }

    // Find profile and update
    const profile = await Profile.findOne({ portfolioType });
    
    if (!profile) {
      // Delete uploaded file if profile not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete old profile image if exists
    if (profile.profileImage && !profile.profileImage.startsWith('http')) {
      const oldImagePath = path.join(__dirname, '../uploads/profiles', path.basename(profile.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update profile with new image path
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    profile.profileImage = imagePath;
    await profile.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imagePath: imagePath
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Profile image upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Upload cover image
router.post('/cover-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { portfolioType } = req.body;
    
    if (!portfolioType) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Portfolio type is required' });
    }

    const profile = await Profile.findOne({ portfolioType });
    
    if (!profile) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete old cover image if exists
    if (profile.coverImage && !profile.coverImage.startsWith('http')) {
      const oldImagePath = path.join(__dirname, '../uploads/profiles', path.basename(profile.coverImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update profile with new image path
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    profile.coverImage = imagePath;
    await profile.save();

    res.json({
      success: true,
      message: 'Cover image uploaded successfully',
      imagePath: imagePath
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Cover image upload error:', error);
    res.status(500).json({ error: 'Failed to upload cover image' });
  }
});

// Delete profile image
router.delete('/profile-image/:portfolioType', async (req, res) => {
  try {
    const { portfolioType } = req.params;
    const profile = await Profile.findOne({ portfolioType });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.profileImage && !profile.profileImage.startsWith('http')) {
      const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(profile.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    profile.profileImage = '';
    await profile.save();

    res.json({ success: true, message: 'Profile image deleted successfully' });
  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({ error: 'Failed to delete profile image' });
  }
});

// Delete cover image
router.delete('/cover-image/:portfolioType', async (req, res) => {
  try {
    const { portfolioType } = req.params;
    const profile = await Profile.findOne({ portfolioType });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.coverImage && !profile.coverImage.startsWith('http')) {
      const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(profile.coverImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    profile.coverImage = '';
    await profile.save();

    res.json({ success: true, message: 'Cover image deleted successfully' });
  } catch (error) {
    console.error('Delete cover image error:', error);
    res.status(500).json({ error: 'Failed to delete cover image' });
  }
});

export default router;
