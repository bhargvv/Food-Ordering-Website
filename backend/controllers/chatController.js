import { GoogleGenerativeAI } from "@google/generative-ai";
import foodModel from "../models/foodModel.js";

const generateChatResponse = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ success: false, message: "Server error: Gemini API key is not configured in the backend environment variables." });
        }

        const { message, history } = req.body;

        if (!message) {
            return res.json({ success: false, message: "No message provided." });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

        // Fetch catalog for real-time context
        const foods = await foodModel.find({});
        let catalogContext = "Here is the current real-time food catalog from the TasteCart database:\n\n";
        
        foods.forEach(f => {
            const vegStatus = f.isVeg ? "Veg" : "Non-Veg";
            catalogContext += `- **${f.name}** (${f.category}): ₹${f.price}\n`;
            catalogContext += `  - Description: ${f.description}\n`;
            catalogContext += `  - Ingredients: ${f.ingredients || 'Not specified'}\n`;
            catalogContext += `  - Details: ${vegStatus}, Rating: ${f.rating || 'N/A'}/5, Prep Time: ${f.preparationTime || 'N/A'} mins, Spice: ${f.spiceLevel || 'Medium'}\n\n`;
        });

        catalogContext += "\nIMPORTANT INSTRUCTIONS FOR YOU (THE AI ASSISTANT):\n";
        catalogContext += "1. You are the TasteCart Food Assistant. Answer customer queries friendly and professionally.\n";
        catalogContext += "2. ONLY recommend food items that exist in the catalog above. Do NOT invent new dishes.\n";
        catalogContext += "3. If a user asks for recommendations based on budget, dietary preference, or spice level, filter the catalog above to provide the best matches.\n";
        catalogContext += "4. If they ask for something we don't have, politely apologize and recommend something similar from our menu.\n";
        catalogContext += "5. Keep your responses concise, conversational, and helpful.\n";

        // Build prompt with history
        let fullPrompt = catalogContext + "\n\n--- CONVERSATION HISTORY ---\n";
        
        if (history && history.length > 0) {
            history.forEach(item => {
                const role = item.sender === 'user' ? 'User' : 'Assistant';
                fullPrompt += `${role}: ${item.text}\n`;
            });
        }
        
        fullPrompt += `\nUser: ${message}\nAssistant:`;

        const result = await model.generateContent(fullPrompt);
        const aiResponse = await result.response;
        const text = aiResponse.text();

        res.json({ success: true, reply: text });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.json({ success: false, message: "Error generating AI response. Please try again." });
    }
}

export { generateChatResponse };
