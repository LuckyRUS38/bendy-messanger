import Picker from 'emoji-picker-react'
import React, { useState } from 'react'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { IoMdSend } from 'react-icons/io'
import styled from 'styled-components'

export default function ChatInput({ handleSendMsg }) {
	const [msg, setMsg] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState([])
	const [correctAnswers, setCorrectAnswers] = useState([])

	const handleEmojiPickerhideShow = () => {
		setShowEmojiPicker(!showEmojiPicker)
	}

	const handleEmojiClick = (event, emojiObject) => {
		let message = msg
		message += emojiObject.emoji
		setMsg(message)
	}

	const sendChat = event => {
		event.preventDefault()
		if (msg.length > 0) {
			handleSendMsg(msg)
			setMsg('')
		}
	}

	const handleAddQuestion = (question, answer, isCorrect) => {
		setQuestions([...questions, question])
		setAnswers([...answers, answer])
		setCorrectAnswers([...correctAnswers, isCorrect])
	}

	return (
		<Container>
			<div className='button-container'>
				<div className='emoji'>
					<BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
					{showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
				</div>
			</div>
			{/* <div className="button-container">
        <div className="document">
          <Button onClick={() => handleAddQuestion("Вопрос", "Ответ", true)}>
              Добавить тест
            </Button>
            <Button>Проверить ответы</Button>
        </div>
      </div> */}
			<form
				className='input-container selectable'
				onSubmit={event => sendChat(event)}
			>
				<input
					type='text'
					placeholder='Написать'
					onChange={e => setMsg(e.target.value)}
					value={msg}
				/>
				<button type='submit'>
					<IoMdSend />
				</button>
			</form>
		</Container>
	)
}

const Button = styled.button`
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	background-color: #9a86f3;
	color: white;
	border: none;
	cursor: pointer;
	margin-right: 1rem;

	&:hover {
		background-color: #7b63b1;
	}
`

const Container = styled.div`
	display: grid;
	align-items: center;
	grid-template-columns: 5% 95%;
	background-color: #080420;
	padding: 0 2rem;
	@media screen and (min-width: 720px) and (max-width: 1080px) {
		padding: 0 1rem;
		gap: 1rem;
	}
	.button-container {
		display: flex;
		align-items: center;
		color: white;
		gap: 1rem;
		.emoji {
			position: relative;
			svg {
				font-size: 1.5rem;
				color: #ffff00c8;
				cursor: pointer;
			}
			.emoji-picker-react {
				position: absolute;
				top: -350px;
				background-color: #080420;
				box-shadow: 0 5px 10px #9a86f3;
				border-color: #9a86f3;
				.emoji-scroll-wrapper::-webkit-scrollbar {
					background-color: #080420;
					width: 5px;
					&-thumb {
						background-color: #9a86f3;
					}
				}
				.emoji-categories {
					button {
						filter: contrast(0);
					}
				}
				.emoji-search {
					background-color: transparent;
					border-color: #9a86f3;
				}
				.emoji-group:before {
					background-color: #080420;
				}
			}
		}
	}
	.input-container {
		width: 100%;
		border-radius: 2rem;
		display: flex;
		align-items: center;
		gap: 2rem;
		background-color: #ffffff34;
		input {
			width: 90%;
			height: 60%;
			background-color: transparent;
			color: white;
			border: none;
			padding-left: 1rem;
			font-size: 1.2rem;

			&::selection {
				background-color: #9a86f3;
			}
			&:focus {
				outline: none;
			}
		}
		button {
			padding: 0.3rem 2rem;
			border-radius: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #9a86f3;
			border: none;
			@media screen and (min-width: 720px) and (max-width: 1080px) {
				padding: 0.3rem 1rem;
				svg {
					font-size: 1rem;
				}
			}
			svg {
				font-size: 2rem;
				color: white;
			}
		}
	}
`
