/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
	
		const userPrompt = 'Get me the headings of the page.';
		const html = `<!DOCTYPE html>
		  <html lang="en">
		  <head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Alert with DOMContentLoaded</title>
			  <script>
				  // JavaScript function to display an alert when the DOM is fully loaded
				  document.addEventListener("DOMContentLoaded", function() {
					  alert("Welcome to the page! The DOM is fully loaded.");
				  });
			  </script>
		  </head>
		  <body>
			  <h1>Hello, World 1!</h1>
              <h2>Hello, World 2!</h2>
			  <p>This page uses DOMContentLoaded to show an alert after the DOM is ready.</p>
		  </body>
		  </html>`;
		const response_format = {
			type: 'json_schema',
			json_schema: {
				type: 'object',
				properties: {
					h1: {
						type: 'string',
					},
					h2: {
						type: 'string',
					},
					h3: {
						type: 'string',
					},
				},
				required: ['h1', 'h2', 'h3'],
			},
		};

		// Prompt to pass to LLM
		const prompt = `
		You are a sophisticated web scraper. You are given the user data extraction goal and the JSON schema for the output data format.
		Your task is to extract the requested information from the text and output it in the specified JSON schema format:
	
			${JSON.stringify(response_format)}
	
		DO NOT include anything else besides the JSON output, no markdown, no plaintext, just JSON.
	
		User Data Extraction Goal: ${userPrompt}
	
		Text extracted from the webpage: ${html}`;

		const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			response_format: response_format,
		});

		return Response.json(response);
	},
} satisfies ExportedHandler<Env>;
