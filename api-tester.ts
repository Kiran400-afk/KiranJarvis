import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-exp-02-05",
    "gemini-2.0-flash-thinking-exp-01-21",
    "gemini-2.0-flash-exp",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-3.0-flash",
    "gemini-3.0-pro",
    "gemini-3.1-preview"
];

async function run() {
    console.log("🚀 Starting Gemini Model Tester...\n");

    for (const model of models) {
        process.stdout.write(`Testing ${model.padEnd(40)} ... \t`);

        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: "Hello",
            });
            console.log(`✅ SUCCESS`);
        } catch (e: any) {
            if (e.status === 404) {
                console.log("❌ NOT FOUND");
            } else if (e.status === 403) {
                console.log(`❌ FORBIDDEN (No access or invalid key for this model)`);
            } else {
                const msg = e.message ? e.message.split('\n')[0].substring(0, 60) : String(e);
                console.log(`❌ ERROR: ${msg}...`);
            }
        }
    }
}

run();
