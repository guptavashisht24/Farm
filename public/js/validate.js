

window.onload = function(){

    //there will be one span element for each input field
    // when the page is loaded, we create them and append them to corresponding input elements 
	// they are initially empty and hidden

    var regLink = document.getElementById('registerLink');
    var loginform = document.getElementById('loginForm');
    var regform = document.getElementById('registerForm')

    regLink.addEventListener('click' , function(e){ 
        loginform.style.display = "none";
        regform.style.display = "block";
        regLink.style.display = "none";
     });
     
	var email = document.getElementById("email");
    var span1 = document.createElement("span");
	span1.style.display = "none"; //hide the span element
    email.parentNode.appendChild(span1);

    var password = document.getElementById("pwd2");
    var span2 = document.createElement("span");
	span2.style.display = "none"; //hide the span element
    password.parentNode.appendChild(span2);

    // var confirmpwd = document.getElementById("confirm");
    // var span3 = document.createElement("span");
	// span3.style.display = "none"; //hide the span element
    // confirmpwd.parentNode.appendChild(span3);

    var emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    var pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*+]).{6,}$/

    email.onfocus = function(){
    	
        email.classList.remove('error')

        span1.innerHTML = "e.g. pga210001@utdallas.edu"
        span1.style.display = "block"
        span1.style.color = 'gray'
        
    }

    email.onblur = function(){
        span1.style.display="none"   
    }

    password.onfocus = function(){
    
        password.classList.remove('error')
        
        span2.innerHTML = "The password field should contain at least six characters, one uppercase letter, one number and one special character (!,@,#,$,%,^,&,*,+)"
        span2.style.display = "block"
        span2.style.color = 'gray'
    }

    password.onblur = function(){
        span2.style.display="none"   
    }

    // confirmpwd.onfocus = function(){
    	
    //     confirmpwd.classList.remove('error')
        
    // }

    // confirmpwd.onblur = function(){
    //     span3.style.display="none"   
    // }

    
    
    var form = document.getElementById("registerForm");
    form.onsubmit = function(e){
        
    	// if (confirmpwd.value === password.value){
        //     confirmpwd.classList.remove('error')
        //     password.classList.remove('error')
        // }
        // else{
        //     password.classList.add('error')
        //     confirmpwd.classList.add('error')
        //     span3.innerHTML = "The passwords do not match"
        //     span3.style.color = 'red'
        //     span3.style.display = "block";
        //     e.preventDefault();
        // }

        if (!(pwdPattern.test(password.value))){
            span2.innerHTML = "The password field should contain at least six characters, one uppercase letter, one number and one special character (!,@,#,$,%,^,&,*,+)"
            span2.style.color = 'red'
            span2.style.display = "block"
            password.classList.add('error');
            e.preventDefault();
        }

        if (emailPattern.test(email.value)){
            email.classList.remove('error')
        }
        else{
            span1.innerHTML = "Please enter a valid email (e.g. pga210001@utdallas.edu)"
            span1.style.color = 'red'
            span1.style.display = "block"
            email.classList.add('error')
            e.preventDefault();

        }
    }


}

