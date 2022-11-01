const chatForm = document.getElementById('chat');
const someMessage = document.getElementById('message');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//Get username and room from URL
const {username, emoji} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, emoji});


//Message from server
socket.on('message', message => {
    
        outputMessage(message);    

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //Emit message to server
    const messageValue = someMessage.value;
    socket.emit('chatMessage', messageValue);

    //Clear input
    document.getElementById('message').value = '';
    document.getElementById('message').focus();
});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('messages');
    div.innerHTML = `<p class="meta">${message.username}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}