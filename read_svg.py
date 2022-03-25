from svgpathtools import svg2paths, parse_path

class PathReader:
    def __init__(self, file):
        paths, attr = svg2paths(file)
        self.data = attr[0]["d"]
        self.path = parse_path(self.data)

    def point(self, percentage):
        return self.path.point(percentage)