import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import SecureKey from './models/SecureKey.js';

dotenv.config();

// Generate a cryptographically secure random key
function generateSecureKey() {
  const prefix = 'DKADMIN';
  const part1 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const part3 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const part4 = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${prefix}-${part1}-${part2}-${part3}-${part4}`;
}

async function generateSecureKeys() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI.replace('<db_password>', process.env.DB_PASSWORD);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if keys already exist
    const existingKeys = await SecureKey.find();
    if (existingKeys.length > 0) {
      console.log(`\n⚠️  Warning: ${existingKeys.length} secure keys already exist in database!`);
      console.log('Do you want to:');
      console.log('1. Keep existing keys and add more (if needed)');
      console.log('2. Delete all and generate 10 new keys');
      console.log('\n💡 To proceed, manually delete existing keys or modify this script.\n');
      
      // Display existing keys
      console.log('📋 EXISTING KEYS:');
      console.log('═'.repeat(70));
      existingKeys.forEach((key, index) => {
        const status = key.isUsed ? '🔴 USED' : '🟢 AVAILABLE';
        const usedInfo = key.isUsed ? ` (Used by: ${key.usedBy})` : '';
        console.log(`${index + 1}. ${key.key} ${status}${usedInfo}`);
      });
      console.log('═'.repeat(70));
      
      process.exit(0);
    }

    // Generate 10 secure keys
    console.log('\n🔐 Generating 10 Secure Admin Keys...\n');
    const keys = [];
    const generatedKeys = new Set();

    for (let i = 0; i < 10; i++) {
      let key;
      // Ensure unique keys
      do {
        key = generateSecureKey();
      } while (generatedKeys.has(key));
      
      generatedKeys.add(key);
      
      const secureKey = new SecureKey({
        key,
        isUsed: false,
        description: `Admin registration key #${i + 1}`
      });
      
      await secureKey.save();
      keys.push(key);
    }

    console.log('═'.repeat(70));
    console.log('🎉 SUCCESS! 10 SECURE ADMIN KEYS GENERATED');
    console.log('═'.repeat(70));
    console.log('\n📋 YOUR 10 SECURE KEYS (Save these securely!):\n');
    
    keys.forEach((key, index) => {
      console.log(`${index + 1}.  ${key}`);
    });
    
    console.log('\n═'.repeat(70));
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('═'.repeat(70));
    console.log('1. Each key can only be used ONCE to create an admin account');
    console.log('2. After use, the key is permanently marked as used');
    console.log('3. Maximum 10 admin accounts can be created');
    console.log('4. Store these keys in a SECURE location');
    console.log('5. Share keys ONLY with trusted admins');
    console.log('6. Keys are case-sensitive - copy exactly as shown');
    console.log('═'.repeat(70));
    
    console.log('\n💾 Keys saved to database successfully!');
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📊 Total keys in DB: ${await SecureKey.countDocuments()}`);
    console.log(`🟢 Available keys: ${await SecureKey.countDocuments({ isUsed: false })}`);
    console.log(`🔴 Used keys: ${await SecureKey.countDocuments({ isUsed: true })}`);
    
    console.log('\n✅ Done! You can now use these keys to register admin accounts.\n');

  } catch (error) {
    console.error('❌ Error generating secure keys:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
generateSecureKeys();
