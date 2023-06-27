import './style.css';

const helloWorld = document.createElement('p');
helloWorld.innerText = "Hello World!";
helloWorld.style.color = 'red';

document.body.appendChild(helloWorld);