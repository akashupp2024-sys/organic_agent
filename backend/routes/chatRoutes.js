const express = require('express');
const router = express.Router();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const result = await model.generateContent(
      `You are Sprout, an organic shopping assistant.
       Help users with products, healthy food, nutrition,
       recipes, shopping, coding, and normal conversations.
       
       User: ${message}`
    );

    const response = result.response.text();

    res.json({
      reply: response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'AI failed',
    });
  }
});

module.exports = router;