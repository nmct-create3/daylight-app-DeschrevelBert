let totalTimeMs = 0;
let timeout = 60000;

function _parseMillisecondsIntoReadableTime(timestamp){
	const date = new Date(timestamp * 1000);
	const hours = '0' + date.getHours();
	const minutes = '0' + date.getMinutes();
	return hours.substr(-2) + ':' + minutes.substr(-2);
}

const updatTimeAndTimeLeft = function(sunset){
	document.querySelector('.js-sun').dataset.time = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});
	const timeLeft = (sunset - new Date().getTime() / 1000) / 60;
	arraytime = (timeLeft / 60).toString().split('.');
	arraytime[1] = (arraytime[1] - 60).toString();

	var timeleft = document.querySelector('.j-time-left').innerText = arraytime[0] + ' uur ' + arraytime[1].substring(0, 2) + ' minuten';

	if(timeleft == null){
		document.querySelector('.j-time-left').innerText = '0';
	}
	

	console.info('sunset timeleft ' + sunset);
  	console.info('current time ' + new Date().getTime());
  	console.info('sunset - current ' + sunset - new Date().getTime());

	console.log("TimeAndTimeLeft")

}

const startSunMovement = function(city){
	setInterval(() => {
		updatTimeAndTimeLeft(city.sunset);
		placeSunAndStartMoving(city.sunrise).catch((e) => console.error(e));
	}, timeout);

	console.log('StartSunMovement');
}

const placeSunAndStartMoving = function(sunrise){
	const currentTime = new Date().getTime();
	const percentageDay = (currentTime - sunrise * 1000) / totalTimeMs;

	const sunriseLeftPosition = percentageDay * 100;
	const sunriseBottomPosition = Math.sin(Math.PI * percentageDay) * 100;
	console.info('currenttime ' + currentTime);
	console.info('current - sunrise ' + currentTime - sunrise * 1000);
	console.info('totaltime ' + totalTimeMs);
	console.info('sunrise ' + sunrise);
	console.info(
	  'percentageday real time ' +
		_parseMillisecondsIntoReadableTime(percentageDay)
	);
	console.info('sunriseBottom' + sunriseBottomPosition);
	document.querySelector('.js-sun').style.left = `${sunriseLeftPosition}%`;
	document.querySelector('.js-sun').style.bottom = `${sunriseBottomPosition}%`;

	console.log('placeSunAndStartMoving');
}

const showResult = function(queryResponse){
	document.querySelector('.js-location').innerHTML = queryResponse.name + ', ' + queryResponse.country;

	document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.sunrise);

	document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.sunset)
	console.log('showResult');
}

const getData = function(endpoint){
	return fetch(endpoint).then((r) => r.json()).catch((e) => console.error(e));
	console.log('getData');
}

document.addEventListener('DOMContentLoaded', async function(){
	let lat = 50.8027741;
	let lng = 3.2097454;
	const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=5dc67a54b6468509dd1076159f7b3c38&units=metric&lang=nl&cnt=1`;
	const { city } = await getData(endpoint);
	console.log(city);
	showResult(city);

	totalTimeMs = (city.sunset - city.sunrise) * 1000;
	placeSunAndStartMoving(city.sunrise);
	updatTimeAndTimeLeft(city.sunset);
	startSunMovement(city);
})