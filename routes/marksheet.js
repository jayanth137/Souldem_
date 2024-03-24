const express = require('express');
const router = express.Router();
const Marksheet = require('../model/Marksheet');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/enterMarks', async (req, res) => {
  try {
    function calculatePercentage(totalMarks, obtainedMarks) {
      return (obtainedMarks / totalMarks) * 100;
    }

    // Assuming you have a Prisma model named Marksheet
    const { studentName, rollNumber, marks, totalMarks } = req.body;
    const obtainedMarks = marks.reduce(
      (sum, mark) => sum + mark.internalMarks + mark.externalMarks,
      0
    );

    const percentage = calculatePercentage(totalMarks, obtainedMarks);

    // Create a new marksheet with associated marks
    const newMarksheet = await prisma.marksheet.create({
      data: {
        studentName,
        rollNumber,
        totalMarks,
        percentage: percentage,
        obtainedMarks: obtainedMarks,
        marks: {
          create: marks.map((mark) => ({
            subject: mark.subject,
            internalMarks: mark.internalMarks,
            externalMarks: mark.externalMarks,
            grade: mark.grade,
          })),
        },
      },
    });

    res.status(200).send(newMarksheet);
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('rollNumber')) {
      // Handle unique constraint violation for rollNumber
      return res.status(400).send({ rollNumber: 'Roll number must be unique' });
    }
    res.status(500).send('Something went wrong');
  }
});

//get marksheet by roll number
router.get('/roll/:rollNumber', async (req, res) => {
  try {
    const marksheet = await prisma.marksheet.findUnique({
      where: { rollNumber: req.params.rollNumber },
      include: { marks: true },
    });
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(500).send(error);
  }
});

//  get all marksheet
router.get('/', async (req, res) => {
  try {
    const marksheets = await prisma.marksheet.findMany();
    res.send(marksheets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a marksheet by ID
router.get('/:id', async (req, res) => {
  try {
    const marksheet = await prisma.marksheet.findUnique({
      where: { id: req.params.id },
    });
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a marksheet by ID
router.patch('/update/:id', async (req, res) => {
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
    const marksheet = await prisma.marksheet.update({
      where: { id: req.params.id },
      data: req.body,
    });
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a marksheet by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const marksheet = await prisma.marksheet.delete({
      where: { id: req.params.id },
    });
    if (!marksheet) {
      return res.status(404).send('Marksheet not found');
    }
    res.send(marksheet);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
