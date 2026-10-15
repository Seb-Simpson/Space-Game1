import '@fontsource/barlow-condensed/400.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import './ui/styles.css';
import { shell } from './ui/shell';
import { WorldRenderer } from './rendering/world';
import { GameLoop } from './core/loop';
import { SceneManager } from './game/scenes';
import { createFlight } from './game/state';
import { InputController } from './input/controller';
import { stepFlight } from './simulation/flight';
import { estimateApogee } from './map/orbit';
import { SaveStore } from './persistence/save';
import { AudioSystem } from './audio/audio';
import { loadAssets } from './assets/loader';
import { clamp, formatTime } from './utils/math';
const root = document.querySelector<HTMLDivElement>('#app')!;
async function boot() {
  await loadAssets(() => {});
  root.innerHTML = shell;
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const renderer = new WorldRenderer(); await renderer.init(el('space'));
  const saves = new SaveStore(), audio = new AudioSystem();
  let state = createFlight(), steering = 0, toastTimer = 0;
  const toast = (message: string) => { el('toast').textContent = message; el('toast').classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el('toast').classList.add('hidden'), 3000); };
  const refreshSave = () => { el<HTMLButtonElement>('continue').disabled = !saves.load(); };
  const scenes = new SceneManager(scene => {
    el('menu').classList.toggle('hidden', scene !== 'menu'); el('planet-label').classList.toggle('hidden', scene !== 'menu');
    el('flight').classList.toggle('hidden', scene === 'menu'); el('pause-overlay').classList.toggle('hidden', scene !== 'paused');
    document.body.dataset.scene = scene;
    el('flight').inert = scene === 'paused';
    document.querySelector<HTMLElement>('.masthead')!.inert = scene === 'paused';
    if(scene==='paused') el('resume').focus();
    if(scene==='menu') refreshSave();
  });
  document.addEventListener('keydown', e => {
    if (scenes.current !== 'paused' || e.key !== 'Tab') return;
    const buttons = [...el('pause-overlay').querySelectorAll<HTMLButtonElement>('button')];
    if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons.at(-1)!.focus(); }
    else if (!e.shiftKey && document.activeElement === buttons.at(-1)) { e.preventDefault(); buttons[0].focus(); }
  });
  const ignite = () => { if(scenes.current !== 'flight' || state.status !== 'standby') return; state.launched=true; state.status='flying'; state.throttle=1; audio.cue(); };
  const pause = () => { if(scenes.current === 'flight') scenes.enter('paused'); else if(scenes.current === 'paused') scenes.enter('flight'); };
  const input = new InputController(action => action === 'pause' ? pause() : ignite());
  el('new-flight').onclick = () => { state=createFlight(); scenes.enter('flight'); };
  el('continue').onclick = () => { const saved=saves.load(); if(saved) {state=saved; scenes.enter('flight');} else toast('No valid flight recording found.'); };
  el('launch').onclick = () => { if(state.status==='landed'||state.status==='crashed') state=createFlight(); else ignite(); };
  el('pause').onclick = pause; el('resume').onclick = () => scenes.enter('flight');
  el('save').onclick = () => toast(saves.save(state) ? 'Flight recording saved to this device.' : 'Storage unavailable. Flight could not be saved.');
  el('exit').onclick = () => scenes.enter('menu');
  document.querySelector<HTMLAnchorElement>('.brand')!.onclick = e => { e.preventDefault(); if(scenes.current==='flight') scenes.enter('paused'); else if(scenes.current==='menu') toast('Mission control · ready for your next flight.'); };
  el('sound').onclick = async () => { try { await audio.toggle(); el('sound-label').textContent=audio.enabled?' SOUND ON':' SOUND OFF'; el('sound').setAttribute('aria-label',audio.enabled?'Disable interface sound':'Enable interface sound'); } catch { toast('Audio is unavailable in this browser.'); } };
  el<HTMLInputElement>('throttle').oninput = e => { state.throttle=Number((e.target as HTMLInputElement).value)/100; };
  for(const [id, direction] of [['left',-1],['right',1]] as const) {
    el(id).onpointerdown = e => { steering=direction; el(id).setPointerCapture(e.pointerId); };
    el(id).onpointerup = el(id).onpointercancel = () => { steering=0; };
  }
  document.addEventListener('visibilitychange', () => { if(document.hidden && scenes.current==='flight') scenes.enter('paused'); });
  const loop = new GameLoop(dt => {
    if(scenes.current !== 'flight') return;
    state.throttle=clamp(state.throttle+input.throttle*dt*0.4,0,1);
    stepFlight(state,dt,clamp(input.steering+steering,-1,1));
  }, () => {
    renderer.render(state, scenes.current);
    if(scenes.current==='menu') return;
    el('time').textContent=formatTime(state.time);
    el('altitude').innerHTML=`${(state.altitude/1000).toFixed(2)} <em>km</em>`;
    el('velocity').innerHTML=`${state.velocity.toFixed(0)} <em>m/s</em>`;
    el('apogee').innerHTML=`${(estimateApogee(state.altitude,state.velocity)/1000).toFixed(2)} <em>km</em>`;
    el('throttle-value').textContent=`${Math.round(state.throttle*100)}%`; el<HTMLInputElement>('throttle').value=String(state.throttle*100);
    el<HTMLMeterElement>('fuel').value=state.fuel; el('fuel-value').textContent=`${Math.round(state.fuel/160)}%`; el('pitch').textContent=`${Math.round(state.angle*180/Math.PI)}°`;
    el('flight-status').textContent={standby:'Ready for ignition',flying:state.fuel>0?'The sky is only the beginning.':'Engine cutoff · coasting',landed:'Touchdown confirmed',crashed:'Flight ended · hard landing'}[state.status];
    el<HTMLButtonElement>('launch').disabled=state.status==='flying';
    el('launch').innerHTML=state.status==='crashed'||state.status==='landed'?'PREPARE NEW VEHICLE <span>↻</span>':state.status==='flying'?'FLIGHT IN PROGRESS <span>↗</span>':'IGNITE ENGINE <span>↑</span>';
  });
  scenes.enter('menu'); loop.start();
  window.addEventListener('pagehide', () => { loop.stop(); input.destroy(); renderer.destroy(); }, { once:true });
}
boot().catch(error => { console.error('APOGEE startup failed',error); root.innerHTML='<div class="boot error"><strong>Flight systems offline.</strong><p>APOGEE could not initialize its graphics system. Check that WebGL is enabled, then reload.</p><button class="primary" onclick="location.reload()">Retry startup ↻</button></div>'; });
