// p5.js functions to display the game:
let canvas, background_image, wheel_image, canon_body_image,
    fps, single_ball, ball_image, tower_image, slider_angle, button_launch,
    slider_power, history_console, console_text, button_reset, button_launch_gen,
    angle_text, power_text, precision_text, slider_precision, button_algo_gen, current_gen_data, button_sort;
let app_mode = 'init';
let generation ;
let canon_height = 60;
let response;
let population = [];

function preload() {
    background_image = loadImage('/static/images/background.png');
    wheel_image = loadImage('/static/images/wheel.png');
    canon_body_image = loadImage('/static/images/canon_body.png');
    ball_image = loadImage('/static/images/ball.png');
    tower_image = loadImage('/static/images/tower.png')
}
function setup(){
    fps = 30;
    frameRate(fps);

    canvas = createCanvas(background_image.width, background_image.height);
    canvas.position((windowWidth-background_image.width)/2, (windowHeight-background_image.height)/2);

    angle_text = createP();
    angle_text.html('ANGLE: ');
    angle_text.position(50, (windowHeight/2)-100);
    slider_angle = createSlider(0,60, 0, 1);
    slider_angle.position(130, (windowHeight/2)-85);

    power_text = createP();
    power_text.html('POWER: ');
    power_text.position(50, (windowHeight/2)-50);
    slider_power = createSlider(60,120, 0, 1);
    slider_power.position(130, (windowHeight/2)-35);

    precision_text = createP();
    precision_text.html('SEUIL: ');
    precision_text.position(50, (windowHeight/2));
    slider_precision = createSlider(0,100, 0, 1);
    slider_precision.position(130, (windowHeight/2)+15);

    button_launch = createButton('TIRER');
    button_launch.position(50, (windowHeight/2)+65);
    button_launch.mousePressed(fire);

    button_reset = createButton('RESET');
    button_reset.position(190, (windowHeight/2)+65);
    button_reset.mousePressed(reset_game);


    button_launch_gen = createButton('TIR MULTIPLE');
    button_launch_gen.position(190, (windowHeight/2)+115);
    button_launch_gen.mousePressed(multiple_launch);

    button_algo_gen = createButton('ALGO_GEN');
    button_algo_gen.position(50, (windowHeight/2)+115);
    button_algo_gen.mousePressed(step_gen);

    button_sort = createButton('TRIER');
    button_sort.position(50, (windowHeight/2)+165);
    button_sort.mousePressed(sort_generation);

    generation = new Generation(background_image.height-500);

    console_text = {'title': '<h3><u>Historique: </u></h3>',
        'all_shots':'',
        'sort_shots':'',
        'best_shots':''};
    history_console = createP();
    history_console.html(console_text['title']);
    history_console.position(windowWidth-300, 100)
}
function draw(){
    // First, display background:
    push();
    image(background_image, 0, 0);
    image(tower_image, background_image.width - 300, background_image.height-500);
    pop();


    // Depending on app mode (single_fire or multiple_fire)
    if(app_mode =='single_fire'){
        single_ball.draw();
    }else if (app_mode == 'multiple_fire'){
        generation.candidates.forEach(elt =>  elt.draw())
    }
    // Then display canon with particular angle value:
    push();
    angleMode(DEGREES);
    scale(0.7);
    translate(130, 770);
    rotate(-slider_angle.value());
    imageMode(CENTER);
    image(canon_body_image, 0, 0);
    pop();
    push();

    push();
    scale(0.7);
    imageMode(CENTER);
    image(wheel_image, 135, 822);
    pop();

    if(slider_precision.value() != 0){
        // Draw goal
        push();
        rectMode(CENTER);
        translate(background_image.width - 200,590);
        stroke('black');
        strokeWeight(2);
        line(-slider_precision.value()/2, 0, slider_precision.value()/2, 0);
        pop();
        push();
        stroke('black');
        strokeWeight(2);
        translate(background_image.width - 200  - slider_precision.value()/2,590 - 5);
        line(0,0, 0, 10);
        pop();
        push();
        translate(background_image.width - 200 + slider_precision.value()/2 ,590 - 5);
        stroke('black');
        strokeWeight(2);
        line(0,0, 0, 10);
        pop();
    }
}
function windowResized(){
    canvas = createCanvas(background_image.width, background_image.height);
}
function fire(){
    single_ball = new Ball(slider_angle.value(), slider_power.value(),
        canon_height, background_image.width - 200, slider_precision.value()/2);
    app_mode = 'single_fire';
    generation.add_candidate(single_ball);
    update_console();
}

function multiple_launch(){
    generation.reset_candidates();
    app_mode = 'multiple_fire';
}
function update_console(){
    console_text['all_shots'] = generation.to_html();
    console_text['sort_shots'] = '<h3><u>Candidats triés:</u> </h3> [' + str(generation.sort_candidates()) + ']';
    console_text['best_shots'] = '<h3><u>Candidats gagnants:</u> </h3> [' + str(generation.list_of_solutions_html()) + ']';
    let html_str = console_text['title']+console_text['all_shots']+console_text['sort_shots']+console_text['best_shots'];
    history_console.html(html_str)
}
function reset_game(){
    console_text['all_shots'] = '';
    console_text['sort_shots'] = '';
    console_text['best_shots'] = '';
    update_console();
    generation.reinit();
}
function step_gen(){
    console.log("BEFORE:", population);
    reset_game();
    $.ajax({
      url: '/step_gen',
      dataType: 'json',
      async: false, type:'POST',
      data: {pop: population},
      success: function(data) {
        response = data;
      }
    });
    console.log("RESPONSE:", response);
    response.forEach(elt => {
        generation.add_candidate(new Ball(elt[0], elt[1], canon_height,background_image.width - 200,
                slider_precision.value()/2))});
    update_console();
    population = generation.params_sort_population();
    console.log("New population sort:", population);
    multiple_launch();
}
function sort_generation() {
    let useless = generation.params_sort_population();
    console_text['all_shots'] = '';
    console_text['sort_shots'] = '';
    console_text['best_shots'] = '';
    update_console();
}