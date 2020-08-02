import HUDElement from "./HudElement";
import { DEG } from "./Const";

class DebugElement extends HUDElement {
    constructor(hud) {
        super(hud);

        this.fontSize = 20;
    }

    Render(cam) {
        let info = [
            `Lat: ${cam.position.lat.toFixed(4)}`,
            `Lon: ${cam.position.lon.toFixed(4)}`,
            `Head: ${cam.heading.toFixed(2)}${DEG}`,
            `Alt: ${cam.position.height.toFixed(2)} M`,
            `Pitch: ${(typeof cam.pitch === "number" ? cam.pitch : 0).toFixed(2)}${DEG}`,
            `Yaw: ${(typeof cam.yaw === "number" ? cam.yaw : 0).toFixed(2)}${DEG}`,
            `Roll: ${(typeof cam.roll === "number" ? cam.roll : 0).toFixed(2)}${DEG}`
        ];
        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.translate(5, 5);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 200, 200);
        this.ctx.fillStyle = "white";
        for(let x = 0; x < info.length; x++) {
            let msg = info[x];
            this.ctx.fillText(msg, 2, 2 + (this.fontSize * (x + 1)));
        }
    }
}

export default DebugElement;