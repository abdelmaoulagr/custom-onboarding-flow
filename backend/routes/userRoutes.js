const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


// Register a new user
router.post('/register', async (req, res) => {

  const { email, password} = req.body;

  try {
    const usersCollection = req.db.collection('users');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = {
      email,
      password,
      aboutMe: '',
      address: {},
      birthday: null,
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Put user information data
router.put('/addInfos', async (req, res) => {
  const { email, aboutMe, address, birthday } = req.body;

  try {
    const usersCollection = req.db.collection('users');

    // Update the user with the new onboarding data
    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { aboutMe, address,  birthday} },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found',});
    }

    res.status(200).json({ message: 'User updated successfully', user: result.value });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get data of all users
router.get('/allUsers', async (req, res) => {
  try {
    const users = await req.db.collection('users').find().toArray(); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to get the Configuration
router.get('/adminConfig', async (req, res) => {
  const configID='66f85b2b73179edce27f258d';

  try {
    const adminConfig = await req.db.collection('admin').findOne({_id: new ObjectId(configID)}); // Replace 'users' with your collection name

    if (!adminConfig) {
      return res.status(404).json({ message: 'the Configuration not found' });
    }

    const { step2, step3 } = adminConfig;
    res.status(200).json({ step2, step3 });
  } catch (error) {
    console.error('Error fetching the configuration:', error);
    res.status(500).json({ message: 'Error fetching the configuration' });
  }
});
  

// Route to put the Configuration
router.put('/adminConfig', async (req, res) => {
  const configID = '66f85b2b73179edce27f258d';
  const { step2, step3 } = req.body; // The new step2 and step3 configuration from the request body

  if (!step2 || !step3) {
    return res.status(400).json({ message: 'Both step2 and step3 configurations are required.' });
  }

  try {
    // Find the config document by its ID and update it
    const result = await req.db.collection('admin').updateOne(
      { _id: new ObjectId(configID) },
      { $set: { step2, step3 } } // Update the step2 and step3 fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'The Configuration not found' });
    }

    res.status(200).json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating the configuration:', error);
    res.status(500).json({ message: 'Error updating the configuration' });
  }
});


module.exports = router;
