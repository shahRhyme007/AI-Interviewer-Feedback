import React, { useState } from 'react';
import { getFeedback } from '../utils/openaiApi';

const InterviewFeedback = () => {
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
  };

  const handleGetFeedback = async () => {
    setLoading(true);
    const result = await getFeedback(transcript);
    const parsedFeedback = parseFeedback(result);
    setFeedback(parsedFeedback);
    setLoading(false);
  };

  const parseFeedback = (feedbackText) => {
    console.log('Raw feedback text:', feedbackText); // Debug log
    const feedbackArray = [];
    const sections = feedbackText.split('\n\n');

    const trimAndLimit = (text) => {
      return text.split('. ').map(item => {
        const trimmed = item.trim();
        const words = trimmed.split(' ');
        return words.slice(0, 10).join(' ');
      }).filter(item => item !== '');
    };

    sections.forEach(section => {
      const lines = section.split('\n');
      const currentQuestion = {
        question: 'No question provided.',
        strong: [],
        improvement: [],
        confidence: 'No feedback provided.',
        clarity: 'No feedback provided.',
        depth: 'No feedback provided.'
      };

      lines.forEach(line => {
        if (line.startsWith('Question:')) {
          currentQuestion.question = line.replace('Question: ', '');
        } else if (line.startsWith('Answer:')) {
          // We don't need to store the answer in this case
        } else if (line.startsWith('Strong Answers:')) {
          currentQuestion.strong = trimAndLimit(line.replace('Strong Answers: ', ''));
        } else if (line.startsWith('Needs Improvement:')) {
          currentQuestion.improvement = trimAndLimit(line.replace('Needs Improvement: ', ''));
        } else if (line.startsWith('Confidence Level:')) {
          currentQuestion.confidence = line.replace('Confidence Level: ', '');
        } else if (line.startsWith('Clarity and Articulation:')) {
          currentQuestion.clarity = line.replace('Clarity and Articulation: ', '');
        } else if (line.startsWith('Depth of Knowledge:')) {
          currentQuestion.depth = line.replace('Depth of Knowledge: ', '');
        }
      });

      feedbackArray.push(currentQuestion);
    });

    console.log('Parsed feedback array:', feedbackArray); // Debug log
    return feedbackArray;
  };

  return (
    <div>
      <h1>AI Interview Feedback</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste the interview transcript here..."
        value={transcript}
        onChange={handleTranscriptChange}
      />
      <button onClick={handleGetFeedback} disabled={loading}>
        {loading ? 'Generating Feedback...' : 'Get Feedback'}
      </button>
      <h2>Feedback:</h2>
      {feedback.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Question</th>
              <th>Strong Answers</th>
              <th>Needs Improvement</th>
              <th>Confidence Level</th>
              <th>Clarity and Articulation</th>
              <th>Depth of Knowledge</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((fb, index) => (
              <tr key={index}>
                <td>{fb.question}</td>
                <td>
                  <ul>
                    {fb.strong.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {fb.improvement.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </td>
                <td>{fb.confidence}</td>
                <td>{fb.clarity}</td>
                <td>{fb.depth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterviewFeedback;
