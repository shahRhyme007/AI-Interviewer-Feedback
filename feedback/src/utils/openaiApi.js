import axios from 'axios';

// Replace with your actual OpenAI API key
const apiKey = 'YOUR_API_KEY';

export const getFeedback = async (transcript) => {
  const prompt = `The following is an interview transcript. Please provide detailed feedback for each question and answer in the format specified below. Ensure each feedback point is concise and between 5-10 words in bullet points. The feedback should include:
  1. Strong answers (5-10 keywords in bullet points)
  2. Answers needing more work with specific advice on how to improve future answers (5-10 keywords in bullet points)
  3. Confidence level (high, medium, low)
  4. Clarity and Articulation (how clearly and articulately the interviewee presented their answer)
  5. Depth of Knowledge (assessment of the depth and breadth of knowledge demonstrated in the answer)

  Here is the transcript:

  ${transcript}

  Please provide feedback for each question and answer in the format:
  Question: [question]
  Answer: [answer]
  Strong Answers: [feedback]
  Needs Improvement: [feedback]
  Confidence Level: [feedback]
  Clarity and Articulation: [feedback]
  Depth of Knowledge: [feedback]`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI assistant that provides detailed feedback on interview transcripts.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    console.log('OpenAI API response:', response.data); // Debug log
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching feedback from OpenAI API:', error); // Debug log
    return 'Error fetching feedback.';
  }
};
