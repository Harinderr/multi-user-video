

const handleMemberJoined = async (MemberId) => {
    // console.log('a new member joined ' + MemberId )
        addMemberToDom(MemberId)
        const {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
        let botmessageonJoin = `${name } has joined the room `
        addBotMessageToDom(botmessageonJoin)
}

const MemberCounter = async () => {
    let members = await channel.getMembers()

    document.getElementById('members__count').innerHTML = members.length
}

const addMemberToDom = async (MemberId) => {
  const {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
 
    let newMember = `  <div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>
    </div>`
document.getElementById('member__list').insertAdjacentHTML('beforeend', newMember)
MemberCounter()
}




const handleMemberLeft = async (MemberId) => {
    let memberleftDiv = document.getElementById(`member__${MemberId}__wrapper`)
    memberleftDiv.remove()
    let memberLeftName =  memberleftDiv.children[1].textContent
    addBotMessageToDom(`${memberLeftName} has left the room`)
    MemberCounter()
}

const getMembers = async () => {
    const members = await channel.getMembers()
    console.log('all the members ' + members)
    for(let i = 0;members.length > i ; i++) {
   addMemberToDom(members[i])
    }
}

const leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()

}
 
const  handleChannelMessage = async (messageData, MemberId) => {
  
try {
    // Parse the messagedata back to an object
    let msgdata =   JSON.parse(messageData.text)
         if(msgdata.type === 'chat'){
            addMessageToDom(msgdata.name, msgdata.message)
         }
    // Now you can access properties of the parsedMessage object
    console.log('Parsed Message Data:', msgdata);
    console.log('Member ID:', msgdata.name);
  } catch (error) {
    console.error('Error parsing message:', error);
  }

}
const chatMessage = async (e) => {
    e.preventDefault()
   let message = e.target.message.value 
  channel.sendMessage({text : JSON.stringify({'type' : 'chat', 'message': message, 'name': username})})
   addMessageToDom(username, message)
  e.target.reset()
}



const addMessageToDom = async (name,message) => {
    let messagesContainer = document.getElementById('messages')
    if(name == username){
        let msgWrapper = `<div class="message__wrapper user-message">
        <div class="message__body">
            <strong class="message__author">${name}</strong>
            <p class="message__text">${message}</p>
        </div>
    </div>` 
    messagesContainer.insertAdjacentHTML("beforeend", msgWrapper)

    } else {
        let msgWrapper = `<div class="message__wrapper">
        <div class="message__body">
            <strong class="message__author">${name}</strong>
            <p class="message__text">${message}</p>
        </div>
    </div>`
    messagesContainer.insertAdjacentHTML("beforeend", msgWrapper)

    }
       
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
const addBotMessageToDom = async (botMessage) => {
    let messagesContainer = document.getElementById('messages')
        let msgWrapper = `<div class="message__wrapper">
        <div class="message__body__bot">
            <strong class="message__author__bot">Welcome Meet</strong>
            <p class="message__text__bot"> ${botMessage}</p>
        </div>
    </div>`
    messagesContainer.insertAdjacentHTML("beforeend", msgWrapper)
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}



window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', chatMessage)