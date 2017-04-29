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



if(navigator.bluetooth) {
  var device = null
  var status_span = connect.querySelector('span')

  function _status(text) {
    return function(value) {
      status_span.textContent = text
      return value
    }
  }

  connect.style.display = 'block'

  connect.addEventListener('click', () => {

    _status('Requesting device')()

    navigator.bluetooth.requestDevice({
      filters: [{namePrefix: 'Puck'}],
      optionalServices: [0xBCDE]
    })

    .then(_status('Connecting'))
    .then(device_ => device = device_)
    .then(device => device.gatt.connect())

    .then(_status('Requesting service'))
    .then(server => server.getPrimaryService(0xBCDE))

    .then(_status('Requesting characteristic'))
    .then(service => service.getCharacteristic(0xABCD))

    .then(characteristic => {

      connect.style.display = 'none'
      disconnect.style.display = 'block'

      lights = characteristic

    })
    .catch(e => {
      if(device) device.gatt.disconnect()
      _status('Not connected. ' + e)()
      console.error(e)
    })

  })


  disconnect.addEventListener('click', () => {

    lights = null
    device.gatt.disconnect()

    connect.style.display = 'block'
    disconnect.style.display = 'none'
    status_span.textContent = ''

  })

}
