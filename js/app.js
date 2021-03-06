
window.onload = function() {

    // Install logic
    // If the app has already been installed, we don't do anything.
    // Otherwise we'll show the button, and hide it when/if the user installs the app.
    var installButton = document.getElementById('install');
    var manifestPath = AppInstall.guessManifestPath();

    if(AppInstall.isInstallable()) {

      // checking for app installed is an asynchronous process
      AppInstall.isInstalled(manifestPath, function isInstalledCb(err, result) {

        if(!err && !result) {

          // No errors, and the app is not installed, so we can show the install button,
          // and set up the click handler as well.
          installButton.classList.remove('hidden');

          installButton.addEventListener('click', function() {

            AppInstall.install(manifestPath, function(err) {
              if(!err) {
                installButton.classList.add('hidden');
              } else {
                alert('The app cannot be installed: ' + err);
              }
            });

          }, false);

        }

      });

    }


    // Create the canvas
    var mainContainer = document.querySelector('main');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
	var dpr = window.devicePixelRatio;

	setCanvasSize(320, 240);
    mainContainer.appendChild(canvas);

    // The player's state
    var player = {
        x: 0,
        y: 0,
        sizeX: 30,
        sizeY: 30
    };

    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    // Let's play this game!
    reset();
    var then = Date.now();
    var running = true;
    main();


    // Functions ---
	

	// Set canvas width and height attributes and CSS style so it looks
	// crispy and beautiful in higher density displays
	function setCanvasSize(width, height) {
		canvas.width = width * dpr;
		canvas.height = height * dpr;

		canvas.style.width = Math.round(canvas.width / dpr) + 'px';
		canvas.style.height = Math.round(canvas.height / dpr) + 'px';
	}


    // Reset game to original state
    function reset() {
        player.x = 0;
        player.y = 0;
    }

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }

    // Update game objects.
    // We'll use GameInput to detect which keys are down.
    // If you look at the bottom of index.html, we load GameInput
    // from js/input.js right before app.js
    function update(dt) {

        // Speed in pixels per second
		// We also take the pixel ratio into account!
        var playerSpeed = 100 * dpr;

        if(GameInput.isDown('DOWN')) {
            // dt is the number of elapsed seconds, so multiplying by
            // the speed gives you the number of pixels to move
            player.y += playerSpeed * dt;
        }

        if(GameInput.isDown('UP')) {
            player.y -= playerSpeed * dt;
        }

        if(GameInput.isDown('LEFT')) {
            player.x -= playerSpeed * dt;
        }

        if(GameInput.isDown('RIGHT')) {
            player.x += playerSpeed * dt;
        }

        // You can pass any letter to `isDown`, in addition to DOWN,
        // UP, LEFT, RIGHT, and SPACE:
        // if(GameInput.isDown('a')) { ... }
    }

    // Draw everything
    function render() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.sizeX * dpr, player.sizeY * dpr);
    }

    // The main game loop
	//
    // Notice the `now` parameter. Every time a function is called as a result
	// of requestAnimationFrame, the browser will also pass a parameter which is
	// the current time since the document started being rendered.
    function main(now) {
        if(!running) {
            return;
        }

        requestAnimationFrame(main);

        var dt = (now - then) / 1000.0;

        update(dt);
        render();

        then = now;

    }


};
