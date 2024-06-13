const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

//function to generate ai reponse
async function generateAIResponse(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        
        //console.log("Complete response from API:", result); 

        
        if (result && result.response && result.response.text && typeof result.response.text === 'function') {
            const textContent = await result.response.text(); //needed to use await when calling text()
            return textContent.trim();
        } else {
            throw new Error('API response is missing the expected text property or method');
        }
    } catch (error) {
        console.error('Error when calling Google Generative AI:', error);
        return "I'm having trouble processing your request. Please try again later.";
    }
};



//handles the initial interaction of Tinnie introducing themself and asking the user for consent to ask more questions
exports.initialInteraction = (req, res) => {
    const initialPrompt =  'You are Tinnie, an AI insurance consultalt designed to help users select an insurance product for their vehicle. Start the interaction by introducing yourself and asking the user an opt in question such as - I am Tinnie. I help you to choose an insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?';
    
    
    generateAIResponse(initialPrompt).then(text => res.json({ sender: "Tinnie", text: text }));
};

//provides instruction Gemini in the prompt to ask users questions about their vehicle and usage and contains details of each insurance product and business rules around them. 
exports.handleInteraction = async (req, res) => {
    const userMessage = req.body.message.toLowerCase();

    const followUpPrompt = `User said: "${userMessage}". Based on this, determine what questions you need to ask to be able to recommend the right insurance product. You cannot ask the user directly what insurance product they want.

    Ask questions one at a time and wait for a response to guide the conversation and use the responses from the user until you can determine which insurance products from these list are right for the user:

    MBI: Mechanical Breakdown Insurance (MBI) covers the cost of repairs for mechanical issues in your vehicle. It is not available for trucks and racing cars,
    Comprehensive: Comprehensive Car Insurance covers damage to your vehicle from accidents, theft, weather, and other non-collision events. It is available only for motor vehicles that are less than 10 years old.,
    ThirdParty: Third Party Car Insurance provides coverage for damages that your vehicle might cause to other vehicles or property. It does not cover damages to your own vehicle.`;

    generateAIResponse(followUpPrompt).then(text => res.json({ sender: "Tinnie", text: text }));
};

