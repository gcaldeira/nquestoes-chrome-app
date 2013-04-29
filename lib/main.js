chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('home.html', {
    'bounds': {
      'width': 500,
      'height': 600
    }
  });
});

