from flask import Flask, render_template, request, jsonify
from math import floor
import random
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('app.html')


@app.route('/step_gen', methods=['POST'])
def step_gen():
    if request.method == 'POST':
        generation = []
        print(request.form)
        for i in range(len(request.form)):
            solution = request.form.getlist('pop['+str(i)+'][]')
            generation.append([float(s) for s in solution])
        if generation == []:
            # generation empty if first call to genetic algorithm
            # init randomly algo:
            print("new generation aha")
            generation = [[random.uniform(0, 20), random.uniform(60, 70)] for i in range(10)]
            return jsonify(generation)
        data = step(generation)
        return jsonify(data)


def step(generation):
    print("CALL TO STEP FUNCTION")
    print("INITIAL GEN: ", generation)
    print("INITIAL GEN SIZE: ", len(generation))
    initial_size = len(generation)
    reste = initial_size % 3
    third_size = (initial_size - reste)//3
    generation = generation[:third_size]
    print("NUMBER OF GOOD SOLUTIONS KEPT:", len(generation))
    new_solution = []
    for sol in generation:
        random_choice = random.random()
        # print(random_choice)
        if random_choice < 0.33:
            # First params is updated
            new_solution.append([(1+random.uniform(-0.3, 0.3))*sol[0], sol[1]])
        elif random_choice>0.66:
            # Second params is updated
            new_solution.append([sol[0], (1 + random.uniform(-0.3, 0.3)) * sol[1]])
        else:
            # Both params ara updated
            new_solution.append([(1+random.uniform(-0.3, 0.3))*sol[0], (1 + random.uniform(-0.3, 0.3)) * sol[1]])
    print("BEST KEPT", generation)
    generation = generation + new_solution
    print("GENERATION WITH MUTANTS:", generation)
    generation = generation + [[random.uniform(0, 60), random.uniform(60, 120)] for i in range(third_size + reste)]
    print("FINAL GEN:", generation)
    print("NEW SIZE:", len(generation))
    return generation


if __name__ == '__main__':
    app.run(debug=True)
