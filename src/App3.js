import React, { Component } from 'react';
import io from 'socket.io-client';
import NavBar from "./components/NavBar";

class App3 extends Component {
    constructor(props) {
        super(props)

        this.localVideoref = React.createRef()
        this.remoteVideoref = React.createRef()
    }

    componentDidMount() {

        this.socket = io(
            '/youtube_reactPeer',
            {
                path: '/youtube_react',
                query: {}
            }
        )

        const pc_config = null

        //  const pc_config = {
        //    "iceServers": [
        //      {
        //        urls: 'stun:[STUN-IP]:[PORT]',
        //      'credential': '[YOUR CREDENTIAL]',
        //    'username': '[USERNAME]'
        //    }
        //    ]
        //    }

        this.pc = new RTCPeerConnection(pc_config)

        this.pc.onicecandidate = (e) => {
            if (e.candidate) console.log(JSON.stringify(e.candidate))
        }

        this.pc.oniceconnectionstatechange = (e) => {
            console.log(e)
        }

        this.pc.onaddstream = (e) => {
            this.remoteVideoref.current.srcObject = e.stream
        }

        const constraints = { video: true }

        const success = (stream) => {
            window.localStream = stream
            this.localVideoref.current.srcObject = stream
            this.pc.addStream(stream)
        }

        const failure = (e) => {
            console.log('getUserMedia Error: ', e)
        }

        //navigator.getUserMedia(constraints, success, failure)
        navigator.mediaDevices.getUserMedia(constraints)
            .then(success)
            .catch(failure)
    }

    createOffer = () => {
        console.log('Offer')
        this.pc.createOffer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                console.log(JSON.stringify(sdp))
                this.pc.setLocalDescription(sdp)
            }, e => { })
    }

    setRemoteDescription = () => {
        const desc = JSON.parse(this.textref.value)

        this.pc.setRemoteDescription(new RTCSessionDescription(desc))
    }

    createAnswer = () => {
        console.log('Answer')
        this.pc.createAnswer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                console.log(JSON.stringify(sdp))
                this.pc.setLocalDescription(sdp)
            }, e => { })
    }

    addCandidate = () => {
        const candidate = JSON.parse(this.textref.value)
        console.log('Adding candidate:', candidate)

        this.pc.addIceCandidate(new RTCIceCandidate(candidate))
    }

    render() {

        //(async () => {
        //  const stream = await navigator.mediaDevices.getUserMedia(constraints)
        //  success(stream)
        // })().catch(failure)
        return (
            <div>
                <NavBar />
                <video
                    style={{
                        width: 240, height: 240,
                        margin: 5, backgroundColor: 'black'
                    }}
                    ref={this.localVideoref}
                    autoPlay></video>

                <video
                    style={{
                        width: 240, height: 240,
                        margin: 5, backgroundColor: 'black'
                    }}
                    ref={this.remoteVideoref}
                    autoPlay></video>

                <button onClick={this.createOffer}>Offer</button>
                <button onClick={this.createAnswer}>Answer</button>
                <br />
                <textarea ref={ref => { this.textref = ref }} />
                <br />
                <button onClick={this.setRemoteDescription}>Set Remote Desc</button>
                <button onClick={this.addCandidate}>Add addCandidate</button>
            </div>
        );
    }
}

export default App3