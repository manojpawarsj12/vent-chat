var name;   

const main =()=>{
    let user = document.getElementById('names');
   document.getElementById("username_submit").onsubmit=function (e) {
    
    console.log(user);
    name= user.value;
    sessionStorage.setItem("name",name); 
   };

  
}
window.onload = main;

