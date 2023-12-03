import React from "react";

//muestra/oculta el menu si se pulsa el menuButton
    const handleMenuVisibility = (e) => {
        e.stopPropagation(); // Detiene la propagación del evento
        setMenuVisibility(!menuVisibility); // Cambia la visibilidad del menú
        setMenuClicked(!menuClicked);
        if (menuVisibility === true) {
          setFriendRequestVisibility(false);
          setAddFormVisibility(false);
        }
    };

    const handleFriendRequestVisibility = () => {
      setFriendRequestVisibility(!friendRequestVisibility);
      setAddFormVisibility(false);

      fetch ('http://192.168.1.54:4567/friend-requests', {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setFriendRequests(data.friendRequests);

        }
      })
    };
    const handleAcceptRequest = (senderId) => {
      setIsProcessingRequest(true);
      socket.emit('acceptFriendRequest', senderId);

      socket.on('acceptFriendRequestError', (message) => {
        console.log("Error: ", message);
        Swal.fire({
          title: 'Error ',
          text: message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });

    };

    const handleIgnoreRequest = (requestId) => {
      setIsProcessingRequest(true);
    }

    //Logout handler
    const handleLogout = () => {
      fetch('http://192.168.1.54:4567/logout', {
        credentials: 'include',
        method: 'GET',
      })
      .then(response => response.json())
      .then(data =>{
        if (data.status === 'success') {
          navigate('/Login');

        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
    };

    //Addcontact handlers
    const handleAddFormVisibility = () => {
      setAddFormVisibility(!addFormVisibility);
      setFriendRequestVisibility(false);    
    };
    const handleAddContact = async(e) => {
      e.preventDefault();
      socket.emit('sendFriendRequest', newContactUsername)
      // Escuchar el evento de éxito al enviar una solicitud de amistad
      setAddFormVisibility(false);
    };

    //buttonHome
    const handleRedirectHome = () => {
      navigate('/');
    }

    export default {
        handleMenuVisibility,
        handleFriendRequestVisibility,
        handleAcceptRequest,
        handleIgnoreRequest,
        handleLogout,
        handleAddFormVisibility,
        handleAddContact,
        handleRedirectHome
    }