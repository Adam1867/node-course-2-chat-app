$(function() {

  // set notification count
  var notificationCount = 0;
  // set original page title
  var origTitle = $(document).attr('title');

  // sets a window.isActive property if tab is focused/unfocused
  window.isActive = true;
  $(window).focus(function() {
    this.isActive = true;
    resetNotificationCount();
  });
  $(window).blur(function() {
    this.isActive = false;
  });

  var socket = io();

  function scrollToBottom() {
    // selectors
    var $messages = $('#messages');
    var $newMessage = $messages.children('li:last-child');
    // heights
    var clientHeight = $messages.prop('clientHeight');
    var scrollTop = $messages.prop('scrollTop');
    var scrollHeight = $messages.prop('scrollHeight');
    var newMessageHeight = $newMessage.innerHeight();
    var lastMessageHeight = $newMessage.prev().innerHeight();

    if ( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ) {
      $messages.scrollTop(scrollHeight);
    }

    resetNotificationCount();
  }

  function increaseNotificationCount() {
    if ( !window.isActive || !$('.message:last-child').visible() ) {
      notificationCount++;
      $(document).attr('title', '('+notificationCount+') '+origTitle);
    }
  }

  function resetNotificationCount() {
    if ( window.isActive && $('.message:last-child').visible() ) {
      notificationCount = 0;
      $(document).attr('title', '('+notificationCount+') '+origTitle);
    }
  }

  $('#messages').scroll(function() {
    resetNotificationCount();
  });

  socket.on('connect', function() {
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function(err) {
      if ( err ) {
        alert(err);
        window.location.href = '/';
      }
    });
  });

  socket.on('updateUserList', function(users) {
    var $ol = $('<ol></ol>');
    users.forEach(user => {
      $ol.append($('<li></li>').text(user));
    });
    $('#users').html($ol);
  });

  socket.on('disconnect', function() {
    console.log('disconnected from server');
  });

  socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    increaseNotificationCount();
  });

  socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
      url: message.url,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  });

  $('#message-form').on('submit', function(e) {
      e.preventDefault();
      var $messageTextbox = $('[name="message"]');

      socket.emit('createMessage', {
        text: $messageTextbox.val()
      }, function() {
        $messageTextbox.val('');
      });
  });

  var $locationBtn = $('#send-location');
  $locationBtn.on('click', function(e) {
    if ( !navigator.geolocation ) {
      return alert('Geolocation not supported by your browser.');
    }

    var btnText = $locationBtn.text();
    $locationBtn.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
      $locationBtn.removeAttr('disabled').text(btnText);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

    }, function() {
      $locationBtn.removeAttr('disabled').text(btnText);
      alert('Unable to fetch location.');
    });
  });

});
