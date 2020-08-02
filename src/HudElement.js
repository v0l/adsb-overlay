import Camera from "./Camera";
import HUD from "./Hud";

class HUDElement {
    /**
     * 
     * @param {HUD} ctx 
     */
    constructor(hud) {
        this.hud = hud;
        this.ctx = this.hud.ctx;
    }

    /**
     * Render a frame
     * @param {Camera} cam 
     */
    Render(cam) { }
}

export default HUDElement;