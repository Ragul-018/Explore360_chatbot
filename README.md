EXPLORE360 AI Chatbot 🇮🇳
An intelligent, multilingual AI chatbot designed to be the ultimate travel companion for anyone exploring the wonders of India. Built with React and powered by the Google Gemini API, this chatbot provides trip itineraries, finds nearby points of interest, and communicates in multiple Indian languages.

(Recommendation: Create a short GIF showcasing the chatbot's features and replace the link above)

✨ Features
This chatbot is packed with features to enhance the travel planning experience:

Conversational AI: Utilizes the Google Gemini API for natural, context-aware conversations and accurate travel information.

Multilingual Support: Seamlessly switch between multiple languages:

English

Hindi (हिन्दी)

Tamil (தமிழ்)

Bengali (বাংলা)

Gujarati (ગુજરાતી)

Kannada (ಕನ್ನಡ)

Marathi (मराठी)

Dynamic Trip Itineraries: Ask for a trip plan, and the AI will generate a detailed itinerary in a clean, easy-to-read table format.

Advanced Location Search:

Find Anything Nearby: Ask for "hotels near me," "nearby bus stands," or "railway stations around here."

Smart Filtering: Specifically search for vegetarian or non-vegetarian restaurants.

Accurate Results: Uses the OpenStreetMap API for reliable location data.

Interactive Google Maps Links: Every location result includes a button that opens the precise location (using latitude and longitude) in Google Maps in a new tab.

Text-to-Speech (TTS): Click the "Read Aloud" button on any bot message to have it spoken to you, powered by the Gemini TTS API.

Voice Input (Speech-to-Text): Use the microphone button to speak your queries directly to the chatbot using the browser's built-in Web Speech API.

Modern UI: A clean, responsive, and user-friendly chat interface built with Tailwind CSS, featuring a floating action button and quick-reply suggestions.

🛠️ Tech Stack
Frontend: React.js

Styling: Tailwind CSS

Core AI Model: Google Gemini API

Text-to-Speech: Google Gemini TTS API

Location Data: OpenStreetMap (Overpass API)

Voice Input: Web Speech API

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v14 or later)

npm or yarn

Installation
Clone the repo:

git clone [https://github.com/your-username/india-tourism-chatbot.git](https://github.com/your-username/india-tourism-chatbot.git)
cd india-tourism-chatbot

Install NPM packages:

npm install

Set up your API Key:

Create a .env file in the root of your project.

Get your API key from Google AI Studio.

Add the following line to your .env file:

REACT_APP_GEMINI_API_KEY=YOUR_API_KEY_HERE

The project is configured to use this environment variable, so no code changes are needed.

Run the application:

npm start

The app will be available at http://localhost:3000.

🗺️ Future Roadmap
Chat History: Implement local storage to save conversation history.

More Categories: Add more location search categories like ATMs, hospitals, and shopping malls.

Image Generation: Integrate an image generation model to show pictures of tourist destinations.

User Accounts: Allow users to save itineraries and favorite locations.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
Distributed under the MIT License. See LICENSE for more information.
