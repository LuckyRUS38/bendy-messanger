import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { recieveMessageRoute, sendMessageRoute } from '../utils/APIRoutes'
import ChatInput from './ChatInput'
import Logout from './Logout'
import Poll from './Poll'

export default function ChatContainer({ currentChat, socket }) {
	const [messages, setMessages] = useState([])
	const scrollRef = useRef()
	const [arrivalMessage, setArrivalMessage] = useState(null)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		const data = await JSON.parse(
			localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
		)
		const response = await axios.post(recieveMessageRoute, {
			from: data._id,
			to: currentChat._id,
		})
		setMessages(response.data)
	}, [currentChat])

	useEffect(() => {
		const getCurrentChat = async () => {
			if (currentChat) {
				await JSON.parse(
					localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
				)._id
			}
		}
		getCurrentChat()
	}, [currentChat])

	const handleSendMsg = async msg => {
		const data = await JSON.parse(
			localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
		)
		socket.current.emit('send-msg', {
			to: currentChat._id,
			from: data._id,
			msg,
		})
		await axios.post(sendMessageRoute, {
			from: data._id,
			to: currentChat._id,
			message: msg,
		})

		const msgs = [...messages]
		msgs.push({ fromSelf: true, message: msg })
		setMessages(msgs)
	}

	useEffect(() => {
		if (socket.current) {
			socket.current.on('msg-recieve', msg => {
				setArrivalMessage({ fromSelf: false, message: msg })
			})
		}
	}, [socket])

	useEffect(() => {
		if (arrivalMessage) {
			// Проверяем, существует ли уже такое сообщение в массиве
			const messageAlreadyExists = messages.some(
				m =>
					m.message === arrivalMessage.message &&
					m.timestamp === arrivalMessage.timestamp
			)

			if (!messageAlreadyExists) {
				setMessages(prev => [...prev, arrivalMessage])
			}
		}
	}, [arrivalMessage, messages])

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const arrayRender = message => {
		if (
			typeof message.message === 'string' &&
			message.message.startsWith('@chatArray')
		) {
			const parts = message.message.split('|')
			const question = parts[1]
			const optionsParts = parts.slice(2)
			const options = [] // Для хранения обычных опций
			const correctOptions = [] // Для хранения правильных опций

			optionsParts.forEach(option => {
				if (option.startsWith('!')) {
					correctOptions.push(option.replace('!', ''))
				} else {
					options.push(option)
				}
			})

			return (
				<div>
					<Poll
						question={question}
						options={options}
						correctOptions={correctOptions}
					/>
				</div>
			)
		} else {
			return (
				<div className='message'>
					{message.message || 'Сообщение не может быть отображено'}
				</div>
			)
		}
	}

	return (
		<Container>
			<div className='chat-header'>
				<div className='user-details'>
					<div className='avatar'>
						<img
							src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
							alt=''
						/>
					</div>
					<div className='username'>
						<h3>{currentChat.username}</h3>
					</div>
				</div>
				<Logout />
			</div>
			<div className='chat-messages'>
				{messages.map(message => {
					return (
						<div key={uuidv4()}>
							<div
								ref={scrollRef}
								className={`message ${
									message.fromSelf ? 'sended' : 'recieved'
								}`}
							>
								<div className='content'>{arrayRender(message)}</div>
							</div>
						</div>
					)
				})}
			</div>
			<ChatInput handleSendMsg={handleSendMsg} />
		</Container>
	)
}

const Container = styled.div`
	display: grid;
	grid-template-rows: 10% 80% 10%;
	gap: 0.1rem;
	overflow: hidden;
	@media screen and (min-width: 720px) and (max-width: 1080px) {
		grid-template-rows: 15% 70% 15%;
	}
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 2rem;
		.user-details {
			display: flex;
			align-items: center;
			gap: 1rem;
			.avatar {
				img {
					height: 3rem;
				}
			}
			.username {
				h3 {
					color: white;
				}
			}
		}
	}
	.chat-messages {
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: auto;
		&::-webkit-scrollbar {
			width: 0.2rem;
			&-thumb {
				background-color: #ffffff39;
				width: 0.1rem;
				border-radius: 1rem;
			}
		}
		.message {
			display: flex;
			align-items: center;
			.content {
				max-width: 40%;
				overflow-wrap: break-word;
				padding: 1rem;
				font-size: 1.1rem;
				border-radius: 1rem;
				color: #d1d1d1;
				@media screen and (min-width: 720px) and (max-width: 1080px) {
					max-width: 70%;
				}
			}
		}
		.sended {
			justify-content: flex-end;
			.content {
				background-color: #4f04ff21;
			}
		}
		.recieved {
			justify-content: flex-start;
			.content {
				background-color: #9900ff20;
			}
		}
	}
`
