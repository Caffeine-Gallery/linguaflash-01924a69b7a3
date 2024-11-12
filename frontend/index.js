import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLang = document.getElementById('targetLang');
const translationOutput = document.getElementById('translationOutput');
const speakButton = document.getElementById('speakButton');
const lastTranslationDiv = document.getElementById('lastTranslation');

let translationTimeout;

async function translateText() {
    const text = inputText.value;
    const target = targetLang.value;

    if (text.trim() === '') {
        translationOutput.textContent = '';
        return;
    }

    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        translationOutput.textContent = data.translatedText;

        // Save translation to backend
        await backend.saveTranslation(data.translatedText);
    } catch (error) {
        console.error('Translation error:', error);
        translationOutput.textContent = 'Translation error occurred.';
    }
}

inputText.addEventListener('input', () => {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(translateText, 500);
});

targetLang.addEventListener('change', translateText);

speakButton.addEventListener('click', () => {
    const text = translationOutput.textContent;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang.value;
        speechSynthesis.speak(utterance);
    }
});

// Fetch and display last translation on page load
window.addEventListener('load', async () => {
    try {
        const lastTranslation = await backend.getLastTranslation();
        if (lastTranslation) {
            lastTranslationDiv.textContent = `Last translation: ${lastTranslation}`;
        }
    } catch (error) {
        console.error('Error fetching last translation:', error);
    }
});
