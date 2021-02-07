import React, { Component } from 'react';
import io from 'socket.io-client';
import NavBar from "./components/NavBar";
import "./App3.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        fontFamily: '"Comic Neue",cursive',
    },
})

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
                <MuiThemeProvider theme={theme}>
                    <NavBar />
                </MuiThemeProvider>
                <video
                    style={{
                        width: 500, height: 500,
                        margin: 5, backgroundColor: 'black',
                        marginLeft: 30, marginTop: 100
                    }}
                    ref={this.localVideoref}
                    autoPlay></video>
                <video
                    style={{
                        width: 500, height: 500,
                        margin: 5, backgroundColor: 'black',
                        marginLeft: 200, marginTop: 100
                    }}
                    ref={this.remoteVideoref}
                    autoPlay></video>
                <br />
                <button onClick={this.createOffer}>Offer</button>
                <button onClick={this.createAnswer}>Answer</button>
                <br />
                <textarea ref={ref => { this.textref = ref }} />
                <br />
                <button onClick={this.setRemoteDescription}>Set Remote Desc</button>
                <button onClick={this.addCandidate}>Add addCandidate</button>
                <br />
                <h3>使用方法</h3>
                <p>offer("type":"offer"の部分を相手のtextにペースト) -> 相手側(Set Remote Descボタン)</p>
                <br />
                <p>自分は相手側の("type":"Answer"の部分を相手のtextにペースト) -> (Set Remote Descボタン) -> 自分の"candidate":"candidate: を相手側に貼り替えて　-> (Add add Candidate)</p>
            </div>
        );
    }
}

export default App3