export const shell = `
<div id="space" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<header class="masthead"><a class="brand" href="#" aria-label="Apogee home"><span class="brand-symbol">Λ</span>APOGEE<span class="brand-tag">SPACEFLIGHT SIMULATOR</span></a><div class="header-right"><span class="system-state"><i></i> SYSTEMS NOMINAL</span><button class="icon-button" id="sound" aria-label="Enable interface sound">♪<span id="sound-label"> SOUND OFF</span></button></div></header>
<main id="menu" class="menu">
  <div class="eyebrow"><span class="line"></span> YOUR NEXT GIANT LEAP</div>
  <h1>It starts with<br>a little <em>gravity.</em></h1>
  <p class="intro">An open sky. An ambitious machine.<br>And the quiet pull of somewhere beyond.</p>
  <div class="mission-label"><span>01 / FLIGHT PROGRAM</span><span class="tag">SANDBOX</span></div>
  <button class="mission" id="new-flight"><span class="mission-icon">↗</span><span><strong>Begin a new flight</strong><small>Meet Pathfinder I. Make your first ascent.</small></span><span class="arrow">↗</span></button>
  <button class="secondary" id="continue"><span>↳ &nbsp; Resume saved flight</span><span>→</span></button>
  <div class="menu-note"><span class="tiny-orbit">◌</span> DESIGNED FOR CURIOSITY. BUILT FOR DISCOVERY.</div>
</main>
<aside id="planet-label" class="planet-label"><span class="cross">+</span><div><small>OUR POINT OF DEPARTURE</small><strong>Earth</strong><span>SOL SYSTEM &nbsp; / &nbsp; 1 AU</span></div></aside>
<section id="flight" class="flight hidden" aria-label="Flight controls">
 <div class="flight-heading"><span class="eyebrow">FLIGHT 001 / PATHFINDER I</span><h2 id="flight-status">Ready for ignition</h2><span class="clock">T+ <b id="time">00:00</b></span></div>
 <div class="telemetry"><div><small>ALTITUDE</small><strong id="altitude">0.00 <em>km</em></strong></div><div><small>VERTICAL SPEED</small><strong id="velocity">0 <em>m/s</em></strong></div><div><small>APOGEE EST.</small><strong id="apogee">0.00 <em>km</em></strong></div></div>
 <div class="flight-bottom"><div class="engine-panel"><label for="throttle">THROTTLE <b id="throttle-value">0%</b></label><input id="throttle" type="range" min="0" max="100" value="0"><div class="fuel-label"><span>PROPELLANT</span><span id="fuel-value">100%</span></div><meter id="fuel" min="0" max="16000" value="16000" aria-label="Remaining fuel"></meter></div><div class="flight-actions"><div class="steer"><button id="left" aria-label="Steer left">↶</button><span>PITCH<br><b id="pitch">0°</b></span><button id="right" aria-label="Steer right">↷</button></div><button class="primary" id="launch">IGNITE ENGINE <span>↑</span></button><button class="secondary compact" id="pause">Pause flight <kbd>ESC</kbd></button></div></div>
 <div class="controls-hint">W / S &nbsp; THROTTLE <span>·</span> A / D &nbsp; PITCH <span>·</span> SPACE &nbsp; IGNITION</div>
</section>
<div id="pause-overlay" class="modal-wrap hidden"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="pause-title"><span class="eyebrow">FLIGHT CONTROL</span><h2 id="pause-title">A moment of quiet.</h2><p>Your flight is paused. The stars can wait.</p><button id="resume" class="primary">Resume flight <span>→</span></button><button id="save" class="secondary">Save flight <span>↓</span></button><button id="exit" class="secondary">Return to mission control <span>↗</span></button></section></div>
<div id="toast" class="toast hidden" role="status"></div>
<footer><span>APOGEE <b>/</b> FLIGHT SYSTEMS v0.1</span><span class="footer-center">THE UNIVERSE DOESN’T COME WITH A ROADMAP.</span><span><i></i> ALL SYSTEMS GO</span></footer>`;
