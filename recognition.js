const video = document.getElementById('streamVideo')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const htmlCanvas = faceapi.createCanvasFromMedia(video)
  const displaySize = { width: video.width, height: video.height }
  document.body.append(htmlCanvas)
  faceapi.matchDimensions(htmlCanvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, htmlCanvas.width, htmlCanvas.height)
    faceapi.draw.drawDetections(htmlCanvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(htmlCanvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(htmlCanvas, resizedDetections)
  }, 50)
})