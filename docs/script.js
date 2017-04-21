var lights = null
var rgbRE = /rgb\((\d+), (\d+), (\d+)/


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

    //todo: better
    if(lights) {
      var parts = color.match(rgbRE);
      console.log(parts)
      var buf = Uint8ClampedArray.from([
        parseInt(parts[1],10),
        parseInt(parts[2],10),
        parseInt(parts[3],10)
      ]).buffer

      lights.writeValue(buf)

    }


  }
}, false)

navigator.serviceWorker.register('service-worker.js')



if(navigator.bluetooth) {
  connect.style.display = 'block';

  connect.addEventListener('click', () => {

    navigator.bluetooth.requestDevice({
      filters: [{namePrefix: 'Puck'}],
      optionalServices: [0xBCDE]
    })
    .then(device => device.gatt.connect())
    .then(server => {
      return server.getPrimaryService(0xBCDE);
    })
    .then(service => {
      return service.getCharacteristic(0xABCD);
    })
    .then(characteristic => {
      window.characteristic = characteristic

      connect.style.display = 'none'

      lights = characteristic

      var buf = Uint8ClampedArray.from([20]).buffer

      return characteristic.writeValue(buf)


    })
    .then(c => console.log(c))


  })

}
