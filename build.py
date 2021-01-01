# NanoPlay
# Copyright (C) Subnodal Technologies. All Rights Reserved.
# https://nanoplay.subnodal.com
# Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.

import os
import shutil
import pathlib
import jsmin

def minify(a, b):
    inputCode = open(a, "r").read()
    outputCode = jsmin.jsmin(inputCode)

    outputFile = open(b, "w")

    outputFile.write(outputCode)
    outputFile.close()

def copy(a, b):
    inputCode = open(a, "r").read()
    outputFile = open(b, "w")

    outputFile.write(inputCode)
    outputFile.close()

shutil.rmtree("build")
pathlib.Path("build").mkdir(parents = True, exist_ok = True)

for path, directories, files in os.walk("."):
    for file in files:
        if file == "boot.js":
            minify(os.path.join(path, file), os.path.join("build", ".bootcde"))
        elif file.endswith(".js") and not file.endswith(".excl.js"):
            if file.endswith(".keep.js"):
                copy(os.path.join(path, file), os.path.join("build", file.split(".")[0]))
            else:
                minify(os.path.join(path, file), os.path.join("build", file.split(".")[0]))
        elif file.endswith(".json"):
            copy(os.path.join(path, file), os.path.join("build", file))