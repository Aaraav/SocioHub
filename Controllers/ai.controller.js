const OpenAI = require('openai');
require('dotenv').config();


async function generateResponse(req, res) {
    const { userInput } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { "role": "user", "content": userInput }
            ],
            model: "gpt-3.5-turbo",
        });

        const response = completion.choices[0].message.content;
        return res.json({ response }); // Send the response back to the client
    } catch (error) {
        console.error("Error generating response:", error);
        if (error.statusCode === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        }
        return res.status(500).json({ error: 'An error occurred while generating response' });
    }
}

module.exports = { generateResponse };
