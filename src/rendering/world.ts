import { Application, Container, Graphics, Sprite, Rectangle } from 'pixi.js';
import type { FlightState, Scene } from '../game/state';
export class WorldRenderer {
  readonly app = new Application();
  private world = new Container(); private backdrop = new Sprite(); private rocket = new Container(); private flame = new Graphics();
  private stars = new Graphics(); private planet = new Graphics(); private lines = new Graphics();
  private width = 0; private height = 0; private backdropKey = "";
  async init(host: HTMLElement) {
    await this.app.init({ resizeTo: host, backgroundAlpha: 0, antialias: true, autoStart: false, preference: 'webgl' });
    host.append(this.app.canvas); this.app.stage.addChild(this.stars, this.backdrop, this.rocket);
    this.world.addChild(this.planet, this.lines);
    this.rocket.addChild(this.flame);
    const ship = new Graphics();
    ship.poly([-9,28,-9,-24,0,-45,9,-24,9,28]).fill(0xe8edf0);
    ship.poly([-9,9,-22,30,-9,24]).fill(0x839aa7).poly([9,9,22,30,9,24]).fill(0x839aa7);
    ship.rect(-9,14,18,5).fill(0x0a2333).roundRect(-5,-21,10,14,4).fill(0x16394b);
    ship.rect(-3,-18,6,3).fill(0x83dce9); this.rocket.addChild(ship);
  }
  private resize() {
    const w = this.app.screen.width, h = this.app.screen.height;
    if (w === this.width && h === this.height) return;
    this.width = w; this.height = h; this.stars.clear();
    let seed = 26; const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i=0;i<320;i++) this.stars.circle(random()*w,random()*h,random()*1.1+0.25).fill({color:0xd8e9f5,alpha:random()*0.55+0.1});
  }
  render(state: FlightState, scene: Scene) {
    const oldWidth=this.width, oldHeight=this.height;
    this.resize(); const w=this.width,h=this.height; const menu=scene==='menu';
    if(menu && this.backdropKey === `${w}:${h}:true` && oldWidth===w && oldHeight===h) return;
    const radius = Math.max(w*0.64,h*0.85); const x=menu?w*0.83:w*0.5, y=h+radius*0.52;
    const backdropKey = `${w}:${h}:${menu}`;
    if (this.backdropKey !== backdropKey) {
    this.backdropKey = backdropKey;
    this.planet.clear();
    for(let i=4;i>0;i--) this.planet.circle(x,y,radius+i*5).stroke({color:0x42bace,width:8,alpha:0.03});
    this.planet.circle(x,y,radius).fill(0x112c3d).circle(x+20,y+40,radius-42).fill(0x102432);
    for(let i=0;i<17;i++) {
      const yy=y-radius+55+i*34; const half=Math.sqrt(Math.max(0,radius*radius-(yy-y)**2));
      this.planet.ellipse(x+Math.sin(i*3)*80,yy,half*0.78,5+i*0.6).fill({color:i%3?0x2b5260:0x60838a,alpha:0.14});
    }
    this.planet.circle(x,y,radius).stroke({color:0x7ac4d3,width:1,alpha:0.6});
    this.lines.clear();
    if(menu) {
      this.lines.ellipse(x-50,y-radius*0.48,radius*0.85,radius*0.49).stroke({color:0x7bc6d4,width:1,alpha:0.26});
      this.lines.ellipse(x-50,y-radius*0.48,radius*0.9,radius*0.54).stroke({color:0x7bc6d4,width:1,alpha:0.08});
      this.lines.circle(w*0.72,h*0.3,4).fill(0x9cf5f2).circle(w*0.72,h*0.3,10).stroke({color:0x9cf5f2,width:1,alpha:0.3});
    }
    const previousTexture = this.backdrop.texture;
    this.backdrop.texture = this.app.renderer.generateTexture({ target: this.world, frame: new Rectangle(0, 0, w, h), resolution: 1 });
    if (previousTexture.width > 1) previousTexture.destroy(true);
    }
    this.rocket.visible=!menu;
    this.rocket.position.set(w*0.5,h*0.42); this.rocket.rotation=state.angle;
    this.rocket.scale.set(w<600?0.9:1.25);
    this.flame.clear();
    if(state.status==='flying' && state.fuel>0 && state.throttle>0) {
      const length=35+state.throttle*65+Math.sin(state.time*70)*8;
      this.flame.poly([-7,28,0,28+length,7,28]).fill({color:0x48d7f3,alpha:0.7});
      this.flame.poly([-4,28,0,28+length*0.65,4,28]).fill(0xe4fcff);
    }
    if(!menu) this.backdrop.y=Math.min(state.altitude*0.006,h*0.34);
    else this.backdrop.y=0;
    this.app.renderer.render(this.app.stage);
  }
  destroy() { this.app.destroy(true, { children: true }); }
}
