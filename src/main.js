import Decoder from "mode-s-decoder";
import AircraftStore from "mode-s-aircraft-store";
import LatLon, { Ned } from "geodesy/latlon-nvector-ellipsoidal";

import { AVR_WS, CAM_W, CAM_H, CAM_POS, CAM_BEARING, CAM_HFOV, CAM_VHOV } from "./config";

const FontSize = 30; //pixels
const FontSpacing = FontSize + 2;
const Font = `bold ${FontSize}px monospace`;

const MarkerSize = 50; //from center ie. W = MarkerSize * 2
const MarkerPointSize = 1; //same as above
const Calibrate = false; //show some calibartion markers (helpful for positiong the camera)
const Compass = true;
const RelativeDeg = false;
const HozDeg = 5.0; //Horizonal degrees markers
const VirDeg = 5.0; //Vertical degrees markers

const IS_NIGHT = new Date().getHours() > 16.0 || new Date().getHours() < 5.0;
const DEG = "°";

const FT_MTR = 3.281; //Feet to Meters

const store = new AircraftStore({
    timeout: 30000
});

function calcDelta(msg) {
    let alt = msg.unit === Decoder.UNIT_FEET ? msg.altitude / FT_MTR : msg.altitude;

    let msgPos = new LatLon(msg.lat, msg.lng, alt);

    let delta = CAM_POS.deltaTo(msgPos);

    return {
        dist: delta.length,
        elevation: delta.elevation,
        bearing: CAM_BEARING - delta.bearing
    };
}

function StartAVR() {
    let decoder = new Decoder();

    let ws = new WebSocket(AVR_WS);
    ws.onopen = function (evt) {

    }
    ws.onmessage = function (evt) {
        if (typeof evt.data === "string") {
            var data = new Uint8Array();

            let avr = evt.data.substr(0, evt.data.length - 2);
            if (avr.startsWith("*") || avr.startsWith("@")) {
                data = new Uint8Array(avr.substr(1).match(/[\da-f]{2}/gi).map(function (h) {
                    return parseInt(h, 16)
                }));
            }
            let msg = decoder.parse(data);
            store.addMessage(msg);
        }
    }
    ws.onclose = function (evt) {

    }

    let canvas = document.getElementById("radar");
    canvas.width = CAM_W;
    canvas.height = CAM_H;
    let ctx = canvas.getContext("2d");

    // common vars
    let hw = canvas.width / 2.0;
    let hh = canvas.height / 2.0;
    let hhfov = CAM_HFOV / 2.0;
    let hvfov = CAM_VHOV / 2.0;

    const fnDraw = function (ac) {
        let delta = calcDelta(ac);

        let dx = Math.min(canvas.width, Math.max(0.0, hw - (hw * (delta.bearing / hhfov))));
        let dy = Math.min(canvas.width, Math.max(0.0, hh - (hh * (delta.elevation / hvfov))));
        ctx.strokeRect(dx - MarkerSize, dy - MarkerSize, MarkerSize * 2, MarkerSize * 2);
        ctx.fillRect(dx - MarkerPointSize, dy - MarkerPointSize, MarkerPointSize * 2, MarkerPointSize * 2);

        let title = `${ac.callsign}`;
        let csSize = ctx.measureText(title);
        ctx.fillText(title, dx - (csSize.width / 2.0), dy - MarkerSize - 5);

        if (Calibrate) {
            ctx.fillText(`E: ${delta.elevation.toFixed(3)}${DEG}`, dx, dy + MarkerSize + FontSpacing);
            ctx.fillText(`B: ${delta.bearing.toFixed(3)}${DEG}`, dx, dy + MarkerSize + (FontSpacing * 2));
        }
        ctx.fillText(`A: ${ac.altitude.toLocaleString()} ${ac.unit === Decoder.UNIT_METERS ? "m" : "ft"}`, dx + MarkerSize + 2, dy - MarkerSize + FontSpacing);
        ctx.fillText(`D: ${(delta.dist / 1000.0).toFixed(1)} KM`, dx + MarkerSize + 2, dy - MarkerSize + (FontSpacing * 2));
    }

    setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = Font;
        ctx.fillStyle = ctx.strokeStyle = IS_NIGHT ? "#5eff00" : "#5eff00";

        if (Compass) {
            //draw horizon 
            ctx.beginPath();
            ctx.moveTo(0, hh);
            ctx.lineTo(canvas.width, hh);
            ctx.stroke();

            //draw elevation
            if (RelativeDeg) {
                ctx.beginPath();
                ctx.moveTo(hw, 0);
                ctx.lineTo(hw, canvas.width);
                ctx.stroke();
            }

            //draw bearing markers
            let hozMod = Math.ceil(hhfov / HozDeg);
            for (let x = -(hozMod * HozDeg); x < hozMod * HozDeg; x += HozDeg) {
                if (RelativeDeg && x === 0) continue;

                let direction = Ned.fromDistanceBearingElevation(300.0, x, 0);
                let bearMarker = CAM_POS.destinationPoint(direction);

                let delta = CAM_POS.deltaTo(bearMarker);
                let dx = hw + (hw * ((delta.bearing > CAM_BEARING ? delta.bearing - 360 : delta.bearing) / hhfov));

                ctx.beginPath();
                ctx.moveTo(dx, hh - 10);
                ctx.lineTo(dx, hh + 10);
                ctx.stroke();
                if (RelativeDeg) {
                    let label = x.toFixed(0);
                    let lSize = ctx.measureText(label);
                    ctx.fillText(`${label}${DEG}`, dx - (lSize.width / 2.0), hh - FontSpacing);
                }
                let labelA = (CAM_BEARING + x).toFixed(0);
                let laSize = ctx.measureText(labelA);
                ctx.fillText(`${labelA}${DEG}`, dx - (laSize.width / 2.0), hh + (FontSpacing * 2));
            }

            //draw bearing markers
            if (RelativeDeg) {
                let virMod = Math.ceil(hvfov / VirDeg);
                for (let y = -(virMod * VirDeg); y < (virMod * VirDeg); y += VirDeg) {
                    if (y === 0) continue;
                    let bearMarker = CAM_POS.destinationPoint(Ned.fromDistanceBearingElevation(300.0, 0, y));

                    let delta = CAM_POS.deltaTo(bearMarker);
                    //let dx = hw - (hw * (delta.bearing / hhfov));
                    let dy = hh - (hh * (delta.elevation / hvfov));

                    ctx.beginPath();
                    ctx.moveTo(hw - (FontSize / 2.0), dy);
                    ctx.lineTo(hw + (FontSize / 2.0), dy);
                    ctx.stroke();
                    let label = `${y}`;
                    ctx.fillText(`${label}${DEG}`, hw + FontSpacing, dy + 4);
                }
            }
        }
        for (let ac of store.getAircrafts()) {
            if (ac.lat !== 0 && ac.lng !== 0) {
                fnDraw(ac);
            }
        }
    }, 500);
}

StartAVR();