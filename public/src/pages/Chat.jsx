import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import styled from 'styled-components'
import ChatContainer from '../components/ChatContainer'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import { allUsersRoute, host } from '../utils/APIRoutes'

export default function Chat() {
	const navigate = useNavigate()
	const socket = useRef()
	const [contacts, setContacts] = useState([])
	const [currentChat, setCurrentChat] = useState(undefined)
	const [currentUser, setCurrentUser] = useState(undefined)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
			navigate('/login')
		} else {
			setCurrentUser(
				await JSON.parse(
					localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
				)
			)
		}
	}, [navigate])
	useEffect(() => {
		if (currentUser) {
			socket.current = io(host)
			socket.current.emit('add-user', currentUser._id)
		}
	}, [currentUser])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		if (currentUser) {
			if (currentUser.isAvatarImageSet) {
				const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
				setContacts(data.data)
			} else {
				navigate('/setAvatar')
			}
		}
	}, [currentUser, navigate])
	const handleChatChange = chat => {
		setCurrentChat(chat)
	}
	return (
		<>
			<Container>
				<div className='container'>
					<Contacts contacts={contacts} changeChat={handleChatChange} />
					{currentChat === undefined ? (
						<Welcome />
					) : (
						<ChatContainer currentChat={currentChat} socket={socket} />
					)}
				</div>
			</Container>
		</>
	)
}

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	align-items: center;
	background-color: #131324;
	.container {
		height: 85vh;
		width: 85vw;
		border-radius: 25px;
		background-color: #00000076;
		display: grid;
		grid-template-columns: 25% 75%;
		@media screen and (min-width: 720px) and (max-width: 1080px) {
			grid-template-columns: 35% 65%;
		}
	}
`
