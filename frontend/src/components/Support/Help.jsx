import React, { useState } from "react";

const faqs = [
  {
    question: "How do I upload a video?",
    answer: "Click on the 'Upload Video' button at the top of the admin dashboard page, fill in the video details, and submit.",
  },
  {
    question: "How can I reset my password?",
    answer: "Go to your edit profile , select 'Change Password', and follow the instructions.",
  },
  {
    question: "How do I report inappropriate content?",
    answer: "Use the 'Report' button available under each video or comment to notify our team.",
  },
  {
    question: "How can I contact support?",
    answer: "You can go to the Support page and submit your query using the contact form.",
  },
  {
    question: "How do I manage Videos?",
    answer: "Go to Admin Dashboad > You can edit,delete,upload, publised  videos .",
  },
];

function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-900 mt-16  px-4 sm:px-6 md:px-12 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Help & FAQ</h1>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-4 flex justify-between items-center text-white font-semibold hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition"
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}-content`}
              id={`faq-${index}-header`}
            >
              <span className="text-sm sm:text-base">{faq.question}</span>
              <span className="text-purple-500 text-xl select-none">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-${index}-content`}
                aria-labelledby={`faq-${index}-header`}
                className="p-4 text-gray-300 bg-gray-800 border-t border-gray-700 text-sm sm:text-base"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Help;
