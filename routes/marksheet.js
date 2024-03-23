const express = require('express');
const router = express.Router();
const Marksheet = require('../model/Marksheet');

// Create a new marksheet
router.post('/enter', async (req, res) => {
  try {
    // Assuming Marksheet is your Mongoose model
    var marksheet = new Marksheet(req.body);
    await marksheet.save();
    res.status(200).send(marksheet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
});

// Get all marksheets
router.get('/marksheets', async (req, res) => {
  try {
    const marksheets = await Marksheet.find();
    res.send(marksheets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a marksheet by ID
router.get('/marksheets/:id', async (req, res) => {
  try {
    const marksheet = await Marksheet.findById(req.params.id);
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a marksheet by ID
router.patch('/marksheets/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'studentName',
    'rollNumber',
    'marks',
    'totalMarks',
    'percentage',
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const marksheet = await Marksheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a marksheet by ID
router.delete('/marksheets/:id', async (req, res) => {
  try {
    const marksheet = await Marksheet.findByIdAndDelete(req.params.id);
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
