# NanoPlay
# 
# Copyright (C) Subnodal Technologies. All Rights Reserved.
# 
# https://nanoplay.subnodal.com
# Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.

import os
import shutil
import pathlib
import base64
import json

if os.path.exists("dist") and os.path.isdir("dist"):
    shutil.rmtree("dist")

pathlib.Path("dist").mkdir(parents = True, exist_ok = True)

constructedJson = {}

for file in os.listdir("build"):
    constructedJson[file] = base64.b64encode(open(os.path.join("build", file), "r").read().encode("utf-8")).decode("utf-8")

json.dump(constructedJson, open(os.path.join("dist", "npupdate.json"), "w"))