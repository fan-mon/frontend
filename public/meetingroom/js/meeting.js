function addEventWhenReady(selector, event, handler) {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element !== null) {
            element.addEventListener(event, handler);
            clearInterval(intervalId);
        }
    }, 100);
}
function addEventWhenAllReady(selectors, event, handler) {
    const intervalId = setInterval(() => {
        const elementList = document.querySelectorAll(selectors);
        if (elementList !== null && elementList.length !== 0) {
            elementList.forEach((element) => {
                element.addEventListener(event, handler);
            });
            
            clearInterval(intervalId);
        }
    }, 100);
}
window.addEventListener("load", function(e){
    // .btn-screen-toggle 클릭 시 클래스 토글
    addEventWhenAllReady('.btn-screen-toggle', "click", ()=>{
        this.classList.toggle('on');
        document.querySelector('.meeting-show-area').classList.toggle('full');
        document.querySelector('.control-box').classList.toggle('floating');
    });

    //ui 감추기 버튼 클릭시 클래스 토글
    addEventWhenReady(".btn-hidden-ui", "click", ()=>{
        this.classList.toggle("on");
        document.querySelector(".meetingroom-wrap").classList.toggle("hidden-ui");
    });

    //자신의 카메라 토글
    addEventWhenReady(".btn-control-camera", "click", (e)=>{
        e.preventDefault();
        this.classList.toggle("off");
    });

    //슬라이드 처리 상태인지 알아보는 클래스 토글(볼륨+소리) - 마우스 조작과 관련 파트
    addEventWhenAllReady(".control-slice", "mousedown", ()=>{
        this.classList.add('on');
    });

    document.body.addEventListener('mouseup', function() {
        const controlSlices = document.querySelectorAll(".control-slice");
        controlSlices.forEach(function(slice) {
            slice.classList.remove('on');
        });
    });


    //S: 소리처리
    //음소거 처리

    addEventWhenReady(".btn-volumn-toggle", "click", (e)=>{
        const parent = this.parentElement;
        const input = parent.querySelector('.form-control');
        const span = parent.querySelector('.vol');
        const slice = parent.querySelector('.control-slice');
        const gauge = slice.querySelector('.gauge');
        const video = document.getElementById("peerFaceVideo");
        
        this.classList.toggle("mute");
        
        if (this.classList.contains('mute')) {
            span.textContent = input.value;
            input.value = 0;
            gauge.style.width = '0%';
            video.volume = 0;
        } else {
            input.value = span.textContent;
            gauge.style.width = span.textContent + '%';
            video.volume = span.textContent / 100;
        }
    });

    addEventWhenReady(".control-slice-volume", "mousemove", (e)=>{
        const parent = this.parentElement;
        const vol = parent.querySelector('.form-control').value;
        let flag = this.classList.contains('on');

        if (vol != "0" && flag) {
            let x = e.offsetX;
            this.querySelector('.gauge').style.width = x + '%';
            parent.querySelector('.form-control').value = x;
            document.getElementById("peerFaceVideo").volume = x/100;
        }
    });

    //모바일 조작
    addEventWhenReady(".control-slice-volume", "touchmove", (e)=>{
        e.stopPropagation();
        let flag = this.classList.contains("mute-control");

        if(!flag){
            let offset = e.target.getBoundingClientRect();
            let x = e.touches[0].clientX - offset.x;
            x = Math.ceil(x);
            if(x < 0){x = 0}
            if(x >= 100){x = 100}
            this.querySelector(".gauge").style.width = x + "%";
            this.parentNode.querySelector(".form-control").value = x;
            document.getElementById("peerFaceVideo").volume = x/100;
        }
    });
    //E: 소리처리
    //S: 마이크 처리
    //음소거 처리
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let gainNode;
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // 50% 볼륨
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
    })
    .catch((error) => {
        console.error('Error accessing the microphone: ', error);
    });


    addEventWhenReady(".btn-mic-toggle", "click", ()=>{
        const parent = this.parentElement;
        const input = parent.querySelector('.form-control');
        const span = parent.querySelector('.vol');
        const slice = parent.querySelector('.control-slice');
        const gauge = slice.querySelector('.gauge');
        
        this.classList.toggle("mute");
        
        if (this.classList.contains('mute')) {
            span.textContent = input.value;
            input.value = 0;
            gauge.style.width = '0%';
            gainNode.gain.value = 0;
        } else {
            input.value = span.textContent;
            gauge.style.width = span.textContent + '%';
            gainNode.gain.value = span.textContent / 100;
        }
    });
    //소리 슬라이드 처리
    // 마우스 조작
    addEventWhenReady(".control-slice-mike", "mousemove", (e)=>{
        const parent = this.parentElement;
        const vol = parent.querySelector('.form-control').value;
        let flag = this.classList.contains('on');

        if (vol != "0" && flag) {
            let x = e.offsetX;
            this.querySelector('.gauge').style.width = x + '%';
            parent.querySelector('.form-control').value = x;
            gainNode.gain.value = x/100;
        }
    })

    //모바일 조작
    addEventWhenReady(".control-slice-mike", "touchmove", (e)=>{
        e.stopPropagation();
        let flag = this.classList.contains("mute-control");

        if(!flag){
            let offset = e.target.getBoundingClientRect();
            let x = e.touches[0].clientX - offset.x;
            x = Math.ceil(x);
            if(x < 0){x = 0}
            if(x >= 100){x = 100}
            this.querySelector(".gauge").style.width = x + "%";
            this.parentNode.querySelector(".form-control").value = x;
            gainNode.gain.value = x/100;
        }
    });
    //E: 마이크 처리
});