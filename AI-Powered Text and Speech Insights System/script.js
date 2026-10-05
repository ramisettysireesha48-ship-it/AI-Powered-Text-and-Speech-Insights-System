// ===============================
// GET HTML ELEMENTS
// ===============================

const textInput = document.getElementById("textInput");

const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const micBtn = document.getElementById("micBtn");

const sentiment = document.getElementById("sentiment");
const emotion = document.getElementById("emotion");
const resultWords = document.getElementById("resultWords");
const score = document.getElementById("score");

const keywords = document.getElementById("keywords");
const summary = document.getElementById("summary");


// ===============================
// WORD & CHARACTER COUNTER
// ===============================

textInput.addEventListener("input", function () {

    const text = textInput.value;

    charCount.textContent = text.length;

    const words = text.trim() === ""
        ? []
        : text.trim().split(/\s+/);

    wordCount.textContent = words.length;

});


// ===============================
// CLEAR BUTTON
// ===============================

clearBtn.addEventListener("click", function () {

    textInput.value = "";

    charCount.textContent = "0";
    wordCount.textContent = "0";

    sentiment.textContent = "--";
    emotion.textContent = "--";
    resultWords.textContent = "0";
    score.textContent = "--";

    keywords.innerHTML = `
        <span class="keyword-placeholder">
            Analyze your content to see keywords
        </span>
    `;

    summary.textContent =
        "Your analysis summary will appear here.";

});


// ===============================
// SENTIMENT WORDS
// ===============================

const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "awesome",
    "happy",
    "love",
    "wonderful",
    "best",
    "nice",
    "enjoy",
    "enjoyed",
    "fantastic",
    "perfect",
    "success",
    "successfully",
    "beautiful",
    "positive"
];

const negativeWords = [
    "bad",
    "poor",
    "worst",
    "hate",
    "sad",
    "angry",
    "terrible",
    "horrible",
    "problem",
    "failure",
    "fail",
    "wrong",
    "disappointed",
    "negative",
    "difficult",
    "boring"
];


// ===============================
// EMOTION WORDS
// ===============================

const happyWords = [
    "happy",
    "joy",
    "excited",
    "love",
    "wonderful",
    "amazing",
    "great"
];

const angryWords = [
    "angry",
    "hate",
    "annoyed",
    "frustrated",
    "mad"
];

const sadWords = [
    "sad",
    "cry",
    "lonely",
    "disappointed",
    "upset"
];

const fearWords = [
    "fear",
    "afraid",
    "scared",
    "worried",
    "nervous"
];


// ===============================
// ANALYZE BUTTON
// ===============================

analyzeBtn.addEventListener("click", function () {

    const text = textInput.value.trim();

    if (text === "") {

        alert("Please enter some text or use the microphone.");

        return;
    }


    // Convert text to lowercase

    const lowerText = text.toLowerCase();


    // Create words

    const words = lowerText
        .replace(/[^\w\s]/gi, "")
        .split(/\s+/);


    // ===========================
    // WORD COUNT
    // ===========================

    resultWords.textContent = words.length;


    // ===========================
    // SENTIMENT ANALYSIS
    // ===========================

    let positiveCount = 0;
    let negativeCount = 0;


    words.forEach(function (word) {

        if (positiveWords.includes(word)) {
            positiveCount++;
        }

        if (negativeWords.includes(word)) {
            negativeCount++;
        }

    });


    let sentimentResult;
    let sentimentScore;


    if (positiveCount > negativeCount) {

        sentimentResult = "Positive";

        sentimentScore =
            Math.min(
                98,
                70 + positiveCount * 5
            );

    }
    else if (negativeCount > positiveCount) {

        sentimentResult = "Negative";

        sentimentScore =
            Math.min(
                98,
                70 + negativeCount * 5
            );

    }
    else {

        sentimentResult = "Neutral";

        sentimentScore = 50;

    }


    sentiment.textContent = sentimentResult;

    score.textContent = sentimentScore + "%";


    // ===========================
    // EMOTION ANALYSIS
    // ===========================

    let emotionResult = "Neutral";

    let happyCount = 0;
    let angryCount = 0;
    let sadCount = 0;
    let fearCount = 0;


    words.forEach(function (word) {

        if (happyWords.includes(word)) {
            happyCount++;
        }

        if (angryWords.includes(word)) {
            angryCount++;
        }

        if (sadWords.includes(word)) {
            sadCount++;
        }

        if (fearWords.includes(word)) {
            fearCount++;
        }

    });


    const emotionCounts = {
        "Happy": happyCount,
        "Angry": angryCount,
        "Sad": sadCount,
        "Fear": fearCount
    };


    let highestEmotion = 0;


    for (let item in emotionCounts) {

        if (emotionCounts[item] > highestEmotion) {

            highestEmotion = emotionCounts[item];

            emotionResult = item;

        }

    }


    emotion.textContent = emotionResult;


    // ===========================
    // KEYWORD EXTRACTION
    // ===========================

    const stopWords = [
        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "to",
        "of",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "was",
        "are",
        "it",
        "i",
        "you",
        "we",
        "they",
        "he",
        "she",
        "my",
        "your",
        "very",
        "have",
        "has",
        "had",
        "be",
        "been"
    ];


    const frequency = {};


    words.forEach(function (word) {

        if (
            word.length > 3 &&
            !stopWords.includes(word)
        ) {

            if (frequency[word]) {

                frequency[word]++;

            }
            else {

                frequency[word] = 1;

            }

        }

    });


    const sortedWords = Object.keys(frequency)
        .sort(function (a, b) {

            return frequency[b] - frequency[a];

        })
        .slice(0, 6);


    keywords.innerHTML = "";


    if (sortedWords.length === 0) {

        keywords.innerHTML = `
            <span class="keyword-placeholder">
                No important keywords found.
            </span>
        `;

    }
    else {

        sortedWords.forEach(function (word) {

            const tag = document.createElement("span");

            tag.className = "keyword";

            tag.textContent = word;

            keywords.appendChild(tag);

        });

    }


    // ===========================
    // AI SUMMARY
    // ===========================

    if (sentimentResult === "Positive") {

        summary.textContent =
            "The content has a positive tone. The analysis detected several positive words and an overall favorable expression.";

    }
    else if (sentimentResult === "Negative") {

        summary.textContent =
            "The content has a negative tone. Several negative expressions were detected in the submitted text.";

    }
    else {

        summary.textContent =
            "The content appears neutral. The system did not detect a strong positive or negative sentiment.";

    }

});


// ===============================
// SPEECH RECOGNITION
// ===============================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-US";


    micBtn.addEventListener("click", function () {

        recognition.start();

        micBtn.textContent =
            "🎙️ Listening...";

    });


    recognition.onresult = function (event) {

        const speechText =
            event.results[0][0].transcript;


        textInput.value +=
            (textInput.value ? " " : "") +
            speechText;


        textInput.dispatchEvent(
            new Event("input")
        );


        micBtn.textContent =
            "🎤 Start Speaking";

    };


    recognition.onend = function () {

        micBtn.textContent =
            "🎤 Start Speaking";

    };


    recognition.onerror = function () {

        micBtn.textContent =
            "🎤 Start Speaking";

        alert(
            "Speech recognition could not be started. Please allow microphone access."
        );

    };

}
else {

    micBtn.addEventListener("click", function () {

        alert(
            "Speech recognition is not supported in this browser. Please try Google Chrome."
        );

    });

}