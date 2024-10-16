import { v4 as uuidv4 } from 'uuid';

export const cards = [
    {
        id: uuidv4(),
        front: 'Cauchy’s Mean Value Theorem',
        back: `The Cauchy's Mean Value Theorem states that if functions $f$ and $g$ are both continuous on the closed interval $[a, b]$ and differentiable on the open interval $(a, b)$, then there exists at least one point $c$ in $(a, b)$ such that:
        \\[
        \\frac{f'(c)}{g'(c)} = \\frac{f(b) - f(a)}{g(b) - g(a)}
        \\]
        This theorem generalizes the mean value theorem by including two functions.`
    },
    {
        id: uuidv4(),
        front: 'Bernoulli’s Equation',
        back: `In fluid dynamics, Bernoulli's equation describes the conservation of mechanical energy in a flowing fluid:
        \\[
        P + \\frac{1}{2} \\rho v^2 + \\rho gh = \\text{constant}
        \\]
        Where $P$ is the pressure, $\\rho$ is the fluid density, $v$ is the velocity, $g$ is the acceleration due to gravity, and $h$ is the height.`
    },
    {
        id: uuidv4(),
        front: 'Pythagoras Theorem',
        back: `The Pythagoras theorem applies to right-angled triangles. It states that the square of the hypotenuse is equal to the sum of the squares of the other two sides:
        \\[
        a^2 + b^2 = c^2
        \\]
        Where $c$ is the hypotenuse, and $a$ and $b$ are the other two sides.`
    },
    {
        id: uuidv4(),
        front: 'Quadratic Formula',
        back: `The quadratic formula provides the solution(s) to the quadratic equation:
        \\[
        ax^2 + bx + c = 0
        \\]
        The solutions are given by:
        \\[
        x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
        \\]`
    },
    {
        id: uuidv4(),
        front: 'Definition of a Limit',
        back: `In calculus, the limit of a function is a fundamental concept. It describes the behavior of a function as its argument approaches a particular point. The formal definition of a limit is:
        \\[
        \\lim_{{x \\to c}} f(x) = L
        \\]
        This means that as $x$ approaches $c$, the function $f(x)$ gets arbitrarily close to $L$.`
    },
    {
        id: uuidv4(),
        front: 'Euler’s Identity',
        back: `Euler's identity is a special case of Euler's formula:
        \\[
        e^{i\\pi} + 1 = 0
        \\]
        This equation connects five of the most important constants in mathematics: the number 0, the number 1, the number pi ($\\pi$), the number $e$, and the imaginary unit $i$.`
    },
    {
        id: uuidv4(),
        front: 'Fundamental Theorem of Calculus',
        back: `The Fundamental Theorem of Calculus links the concept of the derivative of a function with the concept of the integral. It states that if $F$ is an antiderivative of a continuous function $f$ on an interval $[a, b]$, then:
        \\[
        \\int_a^b f(x) dx = F(b) - F(a)
        \\]
        This theorem forms the foundation for much of integral calculus.`
    }
];
