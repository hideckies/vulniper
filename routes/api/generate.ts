import { Handlers } from "$fresh/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference";

// export const handler = async (req: Request, ctx: HandlerContext): Promise<Response> => {
export const handler: Handlers<any, { data: string }> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const urlParams = new URLSearchParams(url.search);
        const prompt = urlParams.get('prompt');
    
        if (!prompt) {
            return new Response("Prompt please!");
        }
    
        const HF_ACCESS_TOKEN = Deno.env.get("HF_ACCESS_TOKEN");
        if (!HF_ACCESS_TOKEN) {
            return new Response(null);
        }
    
        let hfAccessToken = "";
    
        if (ctx.state.data && ctx.state.data !== "") {
            hfAccessToken = ctx.state.data;
        }
    
    
        // Start inferencing
        const inference = new HfInference(hfAccessToken);
    
        const template = "Answer the cybersecurity questions";
        const whoAreYou = "as a red teamer"
    
        try {
            const outputs = await inference.textGeneration({
                model: "tiiuae/falcon-7b-instruct",
                inputs: `${template} ${whoAreYou}. ${prompt}`,
                parameters: {
                    // do_sample: false,
                    max_new_tokens: 250,
                    // num_return_sequences: 5,
                    repetition_penalty: 2.0,
                    return_full_text: false,
                    // temperature: 100.0,
                }
            });
    
            const re = RegExp(`${whoAreYou}, `, 'gi');
    
            return new Response(outputs.generated_text.replace(re, ""));
        } catch (err) {
            return new Response(`❗️Access Token invalid! ${err}`);
        }
    }
}
