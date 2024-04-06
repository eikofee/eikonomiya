import os

fileList = os.listdir(".")
for f in fileList:
    if ".png" in f or ".jpg" in f or ".jpeg" in f:
        print(f)
        s = f.replace(" ", "").split(".")
        fn = s[0]
        os.mkdir(fn)
        os.rename(f, fn + "/card." + s[1])