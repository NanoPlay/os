# NanoPlay
# 
# Copyright (C) Subnodal Technologies. All Rights Reserved.
# 
# https://nanoplay.subnodal.com
# Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.

import os
import shutil
import pathlib
import subprocess
import json

def minify(a, b, isJson = False):
    if isJson:
        json.dump(json.load(open(a, "r")), open(b, "w"), separators = (",", ":"))
    else:
        subprocess.Popen(["terser", a, "-o", b, "-m"]).communicate()

def copy(a, b):
    inputCode = open(a, "r").read()
    outputFile = open(b, "w")

    outputFile.write(inputCode)
    outputFile.close()

if os.path.exists("build") and os.path.isdir("build"):
    shutil.rmtree("build")

pathlib.Path("build").mkdir(parents = True, exist_ok = True)

for path, directories, files in os.walk("."):
    for file in files:
        if file == "boot.js":
            minify(os.path.join(path, file), os.path.join("build", ".bootrst"))
        elif file.endswith(".js") and not file.endswith(".excl.js"):
            if file.endswith(".keep.js"):
                copy(os.path.join(path, file), os.path.join("build", file.split(".")[0]))
            else:
                minify(os.path.join(path, file), os.path.join("build", file.split(".")[0]))
        elif file.endswith(".json"):
            minify(os.path.join(path, file), os.path.join("build", file), True)