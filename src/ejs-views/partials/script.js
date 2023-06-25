
    const signOutLink = document.getElementById('signout');
    signOutLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor tag behavior
  
      fetch('/api/users', {
        method: 'DELETE', // Change the method to the desired one (e.g., POST, DELETE, PUT)
        // Additional options and headers if needed
      })
        .then(response => {
          console.log(response);
          if(response.redirected)
             window.location.href = '/';
          // Handle the response
        })
        .catch(error => {
          // Handle errors
        });
    })