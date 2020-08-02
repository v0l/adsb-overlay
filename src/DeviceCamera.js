import HUDElement from "./HudElement";

class DeviceCameraElement extends HUDElement {
    constructor(hud) {
        super(hud);

        this.StartCapture();
    }

    async StartCapture() {
        this.stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: this.hud.width,
                height: this.hud.height
            } 
        });
        this.video = document.createElement("video");
        this.video.style.display = "none";
        this.video.srcObject = this.stream;
        document.body.appendChild(this.video);
        await this.video.play();
    }

    Render(cam) {
        if(this.stream instanceof MediaStream) {
            this.ctx.drawImage(this.video, 0, 0, this.hud.width, this.hud.height);
        } else {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.hud.width, this.hud.height);
        }
    }
}

export default DeviceCameraElement;