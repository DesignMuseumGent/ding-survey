import glob
import pandas as pd
# All files ending with .txt
files = glob.glob("./feedback/*.json")

for file in files:
    pd.read_json(file)
