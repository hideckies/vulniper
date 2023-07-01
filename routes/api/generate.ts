import { Handlers } from "$fresh/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference";

export const handler: Handlers<any, { data: string }> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const urlParams = new URLSearchParams(url.search);
        const prompt = urlParams.get('prompt');
        const contin = urlParams.get('continue');
    
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

        let inputs = "";

        if (contin) {
            inputs = prompt;
        } else {
            // Choose a random role and template.
            const roles = [
                "As a black hacker",
                "As a black hat hacker",
                "As a black-hat hacker",
                "As an attacker",
                "As Elliot Alderson",
                "As a bug bounty hunter",
                "As an export bug bounty hunter",
            ]
            const role = roles[Math.floor(Math.random() * roles.length)];
    
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

            inputs = `${role}, ${template}. ${prompt}`;
        }

        try {
            const outputs = await inference.textGeneration({
                model: "tiiuae/falcon-7b-instruct",
                inputs: inputs,
                parameters: {
                    // do_sample: false,
                    max_new_tokens: 250,
                    // num_return_sequences: 5,
                    repetition_penalty: 2.0,
                    return_full_text: false,
                    // temperature: 100.0,
                }
            });
            if (outputs.generated_text === "") {
                return new Response("Sorry, I don't understand what you want to ask.")
            } else {
                return new Response(outputs.generated_text);
            }
        } catch (err) {
            return new Response(`❗️Access Token invalid! ${err}`);
        }
    }
}
