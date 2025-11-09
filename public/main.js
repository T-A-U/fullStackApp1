var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
const submitCommentBtn = document.getElementById("submitComment")

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown': thumbDown
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

//make it so user takes year 


// let elementButton = document.querySelector("#year");
// button
document.getElementById("submitYear").addEventListener('click', getZeldaGames)
//jsutin helped with logic
function getZeldaGames() {
  const input = document.getElementById("year").value
  console.log('hi')
  fetch(`/getZeldaGames/${input}`)
    .then(response => response.text()) 
    .then(data => {
      document.getElementById('game').innerText = `${data}`
      // `${data}`.length ? document.getElementById('commentSection').style.display="block": document.getElementById('commentSection').style.display="none";
      if( `${data}`.length ){
        document.getElementById('commentSection').style.display="block"
      }else if(`${data}`.length && document.getElementById('commentSection') ){
        document.getElementById('commentSection').style.display="none"
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  
}

submitCommentBtn.addEventListener("click", (e)=> {
  e.preventDefault()
  const comment = document.getElementById("addComment").value
  const owner = document.getElementById("commentOwner").value
  const game = document.getElementById('game').innerText
  console.log(owner, comment, game)
  // test()
  sendCommentToDatabase(owner, comment, game) 
  window.location.reload(true)
})
function test(){
  console.log("mario")
}
// console.log(owner, "hello")
function sendCommentToDatabase(owner, comment, game){
  // const msg = this.parentNode.parentNode.childNodes[3].innerText
  //     const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
      fetch('profile', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 'name': name,
          // 'msg': msg,
          // 'thumbDown': thumbDown
          'owner': owner,
          "comment" : comment,
          "game" : game
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data,"done")
          // window.location.reload(true)
        })
}
//BIG help from Ryan Hernandez
//ask another for help