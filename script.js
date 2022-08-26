/* Entrando com o nome de usuário (precisa fazer o loop de perguntar
 o nome até não ter nenhum usuario com o mesmo nick) */
let userName = '';
const messagesBody = document.querySelector('.messages-body');

function enterUser() {
	userName = prompt('Escolha seu usuário');
	const user = { name: `${userName}` };
	const promiseEnter = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);

	promiseEnter.then(testAnswer);
	promiseEnter.then(errorMessageUser);
}

// scroll overflow to bottom when entering the page
function updateScroll() {
	let element = document.querySelector('.messages-body');
	element.scrollTop = element.scrollHeight;
}

function testAnswer(answer) {
	console.log(answer.data);
	getMessages();
	setTimeout(updateScroll, 1000);
}

// compilar todas as mensagens de erro!!!!!!!!!!!!!!!!!!!!!!!!!
function errorMessageUser(errro) {
	if (errro.data.status >= 0) {
		console.log('Deu ruim! enterUser');
		console.log(errro.data.status);
	}
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
			}
		}
		if (answer.data[i].type === 'status') {
			messagesBody.innerHTML += `
            <li class="enter-leave">
                <span>
                    <span class="time-stamp">(${answer.data[i].time})</span> <strong>${answer.data[i].from} </strong> ${answer.data[i].text}
                </span>
            </li>`;
		}
	}

	console.log(answer);
}

// compilar todas as mensagens de erro!!!!!!!!!!!!!!!!!!!!!!!!!
function errorMessage(error) {
	console.log('Deu ruim! getMessages');
	console.log(error.data);
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
	textSend.catch();
}

function messageSent(answer) {
	const messageValue = document.querySelector('.text-message');
	messageValue.value = '';

	getMessages();
	console.log('Mensagem enviada com sucesso');
	console.log(answer);
}

// compilar todas as mensagens de erro!!!!!!!!!!!!!!!!!!!!!!!!!
function errorMessageSend(error) {
	console.log('Deu ruim! getMessages');
	console.log(error.data);
}

function showSide() {
	console.log('oi');
}

// const intervalID = setInterval(getMessages, 3000);
enterUser();
