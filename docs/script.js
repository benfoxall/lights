for (var i = 0; i < 20; i++) {
  var led = document.createElement('li')
  led.style.marginTop = Math.random() + 'em'
  led.style.transitionDelay = (i/50) + 's'
  leds.appendChild(led)
}

document.body.addEventListener('click', function(e){
  if(e.target.nodeName == 'A') {
    var color = window.getComputedStyle(e.target).color
    leds.style.setProperty('--led-color', color)
  }
}, false)

navigator.serviceWorker.register('service-worker.js')
