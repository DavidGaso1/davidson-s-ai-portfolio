
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('VITE_GEMINI_API_KEY=')) {
            apiKey = line.split('=')[1].trim();
            break;
        }
    }
}

if (!apiKey) {
    console.error("❌ Could not find VITE_GEMINI_API_KEY in .env.local");
    process.exit(1);
}

console.log(`🔑 Found API Key: ${apiKey.substring(0, 4)}...`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function test() {
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    
    for (const modelName of modelsToTry) {
        console.log(`\n🤖 Attempting '${modelName}'...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test connection");
            const response = await result.response;
            console.log(`✅ SUCCESS with ${modelName}! Response: ${response.text()}`);
            return; // Exit on first success
        } catch (error) {
            console.error(`❌ Failed with ${modelName}`);
            // Log key error details
            if (error.message.includes("403")) console.error("   -> 403 Forbidden: API Key may lack permissions or be invalid.");
            else if (error.message.includes("404")) console.error("   -> 404 Not Found: Model name incorrect or not available.");
            else console.error("   -> Error:", error.message);
        }
    }
    console.log("\n❌ All attempts failed. Please verify your API Key in Google AI Studio.");
}

test();
