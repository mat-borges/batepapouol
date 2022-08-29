/* Entrando com o nome de usuário (precisa fazer o loop de perguntar
 o nome até não ter nenhum usuario com o mesmo nick) */
let userName = '';
let onlineID = 0;
let messagesID = 0;
const messagesBody = document.querySelector('.messages-body');
const partipantsList = document.querySelector('.participants');

// entrando no chat (username)
function enterUser() {
	userName = document.querySelector('.name-input').value;

	const spinner = document.querySelectorAll('.spinner');
	const inputLogin = document.querySelector('.name-input');
	const enterButton = document.querySelector('.enter-button');
	spinner.forEach((spin) => spin.classList.remove('hide'));
	inputLogin.classList.add('hide');
	enterButton.classList.add('hide');

	const user = { name: `${userName}` };
	const promiseEnter = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);

	promiseEnter.then(loginAnswer);
	promiseEnter.catch(errorLogin);
}

function loginAnswer(promise) {
	const showLogin = document.querySelector('.login-page');
	const spinner = document.querySelectorAll('.spinner');
	showLogin.classList.add('hide');
	spinner.forEach((spin) => spin.classList.add('hide'));

	onlineID = setInterval(keepOnline, 5000);
	messagesID = setInterval(getMessages, 3000);
	setTimeout(updateScroll, 1000);
}

// Erro login
function errorLogin(error) {
	clearInterval(onlineID);
	clearInterval(messagesID);

	const spinner = document.querySelectorAll('.spinner');
	const inputLogin = document.querySelector('.name-input');
	const enterButton = document.querySelector('.enter-button');
	spinner.forEach((spin) => spin.classList.add('hide'));
	inputLogin.classList.remove('hide');
	enterButton.classList.remove('hide');

	const showLogin = document.querySelector('.login-page');
	showLogin.classList.remove('hide');

	alert(`Tente entrar com outro nome de usuário \n Erro ${error.response.status}: ${error.response.data}`);
}

//mantendo online
function keepOnline() {
	const user = { name: `${userName}` };
	const promiseEnter = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);

	promiseEnter.then(onlineOK);
	promiseEnter.catch(onlineNotOK);
}

function onlineOK(promise) {
	console.log(`${promise.status}: ${promise.data}`);
}

function onlineNotOK(error) {
	const spinner = document.querySelectorAll('.spinner');
	const inputLogin = document.querySelector('.name-input');
	const enterButton = document.querySelector('.enter-button');
	spinner.forEach((spin) => spin.classList.add('hide'));
	inputLogin.classList.remove('hide');
	enterButton.classList.remove('hide');

	const showLogin = document.querySelector('.login-page');
	showLogin.classList.remove('hide');

	alert(`Você foi desconectado. Erro ${error.response.status}: ${error.response.data}`);
}

// scroll overflow to bottom when entering the page
function updateScroll() {
	let element = document.querySelector('.messages-body');
	element.scrollTop = element.scrollHeight;
}

//popular quadro de mensagens
function getMessages() {
	const messages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

	messages.then(populateBody);
	messages.catch(errorMessage);
}

function populateBody(answer) {
	messagesBody.innerHTML = '';

	for (let i = 0; i < answer.data.length; i++) {
		if (answer.data[i].type === 'message') {
			if (answer.data[i].to === 'Todos') {
				messagesBody.innerHTML += `
				<li class="normal-message">
					<span>
						<span class="time-stamp">(${answer.data[i].time})</span><strong>${answer.data[i].from} </strong> para <strong>${answer.data[i].to}</strong> : ${answer.data[i].text}
					</span>
				</li>`;
				const element = document.querySelector('.normal-message');
				element.scrollIntoView();
			}
		}
		if (answer.data[i].type === 'status') {
			messagesBody.innerHTML += `
            <li class="enter-leave">
                <span>
                    <span class="time-stamp">(${answer.data[i].time})</span> <strong>${answer.data[i].from} </strong> ${answer.data[i].text}
                </span>
            </li>`;
			const element = document.querySelector('.enter-leave');
			element.scrollIntoView();
		}
		if (answer.data[i].type === 'private_message') {
			if (answer.data[i].to === 'Todos') {
				messagesBody.innerHTML += `
				<li class="reserved-message">
					<span>
						<span class="time-stamp">(${answer.data[i].time})</span><strong>${answer.data[i].from} </strong> para <strong>${answer.data[i].to}</strong> : ${answer.data[i].text}
					</span>
				</li>`;
				const element = document.querySelector('.reserved-message');
				element.scrollIntoView();
			} else if (answer.data[i].to === userName) {
				messagesBody.innerHTML += `
				<li class="reserved-message">
					<span>
						<span class="time-stamp">(${answer.data[i].time})</span><strong>${answer.data[i].from} </strong> para <strong>${answer.data[i].to}</strong> : ${answer.data[i].text}
					</span>
				</li>`;
				const element = document.querySelector('.reserved-message');
				element.scrollIntoView();
			}
		}
	}
	updateScroll();
}

// Erro populate
function errorMessage(error) {
	console.log(`Não foi possível carregar as mensagens. \n Erro ${error.response.status}: ${error.response.data}`);
}

// enviar mensagem
function sendMessage() {
	const messageValue = document.querySelector('.text-message').value;

	let message = {
		from: userName,
		to: 'Todos', //'nome do destinatário (Todos se não for um específico)',
		text: messageValue,
		type: 'message',
	};
	const textSend = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);

	textSend.then(messageSent);
	textSend.catch(errorMessageSend);
}

function messageSent(answer) {
	const messageValue = document.querySelector('.text-message');
	messageValue.value = '';

	getMessages();
}

// Erro sendMessage
function errorMessageSend(error) {
	alert(`Mensagem não enviada. Erro ${error.response.status}: ${error.response.data}`);
}

function showHideSide() {
	const sideMenu = document.querySelector('.bigger-side-menu');
	sideMenu.classList.toggle('hide');
}
