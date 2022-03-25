import pygame as pg

pg.font.init()
font = pg.font.SysFont("Arial", 10)

class Color:
    black = (0,0,0)
    white = (255,255,255)
    red   = (186,45,64)
    blue  = (87, 163, 255)

    def gray(shade):
        return (shade, shade, shade)

width, height = 1024, 640

def circle(screen, pos, radius):
    pg.draw.circle(screen, (255,255,255,40), (pos.real, pos.imag), radius, width=1)

def line(surf, start, end, color, width=1):
    pg.draw.line(surf, color, (start.real, start.imag), (end.real, end.imag), width)

def text(surf, text):
    text_surf = font.render(text, False, Color.white)
    surf.blit(text_surf, 10, 10)