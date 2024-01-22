import React from 'react';

export default function Poll({ question, options }) {
  return (
    <div className="poll-container">
      <p className="poll-question">{question}</p>
      <div className="poll-options">
        {options.map((option, index) => (
          <label key={index}>
            <input type="radio" name="poll-option" value={option} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
