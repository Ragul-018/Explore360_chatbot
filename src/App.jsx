import React, { useState, useEffect, useRef } from 'react';

// API configuration
const API_KEY = "AIzaSyCXmJr0noEYODH3fw2Vl_cGSvVHA8PIZNw"; // Do not change this, Canvas will provide it at runtime.
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
const GEMINI_TTS_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;

// Translations for UI elements
const translations = {
    en: {
        name: "English",
        welcomeMessage: "Hello! I am your personal AI guide for exploring the beautiful country of India. How can I assist you with your travel plans today?",
        placeholder: "Type your message...",
        systemPrompt: `
You are 'India Tourism AI', a friendly and knowledgeable chatbot for Indian tourism. Respond in the language of the user's query.

1.  If the user asks for a trip plan or itinerary, respond with a JSON object with a 'planTable' key. The value of 'planTable' should be an array of objects, each with these keys: 'place', 'arrivalTime', 'departureTime', 'duration', and 'notes'.

2.  For all other queries, respond with a JSON object that has a 'title' string and an 'items' array of strings. Each item should be a key point. The last item in the array can be a suggestion or a question.

Keep all responses conversational and precise.`,
        errorResponse: "I'm sorry, I couldn't generate a response. Please try again.",
        suggestedQueries: [
            "What are the best places to visit in Kerala?",
            "Find vegetarian restaurants near me",
            "Find railway stations nearby",
        ],
        micButton: "Speak",
        readAloud: "Read Aloud",
        ttsVoice: "Kore", // A default firm voice
    },
    hi: {
        name: "हिन्दी",
        welcomeMessage: "नमस्ते! मैं भारत की खोज के लिए आपका व्यक्तिगत एआई गाइड हूं। मैं आज आपकी यात्रा योजनाओं में कैसे मदद कर सकता हूं?",
        placeholder: "अपना संदेश टाइप करें...",
        systemPrompt: `आप 'भारत पर्यटन एआई' हैं, जो भारतीय पर्यटन के लिए एक दोस्ताना और जानकार चैटबॉट हैं। उपयोगकर्ता के प्रश्न की भाषा में जवाब दें।

1.  यदि उपयोगकर्ता यात्रा योजना या यात्रा कार्यक्रम के लिए पूछता है, तो 'planTable' कुंजी के साथ एक JSON ऑब्जेक्ट के साथ प्रतिक्रिया दें। 'planTable' का मान ऑब्जेक्ट्स का एक ऐरे होना चाहिए, प्रत्येक में इन कुंजियों के साथ: 'place', 'arrivalTime', 'departureTime', 'duration', और 'notes'।

2.  अन्य सभी प्रश्नों के लिए, एक JSON ऑब्जेक्ट के साथ प्रतिक्रिया दें जिसमें एक 'title' स्ट्रिंग और स्ट्रिंग्स का एक 'items' ऐरे हो।

बातचीत और सटीक प्रतिक्रियाएं रखें।`,
        errorResponse: "क्षमा करें, मैं प्रतिक्रिया उत्पन्न नहीं कर सका। कृपया पुनः प्रयास करें।",
        suggestedQueries: [
            "दिल्ली के ऐतिहासिक स्थानों के बारे में बताएं।",
            "मेरे पास शाकाहारी रेस्तरां खोजें",
            "आस-पास रेलवे स्टेशन खोजें",
        ],
        micButton: "बोलें",
        readAloud: "जोर से पढ़ें",
        ttsVoice: "Kore", // A firm voice for Hindi
    },
    ta: {
        name: "தமிழ்",
        welcomeMessage: "வணக்கம்! இந்தியாவைச் சுற்றிப் பார்ப்பதற்கான உங்கள் தனிப்பட்ட AI வழிகாட்டி நான். உங்கள் பயணத் திட்டங்களுக்கு நான் இன்று எவ்வாறு உதவ முடியும்?",
        placeholder: "உங்கள் செய்தியைத் தட்டச்சு செய்க...",
        systemPrompt: `நீங்கள் 'இந்திய சுற்றுலா AI', இந்திய சுற்றுலாவுக்கான நட்பான மற்றும் அறிவுள்ள சாட்போட். பயனரின் வினவலின் மொழியில் பதிலளிக்கவும்.

1.  பயனர் பயணத் திட்டம் அல்லது பயண நிரல் கேட்டால், 'planTable' என்ற விசையுடன் ஒரு JSON பொருளுடன் பதிலளிக்கவும். 'planTable'-இன் மதிப்பு பொருட்களின் வரிசையாக இருக்க வேண்டும், ஒவ்வொன்றிலும் இந்த விசைகள் இருக்க வேண்டும்: 'place', 'arrivalTime', 'departureTime', 'duration', மற்றும் 'notes'.

2.  மற்ற அனைத்து வினவல்களுக்கும், 'title' என்ற string மற்றும் 'items' என்ற stringகளின் array கொண்ட ஒரு JSON பொருளுடன் பதிலளிக்கவும்.

அனைத்து பதில்களையும் உரையாடல் மற்றும் துல்லியமாக வைக்கவும்.`,
        errorResponse: "மன்னிக்கவும், என்னால் ஒரு பதிலை உருவாக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்。",
        suggestedQueries: [
            "கேரளாவில் பார்க்க வேண்டிய சிறந்த இடங்கள் யாவை?",
            "எனக்கு அருகிலுள்ள சைவ உணவகங்களைக் கண்டறியவும்",
            "அருகிலுள்ள ரயில் நிலையங்களைக் கண்டறியவும்",
        ],
        micButton: "பேசவும்",
        readAloud: "சத்தமாக படிக்கவும்",
        ttsVoice: "Kore", // An upbeat voice for Tamil
    },
    bn: {
        name: "বাংলা",
        welcomeMessage: "নমস্কার! আমি ভারত ভ্রমণের জন্য আপনার ব্যক্তিগত এআই গাইড। আমি আজ আপনার ভ্রমণ পরিকল্পনায় কীভাবে সাহায্য করতে পারি?",
        placeholder: "আপনার বার্তা লিখুন...",
        systemPrompt: `আপনি 'ভারত পর্যটন এআই', ভারতীয় পর্যটনের জন্য একজন বন্ধুত্বপূর্ণ এবং জ্ঞানী চ্যাটবট। ব্যবহারকারীর প্রশ্নের ভাষায় উত্তর দিন।

1.  ব্যবহারকারী যদি ট্রিপ প্ল্যান বা ভ্রমণসূচীর জন্য জিজ্ঞাসা করে, তাহলে 'planTable' কী সহ একটি JSON অবজেক্ট দিয়ে উত্তর দিন। 'planTable'-এর মান অবশ্যই অবজেক্টের একটি অ্যারে হতে হবে, যার প্রতিটিতে এই কীগুলি থাকবে: 'place', 'arrivalTime', 'departureTime', 'duration', এবং 'notes'।

2.  অন্য সব প্রশ্নের জন্য, একটি 'title' স্ট্রিং এবং স্ট্রিংগুলির একটি 'items' অ্যারে সহ একটি JSON অবজেক্ট দিয়ে উত্তর দিন।

সমস্ত প্রতিক্রিয়া কথোপকথনমূলক এবং নির্ভুল রাখুন।`,
        errorResponse: "দুঃখিত, আমি একটি প্রতিক্রিয়া তৈরি করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        suggestedQueries: [
            "কেরালার সেরা দর্শনীয় স্থানগুলো কী কী?",
            "আমার কাছাকাছি নিরামিষ রেস্তোরাঁ খুঁজুন",
            "কাছাকাছি রেলওয়ে স্টেশন খুঁজুন",
        ],
        micButton: "বলুন",
        readAloud: "উচ্চস্বরে পড়ুন",
        ttsVoice: "Kore", // A firm voice for Bengali
    },
    gu: {
        name: "ગુજરાતી",
        welcomeMessage: "નમસ્કાર! હું ભારતનું અન્વેષણ કરવા માટે તમારો વ્યક્તિગત AI માર્ગદર્શક છું. હું આજે તમારી મુસાફરી યોજનાઓમાં કેવી રીતે મદદ કરી શકું?",
        placeholder: "તમારો સંદેશ લખો...",
        systemPrompt: `તમે 'ભારત ટૂરિઝમ AI' છો, જે ભારતીય પર્યટન માટે એક મૈત્રીપૂર્ણ અને જાણકાર ચેટબોટ છે. વપરાશકર્તાની પૂછપરછની ભાષામાં જવાબ આપો.

1.  જો વપરાશકર્તા ટ્રીપ પ્લાન અથવા પ્રવાસ યોજના માટે પૂછે, તો 'planTable' કી સાથે JSON ઑબ્જેક્ટ સાથે પ્રતિસાદ આપો. 'planTable' નું મૂલ્ય ઑબ્જેક્ટ્સની એરે હોવી જોઈએ, દરેકમાં આ કીઓ સાથે: 'place', 'arrivalTime', 'departureTime', 'duration', અને 'notes'.

2.  અન્ય તમામ પ્રશ્નો માટે, 'title' સ્ટ્રિંગ અને સ્ટ્રિંગ્સની 'items' એરે સાથે JSON ઑબ્જેક્ટ સાથે પ્રતિસાદ આપો.

બધા જવાબો વાતચીત અને ચોક્કસ રાખો.`,
        errorResponse: "માફ કરશો, હું પ્રતિસાદ જનરેટ કરી શક્યો નથી. કૃપા કરીને ફરીથી પ્રયાસ કરો.",
        suggestedQueries: [
            "કેરળમાં ફરવા માટેના શ્રેષ્ઠ સ્થળો કયા છે?",
            "મારી નજીક શાકાહારી રેસ્ટોરન્ટ શોધો",
            "નજીકના રેલ્વે સ્ટેશન શોધો",
        ],
        micButton: "બોલો",
        readAloud: "મોટેથી વાંચો",
        ttsVoice: "Kore", // A firm voice for Gujarati
    },
    kn: {
        name: "ಕನ್ನಡ",
        welcomeMessage: "ನಮಸ್ಕಾರ! ನಾನು ಭಾರತವನ್ನು ಅನ್ವೇಷಿಸಲು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ಮಾರ್ಗದರ್ಶಿ. ಇಂದು ನಿಮ್ಮ ಪ್ರಯಾಣ ಯೋಜನೆಗಳಿಗೆ আমি ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
        systemPrompt: `ನೀವು 'ಭಾರತ ಪ್ರವಾಸೋದ್ಯಮ AI', ಭಾರತೀಯ ಪ್ರವಾಸೋದ್ಯಮಕ್ಕಾಗಿ ಸ್ನೇಹಪರ ಮತ್ತು ಜ್ಞಾನವುಳ್ಳ ಚಾಟ್‌ಬಾಟ್. ಬಳಕೆದಾರರ ಪ್ರಶ್ನೆಯ ಭಾಷೆಯಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯಿಸಿ.

1.  ಬಳಕೆದಾರರು ಪ್ರವಾಸ ಯೋಜನೆ ಅಥವಾ ಪ್ರವಾಸದ ವಿವರವನ್ನು ಕೇಳಿದರೆ, 'planTable' ಕೀಲಿಯೊಂದಿಗೆ JSON ವಸ್ತುವಿನೊಂದಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿ. 'planTable' ಮೌಲ್ಯವು ವಸ್ತುಗಳ ಒಂದು ಶ್ರೇಣಿಯಾಗಿರಬೇಕು, ಪ್ರತಿಯೊಂದೂ ಈ ಕೀಲಿಗಳನ್ನು ಹೊಂದಿರಬೇಕು: 'place', 'arrivalTime', 'departureTime', 'duration', અને 'notes'.

2.  ಎಲ್ಲಾ ಇತರ ಪ್ರಶ್ನೆಗಳಿಗೆ, 'title' ಸ್ಟ್ರಿಂಗ್ ಮತ್ತು ಸ್ಟ್ರಿಂಗ್‌ಗಳ 'items' ಶ್ರೇಣಿಯನ್ನು ಹೊಂದಿರುವ JSON ವಸ್ತುವಿನೊಂದಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿ.

ಎಲ್ಲಾ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಸಂಭಾಷಣಾತ್ಮಕ ಮತ್ತು ನಿಖರವಾಗಿರಿಸಿ.`,
        errorResponse: "ಕ್ಷಮಿಸಿ, ನಾನು ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        suggestedQueries: [
            "ಕೇರಳದಲ್ಲಿ ಭೇಟಿ ನೀಡಲು ಉತ್ತಮ ಸ್ಥಳಗಳು ಯಾವುವು?",
            "ನನ್ನ ಹತ್ತಿರದ ಸಸ್ಯಾಹಾರಿ ರೆಸ್ಟೋರೆಂಟ್‌ಗಳನ್ನು ಹುಡುಕಿ",
            "ಹತ್ತಿರದ ರೈಲು ನಿಲ್ದಾಣಗಳನ್ನು ಹುಡುಕಿ",
        ],
        micButton: "ಮಾತನಾಡಿ",
        readAloud: "ಗಟ್ಟಿಯಾಗಿ ಓದಿ",
        ttsVoice: "Kore", // An upbeat voice for Kannada
    },
    mr: {
        name: "मराठी",
        welcomeMessage: "नमस्कार! मी भारताच्या શોधासाठी तुमचा वैयक्तिक एआय मार्गदर्शक आहे। मी आज तुमच्या प्रवासाच्या યોજનાंमध्ये कशी मदत करू शकतो?",
        placeholder: "तुमचा संदेश टाइप करा...",
        systemPrompt: `तुम्ही 'भारत पर्यटन एआय' आहात, भारतीय पर्यटनासाठी એક मैत्रीपूर्ण आणि जाणकार चॅटಬॉट. वापरकर्त्याच्या प्रश्नाच्या भाषेत উত্তর द्या.

1.  वापरकर्त्याने ट्रिप प्लॅन किंवा प्रवासाची योजना विचारल्यास, 'planTable' की सह JSON ऑब्जेक्टसह प्रतिसाद द्या. 'planTable' चे मूल्य ऑब्जेक्ट्सची अॅरे असावी, प्रत्येकामध्ये या की असाव्यात: 'place', 'arrivalTime', 'departureTime', 'duration', आणि 'notes'.

2.  इतर सर्व प्रश्नांसाठी, 'title' স্ট্রিং आणि स्ट्रिंगची 'items' अॅरे असलेल्या JSON ऑब्जेक्टसह प्रतिसाद द्या.

सर्व प्रतिसाद संभाषणात्मक आणि अचूक ठेवा.`,
        errorResponse: "माफ करा, मी प्रतिसाद तयार करू शकले नाही। कृपया पुन्हा प्रयत्न करा।",
        suggestedQueries: [
            "केरळमधील सर्वोत्तम ठिकाणे कोणती आहेत?",
            "माझ्या जवळ शाकाहारी रेस्टॉरंट शोधा",
            "जवळपासची रेल्वे स्टेशन शोधा",
        ],
        micButton: "बोला",
        readAloud: "मोठ्याने वाचा",
        ttsVoice: "Kore", // A firm voice for Marathi
    },
};

const ChatMessage = ({ message, onSpeak, isUserMessage, speakingMessageId, isTtsLoading, ttsErrorMessage }) => {
    const isUser = message.role === 'user' || isUserMessage;
    const content = message.content;
    const isSpeaking = speakingMessageId === message.id;

    // This check determines if the message contains a table, to make its container wider.
    const hasPlanTable = !isUser && typeof content === 'object' && content !== null && !!content.planTable;

    const renderBotContent = (data) => {
        const isPlanTable = !!data.planTable;
        const hasItems = !!data.items && data.items.length > 0;
    
        return (
            <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-200">
                {isPlanTable && (
                    <div className="overflow-x-auto">
                        <h3 className="text-lg font-bold text-gray-800 underline mb-2">Trip Itinerary</h3>
                        {renderPlanTable(data.planTable)}
                    </div>
                )}
                
                {hasItems && (
                    <>
                        <hr className="my-2 border-gray-300" />
                        <h3 className="text-lg font-bold text-gray-800 underline mb-2">{data.title}</h3>
                        <ul className="list-none p-0 space-y-2 text-gray-700">
                            {data.items.map((item, index) => {
                                const isLocationItem = typeof item === 'object' && item !== null && item.lat && item.lon;
                                const textToDisplay = isLocationItem ? item.text : item;
                                const placeName = isLocationItem ? item.name : null;
                                
                                const processedText = textToDisplay.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                return (
                                    <li key={index} className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <span className="mr-2 text-green-600 mt-1">→</span>
                                            <span dangerouslySetInnerHTML={{ __html: processedText }} />
                                        </div>
                                        {isLocationItem && placeName && (
                                            <a
                                                href={`https://www.google.com/maps?q=${item.lat},${item.lon}(${encodeURIComponent(placeName)})`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-4 p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200 flex-shrink-0"
                                                title={`Open ${placeName} in Google Maps`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        );
    };

    const renderPlanTable = (planTable) => (
        <div className="overflow-x-auto">
            {/* Table layout updated for better space utilization and readability */}
            <table className="min-w-full text-sm md:text-base border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-green-100">
                    <tr>
                        <th className="px-3 py-2 border whitespace-nowrap text-left">Place</th>
                        <th className="px-3 py-2 border whitespace-nowrap text-left">Arrival</th>
                        <th className="px-3 py-2 border whitespace-nowrap text-left">Departure</th>
                        <th className="px-3 py-2 border whitespace-nowrap text-left">Duration</th>
                        <th className="px-3 py-2 border text-left">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {planTable.map((row, idx) => {
                        const placeText = (row.place || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        const notesText = (row.notes || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                        return (
                            <tr key={idx} className="bg-white even:bg-gray-50">
                                <td className="px-3 py-2 border" dangerouslySetInnerHTML={{ __html: placeText }} />
                                <td className="px-3 py-2 border">{row.arrivalTime}</td>
                                <td className="px-3 py-2 border">{row.departureTime}</td>
                                <td className="px-3 py-2 border">{row.duration}</td>
                                <td className="px-3 py-2 border" dangerouslySetInnerHTML={{ __html: notesText }} />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className={`flex w-full mb-4 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Conditional width for the chat bubble: wider for tables, narrower for text. */}
            <div className={`w-full ${hasPlanTable ? 'max-w-[95%]' : 'max-w-[80%]'} shadow-md flex items-start ${isUser ? 'bg-green-600 text-white rounded-tr-xl rounded-tl-xl rounded-bl-xl p-3' : 'bg-gray-200 text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl p-3'}`}>
                {!isUser && (
                       <button
                        onClick={() => onSpeak(content, message.id)}
                        className={`mr-2 p-2 rounded-full transition-colors duration-200 ${isSpeaking ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                        title={isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                        disabled={isTtsLoading && !isSpeaking}
                    >
                        {isTtsLoading && !isSpeaking ? (
                            <div className="loading-indicator !h-4 !w-4 border-white-400 !border-top-white-100 !border-t-transparent !border-r-transparent !border-b-transparent"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                {isSpeaking ? (
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                ) : (
                                    <path d="M8 5v14l11-7z" />
                                )}
                            </svg>
                        )}
                    </button>
                )}
                <div className={`flex-grow ${isUser ? 'text-white' : ''}`}>
                    {isUser ? (
                        <div>
                            {content}
                        </div>
                    ) : (
                        typeof content === 'string' ? (
                            <p>{content}</p>
                        ) : (
                            <>
                                {renderBotContent(content)}
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const QuickReplyButtons = ({ onQueryClick, language, isLoading }) => {
    return (
        <div className="flex flex-wrap gap-2 p-4 pt-0 justify-center">
            {translations[language]?.suggestedQueries.map((query, index) => (
                <button
                    key={index}
                    onClick={() => onQueryClick(query)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {query}
                </button>
            ))}
        </div>
    );
};

const IndiaTourismChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTtsLoading, setIsTtsLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [userInput, setUserInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [audioSource, setAudioSource] = useState(null);
    const [ttsErrorMessage, setTtsErrorMessage] = useState(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Utility functions for audio conversion
    const base64ToArrayBuffer = (base64) => {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    };

    const pcmToWav = (pcm, sampleRate) => {
      const buffer = new ArrayBuffer(44 + pcm.length * 2);
      const view = new DataView(buffer);

      // RIFF identifier
      writeString(view, 0, 'RIFF');
      // file length
      view.setUint32(4, 36 + pcm.length * 2, true);
      // RIFF type
      writeString(view, 8, 'WAVE');
      // format chunk identifier
      view.setUint32(16, 16, true);
      // sample format (raw)
      view.setUint16(20, 1, true);
      // channel count
      view.setUint16(22, 1, true);
      // sample rate
      view.setUint32(24, sampleRate, true);
      // byte rate (sample rate * block align)
      view.setUint32(28, sampleRate * 2, true);
      // block align (channel count * bytes per sample)
      view.setUint16(32, 2, true);
      // bits per sample
      view.setUint16(34, 16, true);
      // data chunk identifier
      writeString(view, 36, 'data');
      // data chunk length
      view.setUint32(40, pcm.length * 2, true);

      // write the PCM samples
      let offset = 44;
      for (let i = 0; i < pcm.length; i++) {
          view.setInt16(offset, pcm[i], true);
          offset += 2;
      }

      return new Blob([view], { type: 'audio/wav' });
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    // Voice recognition logic
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = language;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
                setIsListening(false);
                if (inputRef.current) inputRef.current.focus();
                recognition.stop();
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'not-allowed') {
                    console.error("The user has denied microphone access. Please allow microphone usage in your browser settings.");
                }
                setIsListening(false);
            };
        }
    }, [recognition, language]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);
    
    // Initialize AudioContext
    useEffect(() => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);
    }, []);
    
    // Generic fetch function with exponential backoff
    const fetchWithRetry = async (url, options, maxRetries = 20, initialDelay = 5000) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.status !== 429) {
                    return response;
                }
                console.log(`Rate limit hit (429). Retrying in ${initialDelay * Math.pow(2, i)}ms...`);
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.error(`Fetch error. Retrying in ${initialDelay * Math.pow(2, i)}ms...`, error);
            }
            await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, i)));
        }
        throw new Error('Max retries exceeded.');
    };

    // Function to handle fetching and playing audio from Gemini TTS
    const fetchAndPlayTTS = async (textToSpeak, messageId) => {
      setTtsErrorMessage(null); // Clear previous error
      
      // If the same message is already speaking, stop it.
      if (speakingMessageId === messageId) {
          if (audioSource) {
              audioSource.stop();
              setAudioSource(null);
          }
          setSpeakingMessageId(null);
          setIsTtsLoading(false);
          return;
      }

      // If a different message is speaking, stop it first.
      if (audioSource) {
          audioSource.stop();
          setAudioSource(null);
          setSpeakingMessageId(null);
      }

      setSpeakingMessageId(messageId);
      setIsTtsLoading(true);

      const payload = {
          contents: [{
              parts: [{ text: textToSpeak }]
          }],
          generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                  voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: translations[language].ttsVoice }
                  }
              }
          },
      };

      try {
          const response = await fetchWithRetry(GEMINI_TTS_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
              throw new Error(`TTS API response was not ok. Status: ${response.status}`);
          }

          const result = await response.json();
          const part = result?.candidates?.[0]?.content?.parts?.[0];
          const audioData = part?.inlineData?.data;
          const mimeType = part?.inlineData?.mimeType;

          if (audioData && mimeType && audioContext) {
              const sampleRateMatch = mimeType.match(/rate=(\d+)/);
              const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;
              
              const pcmData = base64ToArrayBuffer(audioData);
              
              const audioBuffer = audioContext.createBuffer(1, pcmData.byteLength / 2, sampleRate);
              const bufferData = audioBuffer.getChannelData(0);
              const pcm16 = new Int16Array(pcmData);
              
              for (let i = 0; i < pcm16.length; i++) {
                  bufferData[i] = pcm16[i] / 32768;
              }

              const newAudioSource = audioContext.createBufferSource();
              newAudioSource.buffer = audioBuffer;
              newAudioSource.connect(audioContext.destination);
              newAudioSource.onended = () => {
                  setSpeakingMessageId(null);
                  setAudioSource(null);
                  setIsTtsLoading(false);
              };
              newAudioSource.start(0);
              setAudioSource(newAudioSource);

          } else {
              console.error("Audio data or context is missing.");
              setSpeakingMessageId(null);
              setIsTtsLoading(false);
              setTtsErrorMessage("Error: Audio data missing from API response.");
          }
      } catch (error) {
          console.error("Error calling Gemini TTS API:", error);
          setSpeakingMessageId(null);
          setIsTtsLoading(false);
          setTtsErrorMessage("Error: TTS service is unavailable. Please try again later.");
      }
    };

    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
        } else {
            if (recognition) {
                try {
                    recognition.start();
                } catch (error) {
                    console.error("Error starting recognition:", error);
                    setIsListening(false);
                }
            }
        }
    };
    
    const speakText = (content, messageId) => {
        let textToSpeak = '';
        if (typeof content === 'string') {
            textToSpeak = content;
        } else {
            const title = content.title || '';
            const itemsText = content.items 
                ? content.items.map(item => (typeof item === 'object' ? item.text : item)).join('. ') 
                : '';
            textToSpeak = `${title}. ${itemsText}`;
        }
        fetchAndPlayTTS(textToSpeak, messageId);
    };
    
    const sendMessageToGemini = async (userMessage) => {
        setIsLoading(true);
        let systemPrompt = translations[language].systemPrompt;

        const chatHistoryForAPI = messages.map(msg => {
            const contentText = typeof msg.content === 'string'
                ? msg.content
                : (msg.content.planTable
                    ? "Trip plan requested."
                    : `${msg.content.title}. ${msg.content.items.map(item => (typeof item === 'object' ? item.text : item)).join(' ')}`);
            return {
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: contentText }]
            };
        }).reverse();

        const payload = {
            contents: [...chatHistoryForAPI, { role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: {
                responseMimeType: "application/json"
            },
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetchWithRetry(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API response was not ok. Status: ${response.status}`);
            }

            const result = await response.json();
            const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (jsonText) {
                let parsedData;
                try {
                    parsedData = JSON.parse(jsonText);
                } catch {
                    parsedData = { title: translations[language].errorResponse, items: [] };
                }
                setMessages(prevMessages => [
                    { role: 'bot', content: parsedData, id: `bot-${Date.now()}` },
                    ...prevMessages
                ]);
            } else {
                setMessages(prevMessages => [
                    { role: 'bot', content: translations[language].errorResponse, id: `bot-${Date.now()}` },
                    ...prevMessages
                ]);
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages(prevMessages => [
                { role: 'bot', content: "An error occurred while connecting. Please try again later.", id: `bot-${Date.now()}` },
                ...prevMessages
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Re-introducing and fixing location features ---

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const fetchNearbyPlaces = async (lat, lon, placeType, foodPreference = 'any') => {
        const radius = 50000; // 50 km
        
        let restaurantFilter = '';
        if (placeType === 'restaurant') {
            if (foodPreference === 'vegetarian') {
                restaurantFilter = '["diet:vegetarian"~"yes|only"]';
            } else if (foodPreference === 'non_vegetarian') {
                restaurantFilter = '["diet:vegetarian"!~"yes|only"]';
            }
        }

        const queries = {
            'tourist': `
                (
                  node["tourism"~"attraction|museum|gallery|viewpoint"](around:${radius},${lat},${lon});
                  way["tourism"~"attraction|museum|gallery|viewpoint"](around:${radius},${lat},${lon});
                  node["historic"~"monument|memorial|castle|ruins"](around:${radius},${lat},${lon});
                  way["historic"~"monument|memorial|castle|ruins"](around:${radius},${lat},${lon});
                );
            `,
            'hotel': `
                (
                  node["tourism"~"hotel|hostel|motel|guest_house"](around:${radius},${lat},${lon});
                  way["tourism"~"hotel|hostel|motel|guest_house"](around:${radius},${lat},${lon});
                );
            `,
            'restaurant': `
                (
                  node["amenity"~"restaurant|cafe|fast_food|food_court"]${restaurantFilter}(around:${radius},${lat},${lon});
                  way["amenity"~"restaurant|cafe|fast_food|food_court"]${restaurantFilter}(around:${radius},${lat},${lon});
                );
            `,
            'bus': `
                (
                  node["highway"="bus_stop"](around:${radius},${lat},${lon});
                  node["amenity"="bus_station"](around:${radius},${lat},${lon});
                  way["amenity"="bus_station"](around:${radius},${lat},${lon});
                );
            `,
            'railway': `
                (
                  node["railway"~"station|halt"](around:${radius},${lat},${lon});
                  way["railway"~"station|halt"](around:${radius},${lat},${lon});
                );
            `,
            'medical': `
                (
                  node["amenity"="pharmacy"](around:${radius},${lat},${lon});
                  node["healthcare"="pharmacy"](around:${radius},${lat},${lon});
                );
            `
        };

        const query = `
            [out:json];
            ${queries[placeType] || queries['tourist']}
            out center;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Overpass API request failed: ${response.status}`);
            const data = await response.json();
            return data.elements
                .filter(el => el.tags && el.tags.name)
                .map(el => ({
                    name: el.tags.name,
                    lat: el.lat || el.center.lat,
                    lon: el.lon || el.center.lon,
                }));
        } catch (error) {
            console.error("Error fetching from Overpass API:", error);
            return null;
        }
    };

    const handleLocationRequest = async (placeType, placeTypeName, foodPreference = 'any') => {
        if (!navigator.geolocation) {
            setMessages(prev => [{ role: 'bot', content: "Geolocation is not supported by your browser.", id: `bot-error-${Date.now()}` }, ...prev]);
            return;
        }

        const waitingMessageId = `bot-location-${Date.now()}`;
        setMessages(prev => [{ role: 'bot', content: "Please allow location access...", id: waitingMessageId }, ...prev]);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setMessages(prev => prev.map(m => m.id === waitingMessageId ? {...m, content: `Location found! Searching for nearby ${placeTypeName}...`} : m));
                
                const { latitude, longitude } = position.coords;
                const places = await fetchNearbyPlaces(latitude, longitude, placeType, foodPreference);

                setMessages(prev => prev.filter(m => m.id !== waitingMessageId));

                if (places === null) {
                    setMessages(prev => [{ role: 'bot', content: "Sorry, I couldn't connect to the map service. Please try again later.", id: `bot-error-${Date.now()}` }, ...prev]);
                    return;
                }

                if (places.length === 0) {
                    setMessages(prev => [{ role: 'bot', content: `I couldn't find any ${placeTypeName} within 50km.`, id: `bot-error-${Date.now()}` }, ...prev]);
                    return;
                }

                const placesWithDistance = places
                    .map(place => ({
                        ...place,
                        distance: getDistance(latitude, longitude, place.lat, place.lon)
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 10);
                
                const botResponse = {
                    title: `Nearby ${placeTypeName.charAt(0).toUpperCase() + placeTypeName.slice(1)}`,
                    items: placesWithDistance.map(p => ({
                        text: `**${p.name}** - Approx. ${p.distance} km away`,
                        name: p.name,
                        lat: p.lat,
                        lon: p.lon
                    }))
                };
                
                setMessages(prev => [
                    { role: 'bot', content: botResponse, id: `bot-${Date.now()}` },
                    ...prev
                ]);
            },
            (error) => {
                setMessages(prev => prev.filter(m => m.id !== waitingMessageId));
                let errorMessage = "I couldn't get your location. ";
                switch(error.code) {
                    case error.PERMISSION_DENIED: errorMessage += "You denied the request for Geolocation."; break;
                    case error.POSITION_UNAVAILABLE: errorMessage += "Location information is unavailable."; break;
                    case error.TIMEOUT: errorMessage += "The request to get user location timed out."; break;
                    default: errorMessage += "An unknown error occurred."; break;
                }
                setMessages(prev => [{ role: 'bot', content: errorMessage, id: `bot-error-${Date.now()}` }, ...prev]);
            }
        );
    };

    const processMessage = (message) => {
        setMessages(prevMessages => [{ role: 'user', content: message, id: `user-${Date.now()}` }, ...prevMessages]);
        setUserInput('');
        if (inputRef.current) inputRef.current.focus();

        const lowerCaseMessage = message.toLowerCase();
        const nearbyKeywords = ['nearby', 'near me', 'around here', 'close by', 'around me'];

        const placeTypeMapping = {
            'tourist': { keywords: ['tourist spot', 'tourist spots', 'attraction', 'attractions', 'sight', 'sights', 'places to visit', 'landmark', 'landmarks'], name: 'tourist spots' },
            'hotel': { keywords: ['hotel', 'hotels', 'stay', 'stays', 'accommodation', 'lodging'], name: 'hotels' },
            'restaurant': { keywords: ['restaurant', 'restaurants', 'food', 'cafe', 'cafes', 'eat', 'diner', 'diners', 'vegetarian', 'non-vegetarian', 'veg', 'non veg'], name: 'restaurants' },
            'bus': { keywords: ['bus stand', 'bus stands', 'bus stop', 'bus stops', 'bus station', 'bus stations'], name: 'bus stops' },
            'railway': { keywords: ['railway station', 'railway stations', 'train station', 'train stations'], name: 'railway stations' },
            'medical': { keywords: ['medical shop', 'medical shops', 'pharmacy', 'pharmacies', 'drugstore', 'drugstores', 'chemist', 'chemists'], name: 'medical shops' }
        };
        
        let isLocationQuery = nearbyKeywords.some(keyword => lowerCaseMessage.includes(keyword));

        if (isLocationQuery) {
            let detectedPlaceType = 'tourist';
            let detectedPlaceTypeName = 'tourist spots';
            let foodPreference = 'any';

            if (lowerCaseMessage.includes('vegetarian') || lowerCaseMessage.includes('veg')) {
                foodPreference = 'vegetarian';
            } else if (lowerCaseMessage.includes('non-vegetarian') || lowerCaseMessage.includes('non veg')) {
                foodPreference = 'non_vegetarian';
            }

            for (const type in placeTypeMapping) {
                if (placeTypeMapping[type].keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
                    detectedPlaceType = type;
                    detectedPlaceTypeName = placeTypeMapping[type].name;
                    break;
                }
            }
            
            if (detectedPlaceType === 'restaurant' && foodPreference !== 'any') {
                detectedPlaceTypeName = `${foodPreference === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'} restaurants`;
            }
            
            handleLocationRequest(detectedPlaceType, detectedPlaceTypeName, foodPreference);
        } else {
            sendMessageToGemini(message);
        }
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const message = userInput.trim();
        if (message) {
            processMessage(message);
        }
    };

    const handleQuickReply = (query) => {
        processMessage(query);
    };

    // Load initial welcome message when the component mounts or language changes
    useEffect(() => {
        setMessages([
            { role: 'bot', content: translations[language].welcomeMessage, id: 'welcome-message' }
        ]);
    }, [language]);
    
    const openChatbot = () => {
        setShowChatbot(true);
        setTimeout(() => setIsChatbotOpen(true), 10); // allow DOM to render before animating
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
        setTimeout(() => setShowChatbot(false), 300); // match transition duration
    };

    return (
        <>
        <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen bg-slate-100">
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .chat-container {
                    max-width: 600px;
                    height: 80vh;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    border-radius: 1.5rem;
                    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    overflow: hidden;
                    background-color: white;
                }
                .chat-header {
                    background: linear-gradient(135deg, #16a34a, #14532d);
                    color: white;
                }
                .chat-messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    background-color: #f7fee7;
                }
                .loading-indicator {
                    height: 1.5rem;
                    width: 1.5rem;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #14532d;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .send-button, .favorite-button {
                    transition: all 0.2s ease-in-out;
                    background-color: #166534;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .send-button:hover, .favorite-button:hover {
                    background-color: #15803d;
                    transform: translateY(-2px);
                    box-shadow: 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                }
                .send-button:disabled, .favorite-button:disabled {
                    background-color: #a7f3d0;
                    transform: none;
                    box-shadow: none;
                }
                .custom-dropdown-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background-color: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .custom-dropdown-button:hover {
                    background-color: #e5e7eb;
                }
                .custom-dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 0.5rem;
                    background-color: #fff;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                    min-width: 120px;
                }
                .custom-dropdown-item {
                    display: block;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-size: 0.875rem;
                    color: #4b5563;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .custom-dropdown-item:hover {
                    background-color: #f3f4f6;
                }
                `}
            </style>
            {showChatbot && (
                <div className="fixed bottom-24 right-6 z-50">
                    <div
                        className={`
                            chat-container relative
                            transition-all duration-300 ease-in-out
                            ${isChatbotOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
                        `}
                        style={{ transformOrigin: 'bottom right' }}
                    >
                        {/* Chat header with close button */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-green-700 text-2xl">India Tourism AI</span>
                                
                                {/* Language Selector Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="custom-dropdown-button"
                                    >
                                        <span>{translations[language].name}</span>
                                        <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="custom-dropdown-menu">
                                            {Object.keys(translations).map((langCode) => (
                                                <button
                                                    key={langCode}
                                                    onClick={() => {
                                                        setLanguage(langCode);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="custom-dropdown-item"
                                                >
                                                    {translations[langCode].name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={closeChatbot}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow transition-all ml-2"
                                aria-label="Close chatbot"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Main Content Area */}
                        <div className="chat-messages flex flex-col-reverse">
                            {isLoading && (
                                <div className="flex justify-center w-full p-4 text-gray-500 italic">
                                    Thinking...
                                </div>
                            )}
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    isUserMessage={message.role === 'user'}
                                    speakingMessageId={speakingMessageId}
                                    onSpeak={speakText}
                                    isTtsLoading={isTtsLoading}
                                    ttsErrorMessage={ttsErrorMessage}
                                />
                            ))}
                            {ttsErrorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                                    <strong className="font-bold">TTS Error!</strong>
                                    <span className="block sm:inline ml-2">{ttsErrorMessage}</span>
                                </div>
                            )}
                        </div>
                        
                        {messages.length === 1 && (
                            <QuickReplyButtons onQueryClick={handleQuickReply} language={language} isLoading={isLoading} />
                        )}

                        <form onSubmit={handleFormSubmit} className="chat-input-form p-4 flex items-center space-x-2 bg-gray-100 border-t border-gray-200">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={translations[language].placeholder}
                                className="flex-grow p-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 transition-all shadow-sm text-black"
                                disabled={isLoading}
                                ref={inputRef}
                            />
                            {recognition && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`p-3 rounded-full text-white shadow-md transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-600'}`}
                                >
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3.53-2.61 6.42-6 6.92V21h-2v-3.08c-3.39-.5-6-3.39-6-6.92h2c0 2.98 2.42 5.4 5.4 5.4 2.98 0 5.4-2.42 5.4-5.4h2z"/>
                                    </svg>
                                </button>
                            )}
                            <button type="submit" className="send-button p-3 rounded-full text-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-700" disabled={isLoading}>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Chatbot Toggle Button */}
            {!isChatbotOpen && (
                <button
                    onClick={openChatbot}
                    className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all"
                    aria-label="Open chatbot"
                >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3H17c0 2.76-2.24 5-5 5zm-3-3v-2h2v2H9zm4 0v-2h2v2h-2z"/>
                                </svg>
                            </button>
                        )}
                </div>
                </>
            );
        };
        
        export default IndiaTourismChatbot;

