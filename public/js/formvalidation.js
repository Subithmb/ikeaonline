// const form = document.getElementById("form");

// const email = document.getElementById("email");
// const password = document.getElementById("password");


// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   validateInputs();
// });

// const setError = (element, message) => {
//   const inputControl = element.parentElement;
//   const errorDisplay = inputControl.querySelector(".error");

//   errorDisplay.innerText = message;
//   inputControl.classList.add("error");
//   inputControl.classList.remove("success");
// };

// const setSuccess = (element) => {
//   const inputControl = element.parentElement;
//   const errorDisplay = inputControl.querySelector(".error");

//   errorDisplay.innerText = "";
//   inputControl.classList.add("success");
//   inputControl.classList.remove("error");
// };
// const isValidEmail = (email) => {
//   const re =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// };
//    var passworderror=(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)

// const validateInputs = () => {

//   const emailValue = email.value.trim();
//   const passwordValue = password.value.trim();


//   if (emailValue === "") {
//     setError(email, "Email is required");
//   } else if (!isValidEmail(emailValue)) {
//     setError(email, "Provide a valid email address");
//   } else {
//     setSuccess(email);
//   }

//   if(passworderror.test(password)=false){
//           error.innerHTML='password must contain 8 characters, at least one special character, and at least one uppercase letter'
//           return false;
      
//   } 


// };









function validate(){
  var name=document.submit.name.value;
  var email=document.submit.email.value;
  var phone=document.submit.phone.value;
  var password=document.submit.password.value;
  var cpassword=document.submit.cpassword.value;

  var reg =    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var nameerror= (/^[A-Za-z]+$/);
  var phoneerror=(/^[0-9]{10}$/);
  var passerror=(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)
  var error=document.getElementById("error-mess");

  if(name==""){
      error.innerHTML='Please enter your name'
      return false;
  }
  if(nameerror.test(name)==false){
    error.innerHTML='invalid name'
    return false;
} 
if(name.length<5){
     error.innerHTML='Name should contain atleast 5 elements'
      return false;
  }
  if(email==""){
      error.innerHTML='Please enter your email id'
      return false;
  }
  if(reg.test(email)==false){
    error.innerHTML='invalid email id'
    return false;
  }
  if(phoneerror.test(phone)==false){
      error.innerHTML='Phone number should contain 10 numbers'
      return false;
  }
  if(passerror.test(password)==false){
      error.innerHTML='password must contain 8 characters, at least one special character, and at least one uppercase letter'
      return false;
  }
  if(password!==cpassword){
      error.innerHTML='Passwords do not match'
  }
  return true;

}