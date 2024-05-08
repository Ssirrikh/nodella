
// const NODE_EMITTER = 0;
// const NODE_COUNTER = 1;
// const NODE_REPEATER_ALL = 2;
// const NODE_REPEATER_ROUND_ROBIN = 3;
// const NODE_REPEATER_RANDOM = 4;

class Wire { // standard wire
    constructor (graph,length,v1,v2) {
        this.graph = graph;
        this.length = length;
        this.v1 = v1;
        this.v2 = v2;
        this.powered = false;
        this.pulses = [];
    }
    reset () {
        this.powered = false;
        this.pulses = [];
    }
    power () {
        this.powered = true;
    }
    tick () {
        if (this.powered) {
            this.powered = false;
            this.pulses.push(0);
        }
        for (let i = 0; i < this.pulses.length; i++) {
            this.pulses[i]++;
        }
        if (this.pulses[0] >= this.length) {
            this.pulses.shift();
            this.graph.nodes[this.v2].power();
        }
    }
}
class Node { // repeater node
    constructor (graph,type) {
        this.graph = graph;
        this.in = [];
        this.out = [];
        this.powered = false;
    }
    reset () {
        this.powered = false;
    }
    power () {
        this.powered = true;
    }
    tick () {
        if (this.powered) {
            this.powered = false;
            for (let wire of this.out) {
                this.graph.wires[wire].power();
            }
        }
    }
}

class StateGraph {
    constructor () {
        this.emitters = [];
        this.nodes = [];
        this.wires = [];
    }
    addNode () {
        this.nodes.push( new Node(this) );
    }
    addWire (length,v1,v2) {
        if (v1 >= this.nodes.length || v2 >= this.nodes.length) {
            console.error(`Invalid wire between ${v1} and ${v2}, highest node is ${this.nodes.length}.`);
            return;
        }
        if (v1 == v2) {
            console.error(`Invalid wire, cannot self-target ${v1}.`);
            return;
        }
        this.nodes[v1].out.push(this.wires.length);
        this.nodes[v2].in.push(this.wires.length);
        this.wires.push( new Wire(this,length,v1,v2) );
    }
    reset () {
        for (const node of this.nodes) {
            node.reset();
        }
        for (const wire of this.wires) {
            wire.reset();
        }
        for (let i of this.emitters) {
            this.nodes[i].power();
        }
    }
    tick () {
        for (const node of this.nodes) {
            node.tick();
        }
        for (const wire of this.wires) {
            wire.tick();
        }
    }
}



let testGraph = new StateGraph();
testGraph.addNode(); // e0: emitter
testGraph.addNode(); // r0: repeater
testGraph.addWire(4, 0,1); // w0: emitter -> repeater
testGraph.addWire(4, 1,0); // w1: repeater -> emitter

function testReadout () {
    console.log('e0: ' + (testGraph.nodes[0].powered?'1':'0'));
    console.log('w0: ' + testGraph.wires[0].pulses.toString());
    console.log('r0: ' + (testGraph.nodes[1].powered?'1':'0'));
    console.log('w1: ' + testGraph.wires[1].pulses);
}
function testReset (emitters=[]) {
    testGraph.emitters = emitters;
    testGraph.reset();
    testReadout();
}
function testTick () {
    testGraph.tick();
    testReadout();
}

testReset([0,1]);



