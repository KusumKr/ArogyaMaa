const OpenAI = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getSystemPrompt(language) {
  const prompts = {
    en: "You are ArogyaMaa, a compassionate health guide for pregnant women in India. Respond with accurate, simple health advice. Keep answers under 100 words.",
    hi: "आप आरोग्यमाँ हैं, भारत में गर्भवती महिलाओं के लिए स्वास्थ्य मार्गदर्शक। सटीक, सरल स्वास्थ्य सलाह दें। उत्तर 100 शब्दों से कम रखें।"
  };
  return prompts[language] || prompts.en;
}

async function enhanceWithOpenAI(question, trimester, language, baseTip) {
  if (!openai) throw new Error('OpenAI not configured');

  const prompt = `Context: Trimester ${trimester}\nQuestion: ${question}\nBase tip: ${baseTip}\n\nProvide personalized response in ${language === 'hi' ? 'Hindi' : 'English'} under 100 words.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemPrompt(language) },
      { role: 'user', content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.choices[0].message.content.trim();
}

async function chatWithOpenAI(messages, language) {
  if (!openai) throw new Error('OpenAI not configured');

  const messagesWithSystem = [
    { role: 'system', content: getSystemPrompt(language) },
    ...messages
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messagesWithSystem,
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { enhanceWithOpenAI, chatWithOpenAI };