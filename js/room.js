let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});


const stream = document.querySelector('.highlighted_stream')
const videoBox = document.getElementsByClassName('container__1')
const allUsers = document.querySelector('.Otherusers')

 function mainStream (e) {
  
 
  let Existingstream = stream.children[0]
  if(Existingstream) {
    Existingstream.classList.remove('displayFrame')
    allUsers.appendChild(Existingstream)
    
  }
  let clickedItem = e.currentTarget
  clickedItem.classList.add('displayFrame')
  stream.style.display = 'block'
  stream.appendChild(clickedItem)
  

  
}

for(let i = 0;  i < videoBox.length; i++) {
  videoBox[i].addEventListener('click', mainStream)
}

let hideStream = async () => {
  let streamContainer = document.querySelector('.highlighted_stream')
  let allusers = document.querySelector('.Otherusers')
  let actualSize = streamContainer.children[0]
  actualSize.classList.remove('displayFrame')
  allusers.appendChild(actualSize)         
 
    streamContainer.style.display = 'none'
  
  


}
document.querySelector('.highlighted_stream').addEventListener('click', hideStream)





