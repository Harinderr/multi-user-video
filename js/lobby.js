
const formContent = document.getElementById('lobby__form')
formContent.onsubmit = (e) => {
    e.preventDefault()
    let name = e.target.name.value
    let room = e.target.room.value
    window.location = `room.html?room=${room}&name=${name}`
    
}