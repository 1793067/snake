
function game(){
		let freeCellLib = {};
		let count = 0;

//выбор элемента с типом "кнопка" и назначение ему управлением функцией "reset"
		let button = document.querySelector('button[onclick="game()"]');
		button.setAttribute("onclick", "reset()");
		button.innerHTML = "reset";
	
//присваиваем переменной "х" значение из поля с идентификатором "size"
		let x = document.getElementById("size").value;
        let y = x;
        
//создаем div, в котором будет размещаться игровое поле
		let divWrap = document.createElement('div');
        divWrap.className = "backgrnd";
		divWrap.style.width = 80 + 'vh';
		divWrap.style.height = 80 + 'vh';
		divWrap.setAttribute("size", x);
        document.body.appendChild(divWrap);

//создаем игровое поле
        for (let j = 1; j <= y; j++) {
            for (let i = 1; i <= x; i++) {
				let cell = [i, j];
			  freeCellLib[cell] = true;
              var div = document.createElement('div');
              div.className = "elements";
              div.style.width = 100/x +'%';
              div.style.height = 100/y +'%';
              div.setAttribute("x", i);
              div.setAttribute("y", j);
              divWrap.appendChild(div);
          }
        }
		
//создаем поле счетчика		
		var score = document.createElement('input');
		score.className = 'counter';
		score.style.width = 80 + 'vh';
		score.style.height = 10 + 'vh';
		score.value = "current score: " + count;
        document.body.appendChild(score);
		
		

//создаем змейку		
		const [startX, startY] = newRandomXY(x, freeCellLib);		
		let snakeBody = document.querySelectorAll( 'div[x="'+startX+'"][y="'+startY+'"]');
		snakeBody = Array.prototype.slice.call(snakeBody) //Convert to array
		snakeBody[0].classList.add("activeCell", "head");
		
//чтобы нельзя было сделать несколько движений за ход
		let step = false; // quick button repairer
		
		let direction = ["left", "right", "up", "down"][Math.floor(Math.random()*4)];
		getMouse(x, freeCellLib);
		
		/*------------------------------------------------------------------------------------*/

		
	function move(){

//для упрощения восприятия вместо символьного кода кнопок "вниз", "вверх" и т.д. в коде будет использоваться объект "keyCodeLib"
//в обработчике событий при нажатии стрелок управления змейкой код кнопок будет выбираться из библиотеки "keyCodeLib" 
		const keyCodeLib = {
			arrowDown: 40,
			arrowUp: 38,
			arrowLeft: 37,
			arrowRight: 39
		};	
		
		const [startX, startY] = [+snakeBody[0].getAttribute("x"), +snakeBody[0].getAttribute("y")]; 
		
		snakeBody[0].classList.remove("head");
		snakeBody[snakeBody.length-1].classList.remove("activeCell");
		snakeBody.pop();
		
		let newHead;
		
		if (direction == "right")
		newHead = (startX == x) ? document.querySelector('div[x="'+1+'"][y="'+(startY)+'"]')
									   : document.querySelector('div[x="'+(startX+1)+'"][y="'+(startY)+'"]');
		
		if (direction == "left")
		newHead = (startX == 1) ? document.querySelector('div[x="'+x+'"][y="'+(startY)+'"]')
									   : document.querySelector('div[x="'+(startX-1)+'"][y="'+(startY)+'"]');
		
		if (direction == "up")
		newHead = (startY == 1) ? document.querySelector('div[x="'+startX+'"][y="'+y+'"]')
									   : document.querySelector('div[x="'+startX+'"][y="'+(startY-1)+'"]');
		
		if (direction == "down")
		newHead = (startY == y) ? document.querySelector('div[x="'+startX+'"][y="'+1+'"]')
									   : document.querySelector('div[x="'+startX+'"][y="'+(startY+1)+'"]');
		
		
		newHead.classList.add("head");
		snakeBody.unshift(newHead);
		
		addEventListener("keydown", function(event) {
			if (step) {
				if (event.keyCode == keyCodeLib.arrowDown && direction != "up") direction = "down";								
				if (event.keyCode == keyCodeLib.arrowUp && direction != "down") direction = "up";
				if (event.keyCode == keyCodeLib.arrowLeft && direction != "right") direction = "left";		
				if (event.keyCode == keyCodeLib.arrowRight && direction != "left") direction = "right";	
				if (event.keyCode == keyCodeLib.esc) console.log(newRandomXY(x, freeCellLib));						
				step = false;
			};
		});
		
		
		if (snakeBody[0].classList.contains("mouse")) {
			snakeBody.push(snakeBody[0]);
			deleteMouse(x, freeCellLib);
			getWall(x, freeCellLib);
			getMouse(x, freeCellLib);
			count += 100;
			score.value = "current score: " + count;
		}
		
		if (newHead.classList.contains("activeCell") || newHead.classList.contains("wall")) {
			alert("Your score: "+ count+ " points!");
			clearInterval(interval);
		}
		
		snakeBody.forEach(item => item.classList.add("activeCell"));
			
		step = true;	
	}

		
	
	  
	  let interval = setInterval(move, 200);
   }
 
function reset() {
//выбор элемента с типом "кнопка" и назначение ему управлением функцией "game"
	let button = document.querySelector('button[onclick="reset()"]');
	button.setAttribute("onclick", "game()");
// Перезагрузка текущую страницу
	document.location.reload();
}  


function newRandomXY(x, freeCellLib) {
//создание новых элементов на карте
	const min = 1;
	const max = x;
	if (Object.keys(freeCellLib).length == 0) alert("Победа!");
	let rand = [Math.floor(1 + Math.random() * (max + 1 - min)), Math.floor(1 + Math.random() * (max + 1 - min))];
	while (!freeCellLib.hasOwnProperty(rand)) {
		rand = [Math.floor(1 + Math.random() * (max + 1 - min)), Math.floor(1 + Math.random() * (max + 1 - min))];
};
//удаляем элемент из базы пустых ячеек
	delete freeCellLib[rand];
	return rand;
		}      
	  
  
function getMouse(x, freeCellLib) {
//создание новой мыши		
	const [mouseX, mouseY] = newRandomXY(x, freeCellLib);
	let mouse = document.querySelector('div[x="'+mouseX+'"][y="'+mouseY+'"]');
		mouse.classList.add("mouse");
}

	
function deleteMouse(x, freeCellLib) {
//удаление "съеденной" мыши	
	document.querySelector(".mouse").classList.remove("mouse");
}

					
function getWall(x, freeCellLib) {
//создание новой стены	
	const [wallX, wallY] = newRandomXY(x, freeCellLib);
	let wall = document.querySelector('div[x="'+wallX+'"][y="'+wallY+'"]');
	wall.classList.add("wall");
};
	  
	  
	  