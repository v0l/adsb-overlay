import Camera from "./Camera";
import HUDElement from "./HudElement";

class HUD {
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.canvas = element;
        this.ctx = element.getContext("2d");

        /** @type {Array<HUDElement>} */
        this.elements = [];

        /** @type {Camera} */
        this.cam = null;

        this.fontSize = 14;
        this.font = "monospace";
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    /**
     * Adds a new element to the HUD
     * @param {HUDElement} e 
     */
    AddElement(e) {
        this.elements.push(e);
    }

    /**
     * Start the HUD with the specified camera
     * @param {Camera} cam 
     */
    Start(cam) {
        this.cam = cam;
        window.requestAnimationFrame(this.Render.bind(this));
    }

    Render(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = `${this.fontSize}px ${this.font}`;
        for(let e of this.elements){
            this.ctx.save();
            e.Render(this.cam);
            this.ctx.restore();
        }

        window.requestAnimationFrame(this.Render.bind(this));
    }
}

export default HUD;