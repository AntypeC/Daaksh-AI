API_KEY = "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";

const seriousBtn = document.getElementById('serious-btn');
const casualBtn = document.getElementById('casual-btn');
let isCasual = true;

var i = 0;
var speed = 20;

function selectCasual() {
	isCasual = true
	casualBtn.classList.add("selected");
	seriousBtn.classList.remove("selected");
	document.body.classList.remove("serious-background");
	document.body.classList.add("casual-background");
}

selectCasual()

casualBtn.addEventListener('click', () => {
	selectCasual()
});

seriousBtn.addEventListener('click', () => {
	isCasual = false
	seriousBtn.classList.add("selected");
	casualBtn.classList.remove("selected");
	document.body.classList.remove("casual-background");
	document.body.classList.add("serious-background");
});

const xhr = new XMLHttpRequest();

async function query(data) {
	let result = null;
	
	if (isCasual) {
		const response = await fetch(
			"https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
			{
			headers: { Authorization: "Bearer " + API_KEY },
			method: "POST",
			body: JSON.stringify(data),
			}
		);
	  	result = await response.json();
		result = result.generated_text;
		nameList = ["Sarah", "Joseph"]
		for (let i = 0; i < nameList.length; i++) {
			if (result.includes(nameList[i])) {
				result = result.replace(nameList[i], "Daaksh")
			}
		}
	} else {
		url = "https://api.betterapi.net/youdotcom/chat?message=" + JSON.parse(JSON.stringify(data)).inputs.replace(" ", "%20") + "&key=" + "GMLUGVL5ODC5JFU5T8YOC4L5S6TG5T08YXA"
		console.log(url)
		try {
			const response = await fetch(url);
			if (!response.ok) {
				result = "Oh no, something went wrong on my end and I couldn't complete the task you requested."
			} else {
				const json = await response.json();
				result = json.message;
				if (result.includes("Due to high demand, I'm experiencing issues briefly.")) {
					result = result.replace("😔 ", "").replace("use the All tab", "switch to the Casual mode").replace("an answer", "a response")
				} else if (result.includes("YouBot")) {
					result = result.replace("YouBot", "Daaksh")
				}
			}
		} catch (error) {
			console.error('Error occurred: ' + error.message);
			result = "Oh no, something went wrong on my end and I couldn't complete the task you requested."
		}
	}
	return result;
	console.log(result)
}

function tts(data) {
	if ('speechSynthesis' in window) {
		var utterance = new SpeechSynthesisUtterance(data)
		speechSynthesis.speak(utterance)
	} else{

	}
}

var conversation_starter = ["Howdy, it's Daaksh! What brings you to chat with me?", "Hey, it's Daaksh. How's your day going so far?", "Hi, I'm Daaksh. What's on your mind today?", "How's it going? Daaksh here, ready to chat about anything you'd like.", "What's cracking? Daaksh here, happy to chat with you about anything.", "Sup! This is Daaksh. Anything interesting on your mind today?"]

document.querySelector(".output-container").append("Daaksh: ")
num = Math.floor(Math.random()*6)
r = conversation_starter[num]

const portrait = document.querySelector('.gradient-border');

function replaceimg(filename) {
	const elem = document.createElement('img');
	elem.classList.add('border-radius')
	elem.setAttribute('src', './resources/'+filename);
	if (portrait.querySelector('img')) {
		img = document.querySelector('img')
		portrait.removeChild(img)
	}
	portrait.prepend(elem)
}

t = 5000
if (num+1 == 4){
	t = 4000
} else if (num+1 == 6) {
	t = 6000
}

file = 'intro'+(num+1)+'.gif'

replaceimg(file)

setTimeout(
	function() {
		replaceimg("image.jpeg")
	}, t
)

typeWriter(".output-container", r)
tts(r)

function main(){
	var input = document.getElementById("query").value;
	input = input.replace("\n", "")
	document.getElementById("query").value = "";
	document.querySelector(".output-container").append("\nUser: "+input);
	document.querySelector(".output-container").scrollTop = textarea.scrollHeight;
	query({"inputs": input}).then((response) => {
		console.log(response)
		document.querySelector(".output-container").append("\nDaaksh: ")
		replaceimg("speak.gif")
		typeWriter(".output-container", response)
		tts(response)
	});
}

var button = document.getElementById("send");

document.addEventListener("keypress", function (event) {
	if (!event.shiftKey && event.key === "Enter")
	main()
})
button.addEventListener("click", function(){
	main()
})

function typeWriter(elem, txt) {
	if (i < txt.length) {
		textarea = document.querySelector(elem)
		textarea.scrollTop = textarea.scrollHeight;
		textarea.innerHTML += txt.charAt(i);
		i++;
		setTimeout(() => {
			typeWriter(elem, txt)
		}, speed);
	} else {
		i = 0;
		if (!conversation_starter.includes(txt)) {
			replaceimg("image.jpeg")
		}
	}
}

const ws = new WebSocket("ws://localhost:25566");
ws.addEventListener("open", () => {
  // Send a message to the server when the connection is established
  ws.send("Hello, server!");
});

ws.addEventListener('message', (data) => {
  console.log(data.data);

  // Send a message back to the server
  ws.send("Thanks for the message, server!");
});
