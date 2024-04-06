import { useEffect, useState } from 'react'
import styled from 'styled-components'

export default function Poll({ question, options, correctOptions }) {
	const [selectedValue, setSelectedValue] = useState('')
	const [isCorrect, setIsCorrect] = useState(null)
	const [isChoiceMade, setIsChoiceMade] = useState(false)

	useEffect(() => {
		const savedValue = localStorage.getItem(`selectedRadioValue_${question}`)
		const savedIsCorrect = localStorage.getItem(`isCorrect_${question}`)
		if (savedValue !== null) {
			setSelectedValue(savedValue)
			setIsCorrect(savedIsCorrect === 'true')
			setIsChoiceMade(true)
		}
	}, [question])

	const handleChange = event => {
		const newValue = event.target.value
		const correct = correctOptions.includes(newValue)

		setSelectedValue(newValue)
		setIsCorrect(correct)
		setIsChoiceMade(true)

		localStorage.setItem(`selectedRadioValue_${question}`, newValue)
		localStorage.setItem(`isCorrect_${question}`, correct)
	}

	return (
		<Container>
			<div className='poll-container'>
				<h3 className='poll-question'>{question}</h3>
				<div className='poll-options'>
					{[...options, ...correctOptions].map((option, index) => (
						<div className='poll-cont' key={index}>
							<label htmlFor={`option-${index}`}>{option}</label>
							<input
								type='radio'
								name={`poll-${question}`}
								value={option}
								id={`option-${index}`}
								checked={selectedValue === option}
								onChange={handleChange}
								disabled={isChoiceMade}
							/>
						</div>
					))}
				</div>
				{isChoiceMade && (
					<div
						className='result-message'
						style={{ color: isCorrect ? 'green' : 'red' }}
					>
						{isCorrect ? 'Правильно выбран ответ.' : 'Ответ неверный.'}
					</div>
				)}
			</div>
		</Container>
	)
}

const Container = styled.div`
	.poll-question {
		font-weight: bold;
		margin: 5px 0px 20px 0px;
	}

	.poll-cont {
		display: flex;
		align-items: center;
		margin-top: 13px;
	}

	input {
		margin-left: auto; // Эффективно перемещает радиокнопки к правому краю
		appearance: none;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		border: 2px solid #0088cc;
		cursor: pointer;
		outline: none; // Убирает стандартное обводку при фокусе
	}

	input:checked {
		background-color: #0088cc;
	}

	label {
		margin-right: 10px;
		cursor: pointer;
	}

	.result-message {
		margin-top: 10px;
		font-size: 1rem;
		font-weight: bold;
	}
`
