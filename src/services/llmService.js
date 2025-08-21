const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Classify ticket into category
async function classifyLLM(text) {
  const prompt = `
You are a support triage assistant.
Classify the ticket into one of: billing, technical, shipping, other.
Respond in JSON with fields: category, confidence (0 to 1).
Ticket: "${text}"
  `;
  
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  try {
    const parsed = JSON.parse(resp.choices[0].message.content.trim());
    return { 
      predictedCategory: parsed.category, 
      confidence: parsed.confidence 
    };
  } catch (err) {
    return { predictedCategory: "other", confidence: 0.5 };
  }
}

// Draft a reply using KB articles
async function draftReplyLLM(ticket, articles) {
  const kbText = articles.map(a => `- ${a.title}: ${a.body.slice(0,150)}...`).join("\n");
  const prompt = `
You are a helpful customer support agent.
Ticket: "${ticket.title}" - "${ticket.description}"
Relevant Knowledge Base:
${kbText || "None found"}

Write a polite draft reply to the customer. Keep it short.
  `;
  
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return resp.choices[0].message.content.trim();
}

module.exports = { classifyLLM, draftReplyLLM };
