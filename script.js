/* Entrando com o nome de usuário (precisa fazer o loop de perguntar
 o nome até não ter nenhum usuario com o mesmo nick) */
let userName = '';
const messagesBody = document.querySelector('.messages-body');

function enterUser() {
	userName = prompt('Escolha seu usuário');
	const user = { name: `${userName}` };
	const promiseEnter = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);

	promiseEnter.then(testAnswer);
	promiseEnter.then(errorMessage);
}

function testAnswer(answer) {
	console.log(answer.data);
}

function errorMessage(answer) {
	console.log('Deu ruim!');
	console.log(answer.data.status);
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

getMessages();
// <ul class="messages-body">
// 	<li class="enter-leave">
// 		<span><span class="time-stamp">(Time Stamp)</span><strong>Fulano </strong> entrou na sala...</span>
// 	</li>
// 	<li class="normal-message">
// 		<span
// 			><span class="time-stamp">(Time Stamp)</span><strong>Fulano </strong> para <strong>Todos</strong>: Bom
// 			dia</span
// 		>
// 	</li>
// 	<li class="normal-message">
// 		<span>
// 			<span class="time-stamp">(Time Stamp)</span><strong>Fulana </strong> para <strong>Fulano</strong>: Oi João
// 			:)
// 		</span>
// 	</li>
// 	<li class="reserved-message">
// 		<span>
// 			<span class="time-stamp">(Time Stamp)</span><strong>Fulano </strong> reservadamente para
// 			<strong>Fulana</strong>: <span class="message">Oi gatinha quer tc?</span>
// 		</span>
// 	</li>
// 	<li class="enter-leave">
// 		<span><span class="time-stamp">(Time Stamp)</span><strong>Fulana</strong> sai da sala...</span>
// 	</li>
// </ul>
// <!-- fim messages-body -->
