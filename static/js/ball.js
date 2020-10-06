// @TODO: add distance to the ball
// @TODO: set color to final cross
// @TODO: if y sort du terrain evaluate height and display cross to this height

class Ball {
    constructor(v0_angle, power, canon_height, target, threshold){
        this.v0_angle = v0_angle*Math.PI/180;
        this.v0_power = power;
        this.final_pos = createVector(0,0);
        this.position = createVector(0, 0);
        this.base = createVector(0,0);
        this.g = 9.8;
        this.canon_height = canon_height;
        this.target = target;

        this.canon_height = canon_height;
        this.origin_x = 70;
        this.offset_y = 590;
        this.origin_y = this.offset_y - this.canon_height;
        this.is_moving = true;
        this.threshold = threshold;

        this.A = -this.g / (2*(Math.pow(this.v0_power*Math.cos(this.v0_angle), 2)));
        this.B = Math.tan(this.v0_angle);
        let delta = (this.B ** 2) - (4*this.A*this.canon_height);
        if(delta <0 ){
            console.warn("Waaait whattt ? ", delta)
        }else{
            this.final_pos.x = (-this.B - Math.sqrt(delta)) / (2*this.A);
            if(this.final_pos.x + this.origin_x > background_image.width){
                // If canon gets out of field, cross at correct height:
                let x = background_image.width-this.origin_x;
                this.final_pos.y = this.A*(x**2);
                this.final_pos.y += this.B*x;
            }else{
                this.final_pos.y = -this.canon_height;
            }
            // Compute reward:
            this.final_dist = Math.abs(this.final_pos.x - (this.target - this.origin_x));
            if(this.final_dist < this.threshold){
                this.color = 'green';
                this.status = true;
            }else{
                this.color = 'black';
                this.status = false;
            }
        }
    }
    move(){
        if((this.position.y > -this.canon_height) && (this.position.x < background_image.width - this.origin_x)){
            this.position.x += this.v0_power*Math.cos(this.v0_angle) / (0.1*fps);
            // this.position.y = (-this.g*(Math.pow(this.position.x/(this.v0_power*Math.cos(this.v0_angle)),2))*0.5);
            this.position.y = Math.pow(this.position.x,2)*this.A;
            this.position.y += this.position.x*this.B;
        }else{
            this.is_moving = false;
        }
    }
    draw(){
        if(this.is_moving){
            this.move();
            push();
            translate(this.position.x + this.origin_x, this.origin_y - this.position.y);
            imageMode(CENTER);
            image(ball_image, 0, 0);
            pop();

        }else{
            push();
            if(this.final_pos.y != -this.canon_height){
                translate(background_image.width, this.origin_y - this.final_pos.y);
            }else{
                translate(this.origin_x + this.final_pos.x, this.origin_y - this.final_pos.y - 10);
            }
            stroke(this.color);
            strokeWeight(3);
            line(-10,0, 10, 20);
            line(10, 0, -10, 20);
            pop();
        }
    }
    reinit(){
        this.position.set(0,0);
        this.is_moving = true;
    }
}