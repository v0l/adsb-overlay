import HUDElement from "./HudElement";
import Camera from "./Camera";
import HUD from "./Hud";
import { ToRad, DEG } from "./Const";

class Compass extends HUDElement {
    /**
     * 
     * @param {HUD} ctx 
     */
    constructor(hud) {
        super(hud);

        this.verticalAxis = false;
        this.horizontalAxis = true;
        this.relativeDegrees = false;
        this.absoluteDegrees = false;
        this.verticalIncrement = 5.0;
        this.horizontalIncrement = 5.0;
        this.color = "#00ff11";
        this.markHeight = 10;
    }

    /**
     * 
     * @param {Camera} cam 
     */
    Render(cam) {
        let cy = this.hud.height / 2.0;
        let cx = this.hud.width / 2.0;
        let dw = Math.sqrt(Math.pow(this.hud.width, 2) + Math.pow(this.hud.height, 2)) / 2.0;

        this.ctx.translate(cx, cy);
        this.ctx.rotate(-ToRad(cam.roll));
        this.ctx.strokeStyle = this.ctx.fillStyle = this.color;

        let dgMod = cam.heading - (cam.heading % this.horizontalIncrement);
        let pixDeg = this.hud.width / cam.fov;
        let nDeg = Math.ceil(dw / pixDeg);
        if(this.horizontalAxis) {
            this.ctx.beginPath();
            this.ctx.moveTo(-dw, 0);
            this.ctx.lineTo(dw, 0);
            this.ctx.stroke();

            for(let x = -nDeg; x < nDeg; x += this.horizontalIncrement) {
                let X = (x * pixDeg) - ((cam.heading % this.horizontalIncrement) * pixDeg)
                this.ctx.beginPath();
                this.ctx.moveTo(X, -this.markHeight);
                this.ctx.lineTo(X, this.markHeight);
                this.ctx.stroke();

                let absHeading = dgMod + x;
                if(absHeading < 0) {
                    absHeading = absHeading + 360;
                } else if(absHeading > 360.0) {
                    absHeading -= 360.0;
                }
                let labelAbsolute = `${absHeading}`;
                let labelAbsoluteSize = this.ctx.measureText(labelAbsolute);
                this.ctx.fillText(`${labelAbsolute}${DEG}`, X - (labelAbsoluteSize.width / 2.0), this.markHeight + 5 + this.hud.fontSize);
            }
        }
    }
}

export default Compass;