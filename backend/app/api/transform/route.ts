import OpenAI from "openai";

const client = new OpenAI();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const { title, url, content } = await request.json();

    if (!content?.trim()) {
      return Response.json(
        { error: "No content provided" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert content summarizer. Return only valid JSON matching the schema the user provides.",
        },
        {
          role: "user",
          content: `Analyze the following webpage and extract key information.

Page Title: ${title}
URL: ${url}

Page Content:
${content.slice(0, 15000)}

Return a JSON object with this exact structure:
{
  "title": "a concise, clear title for this content",
  "tldr": "a 2-3 sentence summary capturing the most important information",
  "sections": [
    {
      "heading": "section title",
      "points": ["key point 1", "key point 2", "key point 3"]
    }
  ],
  "keyTakeaways": ["most important insight 1", "most important insight 2", "most important insight 3"],
  "readTime": "X min read"
}

Guidelines:
- Create 2-4 sections based on the content structure
- Each section should have 3-5 concise bullet points
- Key takeaways should be actionable or memorable insights
- Estimate read time based on original content length`,
        },
      ],
    });

    const text = completion.choices[0].message.content ?? "";
    const data = JSON.parse(text);

    return Response.json(data, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("Transform error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Transform failed" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
