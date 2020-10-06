class Generation {
    constructor(target_dist){
        this.candidates = [];
        this.target = target_dist;
    }
    add_candidate(candidate){
        this.candidates.push(candidate)
    }
    reset_candidates(angle){
        this.candidates.forEach(elt => elt.reinit())
    }
    reinit(){
        this.candidates = [];
    }
    to_html(){
        // this.candidates.sort((a, b) => a.final_dist - b.final_dist);
        let text = '<ul>';
        this.candidates.forEach(elt =>
        {text += '<li>'+str((elt.v0_angle*180/Math.PI).toFixed(2))+
            '° | '+str(elt.v0_power.toFixed(2))+' | '+str(elt.final_dist.toFixed(2));
        if(elt.status){text+=' | &#9989 </li>';}else{text+=' | &#10060;</li>'}}
            );
        text += '</ul>';
        return text
    }
    sort_candidates(){
        let sorted_candidates = [];
        this.candidates.forEach(elt => {sorted_candidates.push(elt.final_dist.toFixed(0))});
        sorted_candidates = sorted_candidates.sort((a, b) => a - b);
        return sorted_candidates
    }
    list_of_solutions_html(){
        let solutions = [];
        this.candidates.forEach(elt=>{if(elt.status){
            let sol = '(' + str((elt.v0_angle*180/Math.PI).toFixed(2)) + ' | ' + str(elt.v0_power.toFixed(2)) + ')';
            solutions.push(sol)
            }
        });
        return solutions
    }
    params_sort_population(){
        let sol = [];
        this.candidates.sort((a, b) => a.final_dist - b.final_dist);
        this.candidates.forEach(elt=>sol.push([elt.v0_angle*180/Math.PI, elt.v0_power]));
        return sol
    }
}
