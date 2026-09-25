import User from '../models/User.js';

export const seedAdmin = async () => {
  const adminEmail = 'admin@novamart.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminUser = new User({
      name: 'NovaMart Administrator',
      email: adminEmail,
      password: 'Admin@12345', // Will be hashed by pre-save hook
      phone: '+91 98765 43210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          fullName: 'NovaMart HQ',
          phone: '+91 98765 43210',
          street: '100 Innovation Boulevard, Tech Park',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560100',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    await adminUser.save();
    console.log(`👑 Demo Admin created: ${adminEmail} (Password: Admin@12345)`);
  }

  // Also seed a demo normal customer for quick testing
  const demoEmail = 'user@novamart.com';
  const existingDemoUser = await User.findOne({ email: demoEmail });

  if (!existingDemoUser) {
    const demoUser = new User({
      name: 'Aarav Sharma',
      email: demoEmail,
      password: 'User@12345',
      phone: '+91 91234 56789',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          phone: '+91 91234 56789',
          street: 'Flat 402, Green Heights, 12th Main Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560038',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    await demoUser.save();
    console.log(`👤 Demo Customer created: ${demoEmail} (Password: User@12345)`);
  }
};
