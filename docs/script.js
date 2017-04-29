var lights = null

function parseRGB(str) {
  return [].slice.call(str.match(/rgb\((\d+), (\d+), (\d+)/), 1).map(Number)
}

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

    if(lights) {
      var buffer = Uint8ClampedArray.from(parseRGB(color)).buffer
      lights.writeValue(buffer)
    }
  }
}, false)

if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('service-worker.js')

var gatt_server = null


if(navigator.bluetooth) {
  connect.style.display = 'block'

  var connect_status = connect.querySelector('span')



  connect.addEventListener('click', () => {

    connect_status.textContent = 'Requesting device'

    navigator.bluetooth.requestDevice({
      filters: [{namePrefix: 'Puck'}],
      optionalServices: [0xBCDE]
    })
    .then(device => {
      connect_status.textContent = 'Connecting'

      gatt_server = device.gatt;
      return device.gatt.connect()
    })
    .then(server => {
      connect_status.textContent = 'Requesting service'
      return server.getPrimaryService(0xBCDE)
    })
    .then(service => {
      connect_status.textContent = 'Requesting characteristic'
      return service.getCharacteristic(0xABCD)
    })
    .then(characteristic => {
      window.characteristic = characteristic

      connect.style.display = 'none'
      disconnect.style.display = 'block'

      lights = characteristic

      // switch to black
      var buf = Uint8ClampedArray.from([0,0,0]).buffer
      return characteristic.writeValue(buf)


    })
    .catch(e => {
      if(gatt_server) gatt_server.disconnect()
      console.error(e)
      connect_status.textContent = 'Error: ' + e
    })
    .then(c => console.log(c))


  })


  disconnect.addEventListener('click', () => {
    gatt_server.disconnect()

    lights = null

    connect.style.display = 'block'
    disconnect.style.display = 'none'
    connect_status.textContent = ''

  })



}
