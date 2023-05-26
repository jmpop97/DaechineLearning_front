async function music_search() {
    const query = document.querySelector("#query").value
    let limit = document.querySelector("#limit").value
    if (query === '') {
        alert("검색어를 입력해주세요.")
        return
    }

    if (!limit || limit === '') {
        limit = 10
    } else if (isNaN(parseInt(limit))) {
        alert("검색 개수는 숫자를 입력해주세요.")
        return
    }

    const formdata = new FormData()

    formdata.append('query', query)
    formdata.append('limit', limit)

    const response = await fetch(`http://127.0.0.1:8000/articles/music/api/search`, {
        method: "POST",
        body: formdata
    })
    const data = await response.json()
    // console.log(data)


    let resultEl = document.querySelector('#result')
    let h2_add = document.querySelector('#add_h2')
    tracks = data['tracks']
    tracks = await Promise.all(tracks.map(async track => {
        const previewUrl = await preview_music(track);
        return {
            ...track,
            preview_url: previewUrl
        }
    }))
    let trackHtml = ``
    for (let i = 0; i < tracks.length; i++) {
        track = tracks[i]
        let images = track['album']['images']
        let imageUrl = ''
        if (images && images.length > 0) {
            imageUrl = images[0]['url']
        }
        trackHtml += `
        <div class="track-container">
            <div class="col">
                <div class="card h-100">
                    <img src="${imageUrl}" height="300" width="300" class="card-img-top">
                <div class="card-body">
                    <h2 class="card-title">${i + 1}. ${track.name}</h2>
                    <p class="card-text">Artist: ${track.artist} / Album: ${track.album.name}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <small class="text-body-secondary fs-5">발매일 : ${track.album.release_date}</small>
                    <button onclick="save_db(tracks[${i}])" type="button" class="btn btn-primary">저장</button>
                </div>
                    <div class="audio">
                        <audio style="width:100%;" controls="" name="media" class="mt-4 mb-4 ps-3 pe-3">
                        <source src="${track.preview_url}" type="audio/mpeg">
                        </audio>
                    </div>
                </div>
            </div>
        </div>`
    }

    h2_add.innerHTML = `<h2>Tracks (${tracks.length})</h2>`
    resultEl.innerHTML = trackHtml
}
// 미리듣기url 가져오는 함수
async function preview_music(track) {
    let response = await fetch('http://127.0.0.1:8000/articles/music/api/music-id-search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            music_id: track.id
        })
    });
    let data = await response.json();
    return data.preview_url;
}

async function save_db(track) {
    console.log("===3===")
    console.log(track)
    console.log("===4===")
    const formdata = new FormData()
    formdata.append('name', track.name)
    formdata.append('artist', track.artist)
    formdata.append('album', track.album.name)
    formdata.append('music_id', track.album.id)

    const response = await fetch(`http://127.0.0.1:8000/articles/save_music`, {
        method: "POST",
        body: formdata
    })

    const data = await response.json()
    console.log(data)
    alert(data["message"])
}

//녹음
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
recordStatus = true
var gumStream;              //stream from getUserMedia()
var rec;                    //Recorder.js object
var input;                  //MediaStreamAudioSourceNode we'll be recording
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //new audio context to help us record
//add events to those 2 buttons

async function record() {
    if (recordStatus) {
        recordStatus = false
        startRecording()
    } else {
        recordStatus = true
        stopRecording()
    }
}
function startRecording() {
    console.log("recordButton clicked");

    // Disable the record button until we get a success or fail from getUserMedia()
    recordButton.disabled = false;

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        audioContext = new AudioContext({ sampleRate: 16000 });

        // assign to gumStream for later use
        gumStream = stream;

        // use the stream
        input = audioContext.createMediaStreamSource(stream);

        // Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size
        rec = new Recorder(input, { numChannels: 1 })

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function (err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
    });
}

function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    recordButton.disabled = false;

    //tell the recorder to stop the recording
    rec.stop(); //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

async function createDownloadLink(blob) {
    //blob
    let token = localStorage.getItem("access")
    const formdata = new FormData();
    formdata.append("blob", blob)
    const response = await fetch(`http://127.0.0.1:8000/sound/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formdata
    })
    const data = await response.json()

    //음성인식값 넣기
    document.getElementById("query").value = data["message"]
}

