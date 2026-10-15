import { beforeEach, expect, it, vi } from 'vitest';
import { SaveStore } from './save';
import { createFlight } from '../game/state';
let value: string | null;
beforeEach(()=>{value=null;vi.stubGlobal('localStorage',{getItem:()=>value,setItem:(_:string,v:string)=>{value=v;}});});
it('round trips serializable flight state',()=>{const store=new SaveStore();const state=createFlight();expect(store.save(state)).toBe(true);expect(store.load()).toEqual(state);});
it('rejects corrupted and incompatible saves',()=>{const store=new SaveStore();value='{broken';expect(store.load()).toBeNull();value=JSON.stringify({version:2,state:createFlight()});expect(store.load()).toBeNull();value=JSON.stringify({version:1,state:{...createFlight(),fuel:-1}});expect(store.load()).toBeNull();});
it('handles denied storage without breaking the flight',()=>{vi.stubGlobal('localStorage',{getItem:()=>{throw Error();},setItem:()=>{throw Error();}});expect(new SaveStore().save(createFlight())).toBe(false);expect(new SaveStore().load()).toBeNull();});
