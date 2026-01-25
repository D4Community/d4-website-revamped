import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, apiKey } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { 
          response: "I'm currently in offline mode. For detailed information, please fill out the contact form and our team will get back to you! You can also check our community links for immediate joining."
        }
      );
    }

    // Try different model names that might be available in your plan
    const modelsToTry = [
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest", 
      "gemini-1.0-pro-latest",
      "gemini-pro",
      "models/gemini-pro"
    ];

    let lastError: Error | null = null;
    
    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are D4 Community Assistant for D4 Community (Discite • Develop • Debug • Deploy).
                  
                  About D4 Community:
                  - Tech community for developers, designers, and tech enthusiasts
                  - Online community across India
                  - Motto: Discite (Learn) • Develop • Debug • Deploy
                  - Organizes hackathons, workshops, and tech events
                  - Focuses on learning, collaboration, and networking
                  - Active on WhatsApp, Discord, LinkedIn, Instagram, etc.
                  - Email: help.d4community@gmail.com
                  
                  Instructions:
                  - Keep responses brief (2-3 sentences maximum)
                  - Be friendly and welcoming
                  - If question is about joining: mention WhatsApp/Discord links
                  - If question is about events: mention Commudle page
                  - If question is technical or requires personal info: suggest contact form
                  - Always end with suggestion to use contact form for detailed inquiries
                  
                  User Question: ${query}
                  
                  Your response:`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 150,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Model ${model} failed:`, response.status);
          lastError = new Error(`Model ${model}: ${response.status}`);
          continue; // Try next model
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("No response text from model");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        
        return NextResponse.json({ 
          response: responseText,
          model: model
        });

      } catch (modelError: any) {
        console.error(`Error with model ${model}:`, modelError);
        lastError = modelError instanceof Error ? modelError : new Error(String(modelError));
        // Continue to next model
      }
    }

    // If all models failed, check what models are available
    if (apiKey) {
      try {
        const modelsResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          console.log("Available models:", modelsData.models?.map((m: any) => m.name));
        }
      } catch (listError) {
        console.error("Failed to list models:", listError);
      }
    }

    // Fallback response if all models fail
    console.error("All models failed, using fallback");
    
    const fallbackResponses = [
      "I'm currently experiencing technical difficulties. Please use the contact form for detailed inquiries about D4 Community!",
      "Thanks for reaching out! For the best assistance with D4 Community, please use our contact form below.",
      "I'm having trouble connecting right now. You can check our community links or use the contact form to get in touch with our team!"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({ 
      response: randomResponse,
      error: lastError?.message || "All model attempts failed"
    });

  } catch (error: any) {
    console.error("Server error:", error);
    
    const fallbackResponses = [
      "I'm currently experiencing technical difficulties. Please use the contact form for detailed inquiries!",
      "Thanks for reaching out! For the best assistance, please use our contact form below.",
      "I'm having trouble connecting right now. You can check our community links or use the contact form!"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({ 
      response: randomResponse,
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 });
  }
}