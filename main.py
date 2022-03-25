import pygame as pg 
from pygame.locals import *
import sys, json

from forier_series import ForierSeries
from constants import *

image = "rimuru.svg"
with open("presets.json", "r") as file:
    settings = json.loads(file.read())[image]

pg.init()
clock = pg.time.Clock()
screen = pg.display.set_mode((width, height))
pg.display.set_caption("Complex Forier Series")

series = ForierSeries("paths/" + image, settings, screen)
fps = series.settings["fps"]

while True:
    for event in pg.event.get():
        if event.type == QUIT:
            pg.quit()
            sys.exit()

    screen.fill(Color.black)

    series.main()

    pg.display.flip()
    clock.tick(fps)