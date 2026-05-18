import express from 'express';

const router = express.Router();

const mockBoardings = [
  { 
    id: 1, 
    name: "Green View Premium Hostel", 
    location: "Colombo 03", 
    price: 18000, 
    rating: 4.8, 
    gender: "male",
    university: "colombo",
    faculty: "computing",
    totalBeds: 4,
    remainingBeds: 2,
    includesBills: true,
    features: ["WiFi", "Fan", "Kitchen"]
  },
  { 
    id: 2, 
    name: "Premium Residence", 
    location: "Colombo 07", 
    price: 25000, 
    rating: 4.9, 
    gender: "female",
    university: "colombo",
    faculty: "medicine",
    totalBeds: 4,
    remainingBeds: 2,
    includesBills: true,
    features: ["WiFi", "AC", "Kitchen"]
  }
];

// GET all boardings
router.get('/', (req, res) => {
  const { university, faculty, gender } = req.query;
  let filtered = [...mockBoardings];
  
  if (university) filtered = filtered.filter(b => b.university === university);
  if (faculty) filtered = filtered.filter(b => b.faculty === faculty);
  if (gender) filtered = filtered.filter(b => b.gender === gender);

  res.json(filtered);
});

// GET single boarding
router.get('/:id', (req, res) => {
  const boarding = mockBoardings.find(b => b.id === parseInt(req.params.id));
  if (boarding) res.json(boarding);
  else res.status(404).json({ message: 'Boarding not found' });
});

// POST new boarding
router.post('/', (req, res) => {
  const newBoarding = { ...req.body, id: mockBoardings.length + 1 };
  res.status(201).json({
    success: true,
    message: 'Boarding created successfully',
    boarding: newBoarding
  });
});

export default router;
