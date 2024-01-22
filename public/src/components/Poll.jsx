import React from 'react';

export default function Poll({ question, options }) {
  return (
    <div className="poll-container">
      <p className="poll-question">{question}</p>
      <div className="poll-options">
        {options.map((option, index) => (
          <div key={index}>
            <input type="radio" name={`poll-${question}`} value={option} id={`option-${index}`} />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
