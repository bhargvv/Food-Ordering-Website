import os
import gradio as gr
from pymongo import MongoClient
from google import genai
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client.get_database() # Gets the database from the URI
    foods_collection = db["foods"]
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# Gemini API setup
try:
    gemini_client = genai.Client()
except Exception as e:
    print(f"Error initializing Gemini client. Make sure GEMINI_API_KEY is set in .env. {e}")
    gemini_client = None

def get_food_catalog_context():
    try:
        foods = list(foods_collection.find({}))
        if not foods:
            return "The database is currently empty. There are no food items available."
        
        context = "Here is the current real-time food catalog from the TasteCart database:\n\n"
        for f in foods:
            veg_status = "Veg" if f.get("isVeg", True) else "Non-Veg"
            context += f"- **{f.get('name')}** ({f.get('category')}): ₹{f.get('price')}\n"
            context += f"  - Description: {f.get('description')}\n"
            context += f"  - Ingredients: {f.get('ingredients', 'Not specified')}\n"
            context += f"  - Details: {veg_status}, Rating: {f.get('rating', 'N/A')}/5, Prep Time: {f.get('preparationTime', 'N/A')} mins, Spice: {f.get('spiceLevel', 'Medium')}\n\n"
        
        context += "\nIMPORTANT INSTRUCTIONS FOR YOU (THE AI ASSISTANT):\n"
        context += "1. You are the TasteCart Food Assistant. Answer customer queries friendly and professionally.\n"
        context += "2. ONLY recommend food items that exist in the catalog above. Do NOT invent new dishes.\n"
        context += "3. If a user asks for recommendations based on budget (e.g., 'under 150'), dietary preference ('veg'), or spice level ('spicy'), filter the catalog above to provide the best matches.\n"
        context += "4. If they ask for something we don't have, politely apologize and recommend something similar from our menu.\n"
        context += "5. Keep your responses concise, conversational, and helpful.\n"
        
        return context
    except Exception as e:
        return f"Error fetching catalog: {e}"

def chat(message, history):
    if not gemini_client:
        return "I'm sorry, my AI brain is currently disconnected (Missing Gemini API Key in .env)."
    
    # Fetch latest catalog
    system_instruction = get_food_catalog_context()
    
    # Format prompt
    full_prompt = system_instruction + "\n\n--- CONVERSATION HISTORY ---\n"
    for item in history:
        if isinstance(item, dict):
            role = item.get("role", "user").capitalize()
            content = item.get("content", "")
            full_prompt += f"{role}: {content}\n"
        elif isinstance(item, (list, tuple)) and len(item) >= 2:
            full_prompt += f"User: {item[0]}\nAssistant: {item[1]}\n"
    
    full_prompt += f"\nUser: {message}\nAssistant:"
    
    try:
        response = gemini_client.models.generate_content(
            model='gemini-3.5-flash',
            contents=full_prompt
        )
        return response.text
    except Exception as e:
        return f"Error generating response: {e}"

# Build Gradio UI
with gr.Blocks() as demo:
    gr.Markdown("## 🍔 TasteCart AI Assistant")
    gr.Markdown("Ask me for food recommendations, ingredients, or dietary options from our live menu!")
    
    chatbot = gr.ChatInterface(
        fn=chat,
        chatbot=gr.Chatbot(height=350),
        textbox=gr.Textbox(placeholder="E.g., I have ₹150 and want something spicy...", container=False, scale=7)
    )

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    demo.launch(server_name="0.0.0.0", server_port=port)
