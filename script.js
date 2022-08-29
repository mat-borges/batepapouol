/* Entrando com o nome de usuário (precisa fazer o loop de perguntar
 o nome até não ter nenhum usuario com o mesmo nick) */
const urlAPI = 'https://mock-api.driven.com.br/api/v6/uol';
let userName = '';
let onlineID = 0;
let messagesID = 0;
const messagesBody = document.querySelector('.messages-body');
const participantsList = document.querySelector('.participants');
const spinner = document.querySelectorAll('.spinner');
const inputLogin = document.querySelector('.name-input');
const enterButton = document.querySelector('.enter-button');
const showLogin = document.querySelector('.login-page');

// entrando no chat (username)
function enterUser() {
	userName = document.querySelector('.name-input').value;

	spinner.forEach((spin) => spin.classList.remove('hide'));
	inputLogin.classList.add('hide');
	enterButton.classList.add('hide');

	const user = { name: `${userName}` };
	const promiseEnter = axios.post(`${urlAPI}/participants`, user);

	promiseEnter.then(loginAnswer);
	promiseEnter.catch(errorLogin);
}

function loginAnswer(promise) {
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

	spinner.forEach((spin) => spin.classList.add('hide'));
	inputLogin.classList.remove('hide');
	enterButton.classList.remove('hide');

	showLogin.classList.remove('hide');

	alert(`Tente entrar com outro nome de usuário \n Erro ${error.response.status}: ${error.response.data}`);
}

//mantendo online
function keepOnline() {
	const user = { name: `${userName}` };
	const promiseEnter = axios.post(`${urlAPI}/status`, user);

	promiseEnter.then(onlineOK);
	promiseEnter.catch(onlineNotOK);
}

function onlineOK(promise) {
	console.log(`${promise.status}: ${promise.data}`);
}

function onlineNotOK(error) {
	spinner.forEach((spin) => spin.classList.add('hide'));
	inputLogin.classList.remove('hide');
	enterButton.classList.remove('hide');
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
	const messages = axios.get(`${urlAPI}/messages`);

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
	const textSend = axios.post(`${urlAPI}/messages`, message);

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

function fillParticipants() {
	const activeUsers = axios.get(`${urlAPI}/participants`);

	activeUsers.then(answerUsers);
	activeUsers.catch(errorUsers);
}

function answerUsers(answer) {
	console.log(answer);
	participantsList.innerHTML = `
	<li>
		<ion-icon name="people-circle"></ion-icon>
		<span>Todos</span>
		<ion-icon name="checkmark-sharp" class="green hide"></ion-icon>
	</li>
	`;
	for (let i = 0; i < answer.data.length; i++) {
		participantsList.innerHTML += `
		<li>
			<ion-icon name="person-circle-outline"></ion-icon>
			<span>${answer.data[i].name}</span>
			<ion-icon name="checkmark-sharp" class="green hide"></ion-icon>
		</li>
		`;
	}
}

function errorUsers(error) {
	alert(`Não foi possível atualizar os usuários. \n Erro ${error.response.status}: ${error.response.data}`);
}

function showHideSide() {
	const sideMenu = document.querySelector('.bigger-side-menu');
	sideMenu.classList.toggle('hide');
}
