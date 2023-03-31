const PI = 3.14159;

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");
const INTERNAL_CANVAS_WIDTH = canvas.width;
const INTERNAL_CANVAS_HEIGHT = INTERNAL_CANVAS_WIDTH;
canvas.style.width = INTERNAL_CANVAS_WIDTH;
canvas.style.height = INTERNAL_CANVAS_WIDTH;
const SCALE = 4;
const CANVAS_WIDTH = INTERNAL_CANVAS_WIDTH * SCALE;
const CANVAS_HEIGHT = INTERNAL_CANVAS_HEIGHT * SCALE;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const CANNON_LENGTH = 20;
const CANNON_POSITION = [CANVAS_WIDTH / 2, 3 / 4 * CANVAS_HEIGHT];
const MAX_POWER = 500;
const GRAVITY = 100;
const NR_OF_TRAJECTORY_STEPS = 1000;


class Cannon {
    constructor(position) {
        this.position = position;
        this.angle = angle_from_slider_value(1350);
        this.power = power_from_slider_value(200);
        this.dt = dt_from_slider_value(0);
    }
    draw() {
        this.draw_cannon();
        this.draw_trajectory();
    }
    draw_cannon() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let x = this.angle;
        let L = CANNON_LENGTH;
        let pos_i = this.position;
        let pos_f = [pos_i[0] + L * Math.cos(x), pos_i[1] + L * Math.sin(x)];
        draw_line(pos_i, pos_f);
    }
    draw_trajectory() {
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        let trajectory = calculate_trajectory(this.position, this.angle, this.power, this.dt);
        for (let i = 1; i < trajectory.length; i++) {
            let pos_i = trajectory[i - 1];
            let pos_f = trajectory[i];
            draw_line(pos_i, pos_f);
        }
    }
}

function calculate_trajectory(position, angle, power, dt) {
    let pos = position;
    let vel = [power * Math.cos(angle), power * Math.sin(angle)];
    let trajectory = [pos];
    // Do simple explicit Euler forwarding.
    for (let i = 0; i < NR_OF_TRAJECTORY_STEPS; i++) {
        let force = [0, -GRAVITY];
        vel = [vel[0] + force[0] * dt, vel[1] + force[1] * dt];
        pos = [pos[0] - vel[0] * dt, pos[1] - vel[1] * dt]
        trajectory.push(pos);
    }
    return trajectory;
}

function draw_line(pos_i, pos_f) {
    ctx.beginPath();
    ctx.moveTo(pos_i[0], pos_i[1]);
    ctx.lineTo(pos_f[0], pos_f[1]);
    ctx.stroke();
}

function clear_canvas() {
    ctx.fillRect(0, 0, SCALE * CANVAS_WIDTH, SCALE * CANVAS_HEIGHT);
}

const angle_from_slider_value = (value) => value / 3600 * 2 * PI;
const power_from_slider_value = (value) => value / 1000 * MAX_POWER;
const dt_from_slider_value = (value) => Math.pow(10, (value - 5000) / 10000);

function main() {
    let cannon = new Cannon(CANNON_POSITION);
    cannon.draw();

    // Setup slider 1: Cannon angle.
    var angle_slider = document.getElementById("angle_slider");
    var onAngleInput = () => {
        clear_canvas();
        cannon.angle = angle_from_slider_value(angle_slider.value);
        cannon.draw();
    };
    angle_slider.addEventListener('input', onAngleInput, false);

    // Setup slider 2: Cannon shooting power.
    var power_slider = document.getElementById("power_slider");
    var onPowerInput = () => {
        clear_canvas();
        cannon.power = power_from_slider_value(power_slider.value);
        cannon.draw();
        cannon.draw_trajectory();
    };
    power_slider.addEventListener('input', onPowerInput, false);

    // Setup slider 2: Cannon shooting power.
    var dt_slider = document.getElementById("dt_slider");
    var onDtInput = () => {
        clear_canvas();
        cannon.dt = dt_from_slider_value(dt_slider.value);
        cannon.draw();
        cannon.draw_trajectory();
    };
    dt_slider.addEventListener('input', onDtInput, false);
}
main()
