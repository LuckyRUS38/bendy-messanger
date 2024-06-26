import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'
export default function Welcome() {
	const [userName, setUserName] = useState('')
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		setUserName(
			await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			).username
		)
	}, [])
	return (
		<Container>
			<img src={Robot} alt='' />
			<h1>
				Добро пожаловать, <span>{userName}!</span>
			</h1>
			<h3>Пожалуйста выберите человека, с которым хотите начать переписку.</h3>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	flex-direction: column;
	img {
		height: 20rem;
	}
	span {
		color: #4e0eff;
	}
`
