# botbear
Dank bot that does stuff, idk
Link to my commands: https://hotbear.org/
If you just want this bot in your channel just write "bb join" in #botbear1110 or #hbear___ :)
Made by: Mads Hauberg

## Building

```bash
$ git clone https://github.com/hotbear1110/botbear
$ cd botbear
$ ./configsetup.sh # optional script to setup needed credentials
```

Pre-commit setup
```bash
$ pip install pre-commit
$ pre-commit install
```

Docker setup

```bash
$ cd ..
$ sudo docker build --tag bot botbear
$ sudo docker run -p 3306:3306 -p 8080:8080 bot
# note that mysql database needs to be setup manually inside the container
```
