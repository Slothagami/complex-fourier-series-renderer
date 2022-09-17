class Complex {
    static i = new Complex(0, 1)
    static zero = new Complex(0)

    constructor(real, imag=0) {
        this.real = real
        this.imag = imag
    }

    print() {
        console.log(this.toString())
    }

    toString() {
        let out = ""

        let printimag = this.imag
        if(this.imag ==  1) printimag = ""
        if(this.imag == -1) printimag = "-"

        // Purely Real/Imaginary Cases
        if(this.imag == 0) {
            out = this.real
        }else if(this.real == 0) {
            out = printimag + "i"
        } else {
            // Complex Number Case
            let parts = [
                this.real, 
                (Math.abs(this.imag)==1? "": Math.abs(this.imag)) + "i"
            ]
            let delim = this.imag > 0? " + ": " - "
            out = parts.join(delim)
        }
        return out
    }

    // valueOf() {return Complex.abs(this)} // value used for addition


    angle() {
        return Math.atan2(this.imag, this.real)
    }

    static complexify(n) {
        // returns n as a complex class member
        if(n instanceof Complex) return n 
        return new Complex(n)
    }

    static add(a, b) {
        a = Complex.complexify(a)
        b = Complex.complexify(b)
        return new Complex(a.real + b.real, a.imag + b.imag)
    }

    static subtract(a, b) {
        a = Complex.complexify(a)
        b = Complex.complexify(b)
        return Complex.add(a, Complex.mult(-1, b))
    }

    static sum() {
        // add arbituarily many args
        let sum = Complex.zero
        for(let term of arguments) {
            sum = Complex.add(sum, term)
        }
        return sum
    }

    static single_mult(a, b) {
        a = Complex.complexify(a)
        b = Complex.complexify(b)
        return new Complex(
            a.real * b.real - a.imag * b.imag,
            a.real * b.imag + a.imag * b.real
        )
    }

    static mult(a) {
        // Multiply arbitraily many arguments
        let product = Complex.complexify(a)
        for(let i = 1; i < arguments.length; i++) {
            product = Complex.single_mult(product, arguments[i])
        }
        return product
    }

    static divide(a,b) {
        a = Complex.complexify(a)
        b = Complex.complexify(b)

        let denominator = b.real ** 2 + b.imag ** 2
        return new Complex(
            (a.real * b.real + a.imag * b.imag) / denominator,
            (a.imag * b.real - a.real * b.imag) / denominator
        )
    }

    static pow(z, power) {
        z = Complex.complexify(z)
        power = Complex.complexify(power)
        
        if(power.imag == 0) {
            power = power.real

            let sign = Math.sign(power)
            power = Math.abs(power)
    
            let prod = z
            for(let i = 0; i < power-1; i++) {
                prod = Complex.mult(prod, z)
            }
    
            if(sign == 1)  return prod
            if(sign == -1) return Complex.divide(1, prod)
        } else {
            // complex power
            if(z.imag != 0) throw "Complex base not yet implemented for complex power."
            z = z.real

            return Complex.mult(
                new Complex(z ** power.real),
                Complex.exp(power.imag * Math.log(z))
            )
        }

    }

    static exp(imaginary) { // expects imaginary component
        return new Complex(
            Math.cos(imaginary),
            Math.sin(imaginary)
        )
    }

    static abs(z) {
        return Math.hypot(z.real, z.imag)
    }

    static intergrate(func, lowBound, highBound, precision=50) {
        // intergrates the function over real inputs
        // Precision is sample points per unit
        let domain = highBound - lowBound
        precision *= domain
    
        let sum = Complex.zero
        for(let x = lowBound; x < highBound; x += domain / precision) {
            sum = Complex.add(sum, func(x))
        }
        return sum
    }

    static fromArray(arr) {
        return new Complex(arr[0], arr[1])
    }
}

class ComplexDraw {
    static line(z1, z2) {
        c.beginPath()
        c.moveTo(z1.real, z1.imag)
        c.lineTo(z2.real, z2.imag)
        c.stroke()
    }
}