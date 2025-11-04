const OpenAI = require("openai");
let client = null;

// Only initialize if key exists
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI Enabled");
} else {
  console.log("⚠️ OpenAI API Key missing — running without AI enhancement");
}

function getSystemPrompt(language) {
  const prompts = {
    en: "You are ArogyaMaa, a compassionate health guide for pregnant women in India.",
    hi: "आप आरोग्यमाँ हैं, भारत में गर्भवती महिलाओं के लिए स्वास्थ्य मार्गदर्शक।"
  };
  return prompts[language] || prompts.en;
}

async function enhanceWithOpenAI(question, trimester, language, baseTip) {
  // ✅ If no AI key, return only base tip
  if (!client) {
    return `${baseTip}\n\n(ℹ️ AI enhancement disabled — no API key)`;
  }

  const completion = await client.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: getSystemPrompt(language) },
      { role: "user", content: `Trimester: ${trimester}\nQuestion: ${question}\nBase Tip: ${baseTip}` }
    ],
    max_tokens: 200
  });

  return completion.choices[0].message.content.trim();
}

async function chatWithOpenAI(messages, language) {
  if (!client) {
    return "(ℹ️ AI disabled — no OpenAI API key set)";
  }

  const completion = await client.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: getSystemPrompt(language) },
      ...messages
    ],
    max_tokens: 200
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { enhanceWithOpenAI, chatWithOpenAI };
