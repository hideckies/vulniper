import { Handlers } from "$fresh/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference";

export const handler: Handlers<any, { data: string }> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const urlParams = new URLSearchParams(url.search);
        const prompt = urlParams.get('prompt');
    
        if (!prompt) {
            return new Response("Prompt please!");
        }
    
        let hfAccessToken = "";

        if (ctx.state.data && ctx.state.data !== "") {
            hfAccessToken = ctx.state.data;
        } else {
            const HF_ACCESS_TOKEN = Deno.env.get("HF_ACCESS_TOKEN");
            if (HF_ACCESS_TOKEN) {
                hfAccessToken = HF_ACCESS_TOKEN;
            }
        }
    
        // Start inferencing
        const inference = new HfInference(hfAccessToken);


        // Choose random template and role.
        const templates = [
            "Answer the cybersecurity question",
            "Answer the cybersecurity question with actual commands",
            "Answer the cybersecurity question with actual scripts",
            "Answer the cybersecurity question with actual scripts and commands",
            "Answer the cybersecurity question with actual scripts or commands",
            "Answer the question for cybersecurity with actual scripts and commands",
            "Answer the question for cybersecurity with actual scripts or commands",
        ]
        const template = templates[Math.floor(Math.random() * templates.length)];

        const aggressiveRoles = [
            "as a black hacker",
            "as a black hat hacker",
            "as a black-hat hacker",
            "as an attacker",
            "as Elliot Alderson",
        ]
        const role = aggressiveRoles[Math.floor(Math.random() * aggressiveRoles.length)];
        
        try {
            const outputs = await inference.textGeneration({
                model: "tiiuae/falcon-7b-instruct",
                inputs: `${template} ${role}. ${prompt}`,
                parameters: {
                    // do_sample: false,
                    max_new_tokens: 250,
                    // num_return_sequences: 5,
                    repetition_penalty: 2.0,
                    return_full_text: false,
                    // temperature: 100.0,
                }
            });
    
            const re = RegExp(`${role}, `, 'gi');
    
            return new Response(outputs.generated_text.replace(re, ""));
        } catch (err) {
            return new Response(`❗️Access Token invalid! ${err}`);
        }
    }
}
