
let APP_ID = "02dd811d5ce641c88b695e7d615c8e4f";

let queryString = window.location.search
let urlparams = new URLSearchParams(queryString)
let roomid = urlparams.get('room')
let username = urlparams.get('name')

if(!roomid){
    roomid = 'main'
}

let uid = sessionStorage.getItem('uid')
if(!uid){
    uid = String(Math.floor(Math.random()*10000))
    sessionStorage.setItem('uid', uid)
}
let client;
let rtmClient;
let channel;
let token = null;

let localTracks = []
let remoteTracks = {}
let localScreenTracks;


let rtcClient =  async () => {
            rtmClient = AgoraRTM.createInstance(APP_ID)
            await rtmClient.login({uid, token})
            await rtmClient.addOrUpdateLocalUserAttributes({'name' : username})
            channel = rtmClient.createChannel(roomid)
            await channel.join()
           
            channel.on('MemberJoined', handleMemberJoined)
            channel.on('MemberLeft', handleMemberLeft)
            channel.on('ChannelMessage', handleChannelMessage)
             
            getMembers()
            addBotMessageToDom('Welcome to the room 👏 ' + username)
            client = AgoraRTC.createClient({mode : 'rtc', codec:'vp8' })
            await  client.join(APP_ID, roomid, token, uid)
            client.on('user-published', getRemoteTracks)
            client.on('user-left', userLeft)

joinStream()

}

let  joinStream = async () => {
localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
let user = `<div class="container__1" id="userBox-${uid}">
            <div class="video" id='user-${uid}'></div>
            <div class='name'> ${username}</div>
                </div>`


document.querySelector('.Otherusers').insertAdjacentHTML('beforeend',user)

document.getElementById(`userBox-${uid}`).addEventListener('click', mainStream)
document.querySelector('#camera').classList.add('active')
document.querySelector('#mic').classList.add('active')
localTracks[1].play(`user-${uid}`)
await client.publish([localTracks[0], localTracks[1]])
}


const SwitchToCamera = async () => { 
     let user = `<div class="container__1 displayFrame" id="userBox-${uid}">
<div class="video" id='user-${uid}'></div>
    </div>`
    document.querySelector('.highlighted_stream').insertAdjacentHTML('beforeend',user)
    document.querySelector('#screen').classList.remove('active')
    document.querySelector(`#userBox-${uid}`).addEventListener('click', mainStream)
    
    document.querySelector('#camera').classList.add('active')
document.querySelector('#mic').classList.add('active')
    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}

let toggleCamera = async (e) => {
    let button = e.currentTarget
   if(localTracks.length > 0){

    const videoTrack = localTracks.find(track => track.trackMediaType
        === 'video');

        if (videoTrack.muted) {
       await localTracks[1].setMuted(false)

        button.classList.add('active')

     }
     else {
        await localTracks[1].setMuted(true)

         button.classList.remove('active')
     }

}}
let toggleMic = async (e) => {
    let button = e.currentTarget
   if(localTracks.length > 0){

    const audioTrack = localTracks.find(track => track.trackMediaType
        === 'audio');

        if (audioTrack.muted) {
       await localTracks[0].setMuted(false)
        button.classList.add('active')

     }
     else {
        await localTracks[0].setMuted(true)
         button.classList.remove('active')
     }

}}

let screenSharing = false;
let getScreenTracks = async () => {
    
    if(!screenSharing){
        screenSharing = true
        
     localScreenTracks = await AgoraRTC.createScreenVideoTrack()
    document.querySelector(`#userBox-${uid}`).remove()
    let user = `<div class="container__1" id="userBox-${uid}">
    <div class="video" id='user-${uid}'></div>
        </div>`
        document.querySelector('.highlighted_stream').insertAdjacentHTML('beforeend',user)
        document.querySelector('#screen').classList.add('active')
        document.querySelector(`#userBox-${uid}`).addEventListener('click', mainStream)
        localScreenTracks.play(`user-${uid}`)
        await client.unpublish([localTracks[1]])
        await client.publish([localScreenTracks])
  }
  else {
    screenSharing = false
    document.querySelector(`#userBox-${uid}`).remove()
    await client.unpublish([localScreenTracks])

        SwitchToCamera()
       
       
    }

}

document.querySelector('#screen').addEventListener('click', getScreenTracks)
document.querySelector('#camera').addEventListener('click', toggleCamera)
document.querySelector('#mic').addEventListener('click', toggleMic)











let getRemoteTracks = async (user,mediatype) => {
  remoteTracks[user.uid] = user
 console.log(remoteTracks)
     await client.subscribe(user,mediatype)
       // Iterate over existing users and subscribe to their tracks for the new user
    for (let existingUser of Object.values(remoteTracks)) {
        if (existingUser.uid !== user.uid) {
            await client.subscribe(existingUser, mediatype);
        }
    }
  
    let remoteUser = document.getElementById(`user-${user.uid}`)
    if(remoteUser === null){
        remoteUser = `<div class="container__1" id="userBox-${user.uid}">
        <div class="video" id='user-${user.uid}'></div>
        
            </div>`

            document.querySelector('.Otherusers').insertAdjacentHTML('beforeend',remoteUser)
            document.getElementById(`userBox-${user.uid}`).addEventListener('click', mainStream)
        }
    if(mediatype === 'video' && user.videoTrack){
         user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediatype === 'audio' && user.audioTrack){
        user.audioTrack.play()
    }


}

let userLeft =  async (user) => {
 delete remoteTracks[user.uid]
 document.querySelector(`#userBox-${user.uid}`).remove()
}

let leftTheRoom = async () => {
 await client.leave()
}

document.getElementById('userleft').addEventListener('click', leftTheRoom)

rtcClient()
