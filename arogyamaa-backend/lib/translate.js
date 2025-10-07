const axios = require('axios');

const staticTranslations = {
  'en_to_hi': {
    'Stay hydrated': 'पर्याप्त पानी पिएं',
    'Eat healthy': 'स्वस्थ भोजन करें',
    'Consult your doctor': 'अपने डॉक्टर से परामर्श करें',
    'Take rest': 'आराम करें',
    'Exercise regularly': 'नियमित व्यायाम करें',
    'Eat iron-rich foods': 'आयरन युक्त खाद्य पदार्थ खाएं',
    'Drink milk': 'दूध पिएं'
  }
};

async function translateWithGoogle(text, targetLang) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  const url = 'https://translation.googleapis.com/language/translate/v2';
  const response = await axios.post(url, null, {
    params: {
      q: text,
      target: targetLang,
      key: process.env.GOOGLE_API_KEY
    }
  });

  return response.data.data.translations[0].translatedText;
}

function translateWithDictionary(text, targetLang) {
  if (targetLang === 'en') return text;

  const dictKey = `en_to_${targetLang}`;
  const dictionary = staticTranslations[dictKey];

  if (!dictionary) return text;

  if (dictionary[text]) return dictionary[text];

  let translated = text;
  for (const [english, hindi] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, hindi);
  }

  return translated;
}

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;

  if (process.env.GOOGLE_API_KEY) {
    try {
      return await translateWithGoogle(text, targetLang);
    } catch (error) {
      console.warn('Google Translate failed, using fallback');
    }
  }

  return translateWithDictionary(text, targetLang);
}

module.exports = { translateText };