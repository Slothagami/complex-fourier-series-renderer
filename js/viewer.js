/* Js has automatic Antialiasing */
var canv, c, fps = 24
window.addEventListener("load", () => {
    canv = document.querySelector("canvas")
    c = canv.getContext("2d")
    
    const resize = ()=> {
        canv.width  = window.innerWidth
        canv.height = window.innerHeight
    }
    resize()
    document.addEventListener("resize", resize)
    
    init()
    setInterval(main, 1000 / fps)
})

const BG_COLOR = "#000000"

var file = "pi.js",
    constants = [],
    time = 0,
    lineCanvas, cLine,
    constructionCanv, cConstr

function init() {
    //#region Load Data
    // Load DATA from "../paths/computed/*.js"
    let script = document.createElement("script")
        script.src = "../paths/computed/" + file 
        
    script.onload = () => {
        // console.log(DATA)
        // load the constats as the Complex() class
        for(let set of DATA.constants) {
            let newSet = []
            for(let vector of set) {
                newSet.push(Complex.fromArray(vector))
            }
            constants.push(newSet)
        }
    }
    
    document.body.appendChild(script)
    //#endregion
    
    //#region setup canvas
    // Line Canv
    lineCanvas = document.createElement("canvas")
    lineCanvas.width = canv.width
    lineCanvas.height = canv.height

    cLine = lineCanvas.getContext("2d")

    // Construction canv
    constructionCanv = document.createElement("canvas")
    constructionCanv.width = canv.width
    constructionCanv.height = canv.height

    cConstr = constructionCanv.getContext("2d")
    //#endregion

    // Prefill Bg to stop ghost lines
    cLine.fillStyle = BG_COLOR + "ff"
    cLine.fillRect(0,0, canv.width, canv.height)
}

var prev_pos = Complex.zero
function main() {
    for(let step = 0; step < DATA.settings.steps_per_frame; step++) {
        // Render Animation
        pos = Complex.zero
        cConstr.clearRect(0,0, canv.width,canv.height)
        
        let constr_prev_pos = Complex.zero
        for(let n = 1; n < constants.length; n++) {
            let set = constants[n]

            for(let c = 0; c < set.length; c++) {
                let constant = set[c]
                let sign = 2 * (c - .5)

                let exp = Complex.exp(time*sign* 2*Math.PI *n)
                let vector = Complex.mult(constant, exp)
                pos = Complex.add(pos, vector)
                
                if(step == DATA.settings.steps_per_frame - 1) {
                    // draw construction
                    cConstr.strokeStyle = "#777"
                    line(screenMap(constr_prev_pos), screenMap(pos), cConstr)
                }

                constr_prev_pos = pos
            }
        }
        time += DATA.settings.time_step
        pos = screenMap(pos)

        // draw line
        if(prev_pos != Complex.zero) {
            if(DATA.settings.fade_line) {
                cLine.fillStyle = BG_COLOR + "04"
                cLine.fillRect(0,0, canv.width,canv.height)
            }

            cLine.strokeStyle = "white"
            line(prev_pos, pos, cLine, 2)
        }

        prev_pos = pos
    }
    c.clearRect(0,0, canv.width, canv.height)
    c.drawImage(lineCanvas, 0,0)
    c.drawImage(constructionCanv, 0,0)
}

function screenMap(z) {
    z = Complex.mult(DATA.settings.scale, z)
    z = Complex.sum(z, new Complex(canv.width/2, canv.height/2))
    return z
}

function line(z1, z2, canvas, width=1) {
    canvas.beginPath()
        canvas.lineWidth = width
        canvas.moveTo(z1.real, z1.imag)
        canvas.lineTo(z2.real, z2.imag)
    canvas.stroke()
}