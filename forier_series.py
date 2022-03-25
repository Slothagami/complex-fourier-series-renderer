import pygame as pg 
from cmath import *
from read_svg import PathReader
from constants import *

class ForierSeries:
    def __init__(self, img, settings, screen):
        self.path = PathReader(img)
        self.screen = screen

        #region default settings
        settings.setdefault("time_step", 5e-3)
        settings.setdefault("scale", 1)
        settings.setdefault("constants", 70)
        settings.setdefault("intergral_precision", 150)
        settings.setdefault("fps", 24)
        settings.setdefault("steps_per_frame", 1)
        settings.setdefault("fade_line", True)
        #endregion
        self.settings = settings

        self.time = 0
        self.prev_pt = 0
        self.scale = settings["scale"]
        self.timestep = settings["time_step"]
        self.fade_line = settings["fade_line"]
        self.frame_steps = settings["steps_per_frame"]

        self.trace_surf = pg.Surface((width, height))
        self.const_terms = self.constants(self.path.point, 1, settings["constants"])

    def main(self):
        for step in range(self.frame_steps):
            pos = 0
            p_pos = pos
            self.time += self.timestep

            # surface for the rotating vectors
            vect_surf = pg.Surface((width, height), pg.SRCALPHA, 32)
            circle_surf = pg.Surface((width, height), pg.SRCALPHA, 32)

            for n, const in enumerate(self.const_terms):
                if n != 0:
                    for term in [0,1]:
                        sign = 1 if term == 0 else -1
                        pos += const[term] * exp(complex(0,sign * 2*pi * n * self.time))

                        if step == self.frame_steps-1:
                            t_pos = self.to_screen(pos)
                            t_ppos = self.to_screen(p_pos)

                            line(vect_surf, t_ppos, t_pos, Color.red)
                            circle(circle_surf, t_ppos, abs(const[term]) * self.scale)
                        
                        p_pos = pos

        pos = self.to_screen(pos)

        if self.fade_line:
            # fade to black
            surf = pg.Surface((width, height))
            surf.set_alpha(1)
            surf.fill(Color.black)
            self.trace_surf.blit(surf, (0,0)) # draw onto surface

        if self.prev_pt != 0:
            line(self.trace_surf, self.prev_pt, pos, Color.white, width=2)

        self.prev_pt = pos

        self.screen.blit(self.trace_surf, (0,0))

        circle_surf.blit(vect_surf, (0,0))
        self.screen.blit(circle_surf, (0,0))

    def to_screen(self, z):
        center = complex(width/2, height/2)
        return z * self.scale + center

    def constants(self, func, domain, n_constants): 
        # returns the constants in the order 0, [1, -1], [2, -2], [3, -3] ...
        constants = []
        for n in range(n_constants):
            if n % 50 == 0:
                percent = n/n_constants * 100
                rounded = int(percent * 10)/10
                print(f"Computing Constants: {rounded}%")

            averages = []
            averages.append(self.average_function(
                lambda x: func(x) * self.rotate_cycles(n, x), domain))

            if n != 0:
                averages.append(self.average_function(
                    lambda x: func(x) * self.rotate_cycles(-n, x), domain))

            constants.append(tuple(averages))

        print(f"Computing Constants: 100%")
        return constants

    def average_function(self, func, domain, precision=1000):
        # averages the value of the function from 0 to %domain%
        # precision is samples PER UNIT
        sum = 0
        t = 0
        while t <= domain:
            sum += func(t)
            t += 1/precision
        
        return sum / (precision * domain)

    def rotate_cycles(self, n_cycles, x):
        return exp(complex(0, n_cycles * 2*pi * x ))
