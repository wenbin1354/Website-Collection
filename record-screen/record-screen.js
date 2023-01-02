const recorderDiv = document.querySelector("#recorder");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const closeButton = document.querySelector("#close");
const video = document.querySelector("#player video");

let recorder, stream;

// start recording
async function startRecording() {
	stream = await navigator.mediaDevices.getDisplayMedia({
		video: {
			mediaSource: "video",
			// for resolution
			width: 3840,
			height: 2160,
		},
		// allow record current tab
		preferCurrentTab: true,
	});

	recorder = new MediaRecorder(stream);

	// where we store the video data (local)
	const chunks = [];

	recorder.ondataavailable = (e) => {
		chunks.push(e.data);
	};
	recorder.onstart = () => {
		recorderDiv.classList.toggle("recording", true);
		recorderDiv.classList.toggle("replaying", false);
	};
	recorder.onstop = () => {
		const completeBlob = new Blob(chunks, {
			type: chunks[0].type,
		});
		video.src = URL.createObjectURL(completeBlob);
		recorderDiv.classList.toggle("recording", false);
		recorderDiv.classList.toggle("replaying", true);
	};
	recorder.start();
}

function stopRecording() {
	recorder.stop();
	stream.getVideoTracks()[0].stop();
}

function closePlayer() {
	recorderDiv.classList.toggle("recording", false);
	recorderDiv.classList.toggle("replaying", false);
}

// events handler
startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
closeButton.addEventListener("click", closePlayer);
