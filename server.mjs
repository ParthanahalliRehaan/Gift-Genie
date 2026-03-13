import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);
dotenv.config({path:path.resolve(__dirname,"../.env")});
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

const openai = new OpenAI({
    apiKey:process.env.AI_KEY,
    baseURL:process.env.AI_URL
});

const messages = [
    {
        role:"system",
        content:`You are the Gift Genie that can search the web! 

            You generate gift ideas that feel thoughtful, specific, and genuinely useful.
            Your output must be in structured Markdown.
            Do not write introductions or conclusions.
            Start directly with the gift suggestions.

            Each gift must:
            - Have a clear heading with the actual product's name
            - Include a short explanation of why it works
            - Include the current price or a price range
            - Include one or more links to websites or social media business pages
            where the gift can be bought

            Prefer products that are widely available and well-reviewed.
            If you can't find a working link, say so rather than guessing.

            If the user mentions a location, situation, or constraint,
            adapt the gift ideas and add another short section 
            under each gift that guides the user to get the gift in that 
            constrained context.

            After the gift ideas, include a section titled "Questions for you"
            with clarifying questions that would help improve the recommendations.

            Finish with a section with H2 heading titled "Wanna browse yourself?"
            with links to various ecommerce sites with relevant search queries and filters 
            already applied.`
    },
];

app.post("/api/gift-genie", async (req,res)=>{
    const { prompt }= req.body;
    messages.push({
        role:"user",
        content:prompt
    });
    try{
        const response = await openai.chat.completions.create({
            model:process.env.AI_MODEL,
            messages,
            /*tools:[{
                type: "web_search"
            }]*/
           //Just for responses api not for this
        });
        res.json({reply:response.choices[0].message.content});
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

app.listen(PORT,()=>{
    console.log(`The server is running on http://localhost:${PORT}`);
})
